const express=require('express');
const router=express.Router();
const pool=require('../db');
const fail=(res,e)=>{console.error(e);res.status(500).json({message:'Cancellation operation failed.'});};
router.get('/',async(req,res)=>{try{res.json((await pool.query('SELECT * FROM cancellation ORDER BY cancellation_id DESC')).rows);}catch(e){fail(res,e);}});
router.get('/:id',async(req,res)=>{try{const {rows}=await pool.query('SELECT * FROM cancellation WHERE cancellation_id=$1',[req.params.id]);return rows.length?res.json(rows[0]):res.status(404).json({message:'Cancellation not found.'});}catch(e){fail(res,e);}});
async function save(req,res,updating){
 const {reservation_id,cancellation_date,cancellation_reason,cancellation_fee,refund_amount,cancellation_status}=req.body||{};
 if(!Number.isSafeInteger(Number(reservation_id))||Number(reservation_id)<=0||!/^\d{4}-\d{2}-\d{2}$/.test(cancellation_date||'')||!['Pending','Processed','Rejected'].includes(cancellation_status||'Pending'))return res.status(400).json({message:'Invalid cancellation details.'});
 if([cancellation_fee,refund_amount].some(v=>v!==null&&v!==undefined&&v!==''&&(!Number.isFinite(Number(v))||Number(v)<0)))return res.status(400).json({message:'Fees and refunds cannot be negative.'});
 const client=await pool.connect();try{
  await client.query('BEGIN');
  const reservation=await client.query('SELECT status FROM reservation WHERE reservation_id=$1 FOR UPDATE',[reservation_id]);
  if(!reservation.rowCount){await client.query('ROLLBACK');return res.status(404).json({message:'Reservation not found.'});}
  let old=null;
  if(updating){const prev=await client.query('SELECT * FROM cancellation WHERE cancellation_id=$1 FOR UPDATE',[req.params.id]);if(!prev.rowCount){await client.query('ROLLBACK');return res.status(404).json({message:'Cancellation not found.'});}old=prev.rows[0];if(Number(old.reservation_id)!==Number(reservation_id)){await client.query('ROLLBACK');return res.status(409).json({message:'Cannot reassign a cancellation to another reservation.'});}if(old.cancellation_status==='Processed'&&cancellation_status!=='Processed'){await client.query('ROLLBACK');return res.status(409).json({message:'A processed cancellation cannot be reopened.'});}}
  if(cancellation_status==='Processed'&&reservation.rows[0].status==='Completed'){await client.query('ROLLBACK');return res.status(409).json({message:'Completed events cannot be cancelled.'});}
  const vals=[reservation_id,cancellation_date,cancellation_reason||null,cancellation_fee===''?null:cancellation_fee??null,refund_amount===''?null:refund_amount??null,cancellation_status||'Pending'];
  const q=updating?`UPDATE cancellation SET reservation_id=$1,cancellation_date=$2,cancellation_reason=$3,cancellation_fee=$4,refund_amount=$5,cancellation_status=$6 WHERE cancellation_id=$7 RETURNING *`:`INSERT INTO cancellation (reservation_id,cancellation_date,cancellation_reason,cancellation_fee,refund_amount,cancellation_status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
  const {rows}=await client.query(q,updating?[...vals,req.params.id]:vals);
  if(cancellation_status==='Processed')await client.query("UPDATE reservation SET status='Cancelled' WHERE reservation_id=$1",[reservation_id]);
  await client.query('COMMIT');res.status(updating?200:201).json({message:updating?'Cancellation updated.':'Cancellation created.',cancellation:rows[0]});
 }catch(e){await client.query('ROLLBACK');fail(res,e);}finally{client.release();}
}
router.post('/',(req,res)=>save(req,res,false));router.put('/:id',(req,res)=>save(req,res,true));
router.delete('/:id',async(req,res)=>{try{const {rows}=await pool.query("DELETE FROM cancellation WHERE cancellation_id=$1 AND cancellation_status<>'Processed' RETURNING *",[req.params.id]);return rows.length?res.json({message:'Cancellation deleted.',cancellation:rows[0]}):res.status(409).json({message:'Not found or already processed; processed cancellations cannot be deleted.'});}catch(e){fail(res,e);}});
module.exports=router;
