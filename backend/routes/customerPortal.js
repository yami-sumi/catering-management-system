// Customer-only API. The existing staff API remains separate.
const express = require('express');
const crypto = require('crypto');
const pool = require('../db');
const router = express.Router();
const secret = process.env.CUSTOMER_SESSION_SECRET;
const safe = (v, max = 255) => typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;
const positiveId = v => Number.isSafeInteger(Number(v)) && Number(v) > 0;
const publicCustomer = c => ({customer_id:c.customer_id, first_name:c.first_name, last_name:c.last_name, email:c.email, phone:c.phone, address:c.address});
const b64 = value => Buffer.from(JSON.stringify(value)).toString('base64url');
function sign(customerId) {
  const payload = b64({id:customerId, exp:Date.now() + 8 * 60 * 60 * 1000});
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}
function authenticate(req,res,next) {
  if (!secret || secret.length < 32) return res.status(503).json({message:'Customer sessions are not configured. Set CUSTOMER_SESSION_SECRET.'});
  const token = (req.get('Authorization') || '').replace(/^Bearer\s+/i,'');
  const parts = token.split('.');
  if (parts.length !== 2) return res.status(401).json({message:'Please sign in.'});
  const expected = crypto.createHmac('sha256',secret).update(parts[0]).digest();
  let provided;
  try { provided = Buffer.from(parts[1], 'base64url'); } catch { return res.status(401).json({message:'Invalid session.'}); }
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided,expected)) return res.status(401).json({message:'Invalid session.'});
  try {
    const data = JSON.parse(Buffer.from(parts[0],'base64url').toString());
    if (!positiveId(data.id) || !Number.isFinite(data.exp) || data.exp < Date.now()) throw Error();
    req.customerId = Number(data.id);
    next();
  } catch { res.status(401).json({message:'Session expired. Please sign in again.'}); }
}
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  return new Promise((resolve,reject)=>crypto.scrypt(password,salt,64,(e,key)=>e?reject(e):resolve(`${salt}:${key.toString('hex')}`)));
}
function checkPassword(password, stored) {
  return new Promise(resolve => {
    if (!stored || !/^[0-9a-f]{32}:[0-9a-f]{128}$/.test(stored)) return resolve(false);
    const [salt,hash] = stored.split(':');
    crypto.scrypt(password,salt,64,(e,key)=>resolve(!e && crypto.timingSafeEqual(key,Buffer.from(hash,'hex'))));
  });
}
router.post('/register',async(req,res)=>{
  if (!secret || secret.length < 32) return res.status(503).json({message:'Customer sessions are not configured.'});
  const {first_name,last_name,email,password,phone,address} = req.body || {};
  if (!safe(first_name,50)||!safe(last_name,50)||!safe(email,100)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof password!=='string'||password.length<8||password.length>128)
    return res.status(400).json({message:'Enter your name, valid email, and password (8–128 characters).'});
  if ((phone && !safe(phone,20)) || (address && !safe(address,255))) return res.status(400).json({message:'Phone or address is too long.'});
  try {
    const duplicate = await pool.query('SELECT 1 FROM customer WHERE LOWER(email)=LOWER($1) LIMIT 1',[email.trim()]);
    if(duplicate.rowCount) return res.status(409).json({message:'Email already exists. Contact staff if you need account access.'});
    const hashed = await hashPassword(password);
    const {rows} = await pool.query(`INSERT INTO customer (first_name,last_name,email,phone,address,password_hash)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING customer_id,first_name,last_name,email,phone,address`,
      [first_name.trim(),last_name.trim(),email.trim().toLowerCase(),phone||null,address||null,hashed]);
    res.status(201).json({customer:publicCustomer(rows[0]),token:sign(rows[0].customer_id)});
  } catch(e) { if(e.code==='23505') return res.status(409).json({message:'Email already registered.'}); console.error(e);res.status(500).json({message:'Could not create account. Check the customer migration.'}); }
});
router.post('/login',async(req,res)=>{
  const {email,password} = req.body||{};
  if (!safe(email,100)||typeof password!=='string') return res.status(400).json({message:'Enter email and password.'});
  try {
    const {rows} = await pool.query(
  'SELECT * FROM customer WHERE LOWER(email)=LOWER($1) AND password_hash IS NOT NULL ORDER BY customer_id DESC LIMIT 1',
  [email.trim()]
);
    if(!rows.length || !(await checkPassword(password,rows[0].password_hash))) return res.status(401).json({message:'Incorrect email or password.'});
    if(!secret || secret.length<32) return res.status(503).json({message:'Customer sessions are not configured.'});
    res.json({customer:publicCustomer(rows[0]),token:sign(rows[0].customer_id)});
  } catch(e) {console.error(e);res.status(500).json({message:'Login failed. Check the customer migration.'});}
});
router.get('/me',authenticate,async(req,res)=>{
  try { const {rows}=await pool.query('SELECT customer_id,first_name,last_name,email,phone,address FROM customer WHERE customer_id=$1',[req.customerId]);
    if(!rows.length) return res.status(401).json({message:'Account no longer exists.'});res.json(rows[0]);
  } catch(e){console.error(e);res.status(500).json({message:'Could not load profile.'});}
});
router.put('/me',authenticate,async(req,res)=>{
  const {first_name,last_name,phone,address}=req.body||{};
  if(!safe(first_name,50)||!safe(last_name,50)||(phone&&!safe(phone,20))||(address&&!safe(address,255))) return res.status(400).json({message:'Please enter valid profile information.'});
  try {const {rows}=await pool.query(`UPDATE customer SET first_name=$1,last_name=$2,phone=$3,address=$4 WHERE customer_id=$5 RETURNING customer_id,first_name,last_name,email,phone,address`,[first_name.trim(),last_name.trim(),phone||null,address||null,req.customerId]);if(!rows.length)return res.status(404).json({message:'Account not found.'});res.json(rows[0]);}
  catch(e){console.error(e);res.status(500).json({message:'Could not update profile.'});}
});
router.get('/packages',async(req,res)=>{try {res.json((await pool.query('SELECT package_id,package_name,description,price_per_guest FROM package ORDER BY package_id')).rows);}catch(e){res.status(500).json({message:'Could not load packages.'});}});
router.get('/menu',async(req,res)=>{try {res.json((await pool.query('SELECT menu_item_id,item_name,description,category,price FROM menu_item ORDER BY category,item_name')).rows);}catch(e){res.status(500).json({message:'Could not load menu.'});}});
router.get('/reservations',authenticate,async(req,res)=>{
  try {const {rows}=await pool.query(`SELECT r.reservation_id,r.event_date,r.event_type,r.venue,r.number_of_guests,r.status,r.estimated_cost,
    p.package_name,p.price_per_guest, COALESCE((SELECT json_agg(json_build_object('item_name',m.item_name,'quantity',rm.quantity) ORDER BY m.item_name) FROM reservation_menu rm JOIN menu_item m ON m.menu_item_id=rm.menu_item_id WHERE rm.reservation_id=r.reservation_id),'[]'::json) AS menu_items,
    COALESCE((SELECT SUM(payment_amount) FROM payment WHERE reservation_id=r.reservation_id AND payment_status='Paid'),0) AS paid_amount,
    COALESCE((SELECT json_agg(json_build_object('payment_id',py.payment_id,'payment_amount',py.payment_amount,'payment_status',py.payment_status,'payment_method',py.payment_method,'reference_number',py.reference_number) ORDER BY py.payment_id DESC) FROM payment py WHERE py.reservation_id=r.reservation_id),'[]'::json) AS payments,
    COALESCE((SELECT json_agg(json_build_object('cancellation_id',ca.cancellation_id,'cancellation_status',ca.cancellation_status,'cancellation_reason',ca.cancellation_reason) ORDER BY ca.cancellation_id DESC) FROM cancellation ca WHERE ca.reservation_id=r.reservation_id),'[]'::json) AS cancellations
    FROM reservation r JOIN package p ON p.package_id=r.package_id WHERE r.customer_id=$1 ORDER BY r.event_date DESC,r.reservation_id DESC`,[req.customerId]);res.json(rows);
  }catch(e){console.error(e);res.status(500).json({message:'Could not load reservations.'});}
});
router.post('/reservations',authenticate,async(req,res)=>{
  const {package_id,event_date,venue,event_type,number_of_guests,menu_items=[]}=req.body||{};
  if(!positiveId(package_id)||!safe(event_date,30)||!/^\d{4}-\d{2}-\d{2}$/.test(event_date)||!Number.isFinite(Date.parse(`${event_date}T00:00:00Z`))||event_date<new Date().toISOString().slice(0,10)||!safe(venue,255)||!safe(event_type,50)||!positiveId(number_of_guests)||Number(number_of_guests)>100000||!Array.isArray(menu_items)||menu_items.length>50)
    return res.status(400).json({message:'Enter a future event date, venue, event type, package, and valid guest count.'});
  const selected=menu_items.filter(x=>x && x.quantity!=='' && x.quantity!==0);
  if(selected.some(x=>!positiveId(x.menu_item_id)||!positiveId(x.quantity)||Number(x.quantity)>100000)||new Set(selected.map(x=>String(x.menu_item_id))).size!==selected.length)
    return res.status(400).json({message:'Menu selections must have unique items and positive quantities.'});
  const client=await pool.connect();
  try {
    await client.query('BEGIN');
    const p=(await client.query('SELECT price_per_guest FROM package WHERE package_id=$1',[package_id])).rows[0];
    if(!p){await client.query('ROLLBACK');return res.status(404).json({message:'Package not found.'});}
    // Estimated cost matches the existing admin API: package price x guest count.
    // Menu choices are recorded; any additional menu charges require staff quotation.
    const cost=(Number(p.price_per_guest)*Number(number_of_guests)).toFixed(2);
    const {rows}=await client.query(`INSERT INTO reservation (customer_id,package_id,event_date,venue,event_type,number_of_guests,status,estimated_cost)
      VALUES ($1,$2,$3,$4,$5,$6,'Pending',$7) RETURNING reservation_id,status,estimated_cost`,[req.customerId,package_id,event_date,venue.trim(),event_type.trim(),number_of_guests,cost]);
    for(const item of selected) await client.query('INSERT INTO reservation_menu (reservation_id,menu_item_id,quantity) VALUES ($1,$2,$3)',[rows[0].reservation_id,item.menu_item_id,item.quantity]);
    await client.query('COMMIT');res.status(201).json({message:'Request submitted for staff review.',reservation:rows[0]});
  }catch(e){await client.query('ROLLBACK');console.error(e);res.status(e.code==='23503'?400:500).json({message:e.code==='23503'?'A selected menu item is no longer available.':'Could not submit reservation.'});}
  finally{client.release();}
});
// Customers submit payment DETAILS only. Staff must independently verify funds.
router.post('/reservations/:id/payments',authenticate,async(req,res)=>{
  const {payment_amount,payment_method,reference_number}=req.body||{};
  if(!positiveId(req.params.id)||!Number.isFinite(Number(payment_amount))||Number(payment_amount)<=0||Number(payment_amount)>99999999||!['GCash','Maya','Bank Transfer','Cash'].includes(payment_method)||!safe(reference_number,100))
    return res.status(400).json({message:'Enter a valid amount, method and reference number.'});
  const client=await pool.connect();
  try {
    await client.query('BEGIN');
    const {rows}=await client.query('SELECT reservation_id,status,estimated_cost FROM reservation WHERE reservation_id=$1 AND customer_id=$2 FOR UPDATE',[req.params.id,req.customerId]);
    if(!rows.length){await client.query('ROLLBACK');return res.status(404).json({message:'Reservation not found.'});}
    if(rows[0].status!=='Confirmed'){await client.query('ROLLBACK');return res.status(409).json({message:'Payment details can be submitted after staff confirms the reservation.'});}
    const totals=await client.query("SELECT COALESCE(SUM(payment_amount) FILTER (WHERE payment_status IN ('Paid','Pending')),0) AS committed FROM payment WHERE reservation_id=$1",[req.params.id]);
    if(Number(payment_amount)>Number(rows[0].estimated_cost)-Number(totals.rows[0].committed)+0.001){await client.query('ROLLBACK');return res.status(409).json({message:'Amount exceeds the unpaid balance, including pending submissions.'});}
    const result=await client.query("INSERT INTO payment (reservation_id,payment_amount,payment_date,payment_status,payment_method,reference_number) VALUES ($1,$2,CURRENT_DATE,'Pending',$3,$4) RETURNING *",[req.params.id,payment_amount,payment_method,reference_number.trim()]);
    await client.query('COMMIT');res.status(201).json({message:'Payment details submitted for staff verification. This does not confirm receipt of funds.',payment:result.rows[0]});
  }catch(e){await client.query('ROLLBACK');console.error(e);res.status(500).json({message:'Could not submit payment details. Check migration 002.'});}finally{client.release();}
});
// A request does not cancel the event until staff processes it.
router.post('/reservations/:id/cancellations',authenticate,async(req,res)=>{
  const {reason}=req.body||{};
  if(!positiveId(req.params.id)||!safe(reason,255))return res.status(400).json({message:'Enter a cancellation reason (up to 255 characters).'});
  const client=await pool.connect();
  try{
    await client.query('BEGIN');
    const {rows}=await client.query('SELECT status FROM reservation WHERE reservation_id=$1 AND customer_id=$2 FOR UPDATE',[req.params.id,req.customerId]);
    if(!rows.length){await client.query('ROLLBACK');return res.status(404).json({message:'Reservation not found.'});}
    if(!['Pending','Confirmed'].includes(rows[0].status)){await client.query('ROLLBACK');return res.status(409).json({message:'This reservation cannot be cancelled.'});}
    const existing=await client.query("SELECT 1 FROM cancellation WHERE reservation_id=$1 AND cancellation_status IN ('Pending','Processed') LIMIT 1",[req.params.id]);
    if(existing.rowCount){await client.query('ROLLBACK');return res.status(409).json({message:'A cancellation request already exists or was processed.'});}
    const result=await client.query("INSERT INTO cancellation (reservation_id,cancellation_date,cancellation_reason,cancellation_status) VALUES ($1,CURRENT_DATE,$2,'Pending') RETURNING *",[req.params.id,reason.trim()]);
    await client.query('COMMIT');res.status(201).json({message:'Cancellation request submitted for staff review.',cancellation:result.rows[0]});
  }catch(e){await client.query('ROLLBACK');console.error(e);res.status(500).json({message:'Could not request cancellation.'});}finally{client.release();}
});
module.exports=router;
