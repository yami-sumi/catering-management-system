"use strict";

// ---------- helpers ----------
const money = (v) => (v === null || v === undefined ? "" :
    Number(v).toLocaleString("en-PH", { style: "currency", currency: "PHP" }));
const fullName = (r) => `${r.first_name} ${r.last_name}`;
const STATUS = {
    reservation: ["Pending", "Confirmed", "Completed", "Cancelled", "Rejected"],
    payment: ["Pending", "Paid", "Refunded", "Failed"],
    inventory: ["Available", "Low Stock", "Unavailable"],
    cancellation: ["Pending", "Processed", "Rejected"],
    category: ["Appetizer", "Main Course", "Side Dish", "Dessert", "Beverage"]
};

// Reference lookups used by dropdowns
const REF = {
    customer: { api: "customers", value: "customer_id", label: (r) => `${r.customer_id} – ${fullName(r)}` },
    package: { api: "packages", value: "package_id", label: (r) => `${r.package_id} – ${r.package_name}` },
    reservation: { api: "reservations", value: "reservation_id",
        label: (r) => `#${r.reservation_id} – ${r.event_type}, ${r.event_date} (${fullName(r)})` },
    employee: { api: "employees", value: "employee_id", label: (r) => `${r.employee_id} – ${fullName(r)} (${r.position})` },
    menu: { api: "menu-items", value: "menu_item_id", label: (r) => `${r.menu_item_id} – ${r.item_name}` }
};

// ---------- module definitions ----------
// field: { name, label, type: text|textarea|number|int|date|select, ref?, options?, required?, keyField?  }
const MODULES = [
    { id: "customers", title: "Customers", api: "customers", key: ["customer_id"],
      columns: [["customer_id", "ID"], ["first_name", "First name"], ["last_name", "Last name"], ["email", "Email"], ["phone", "Phone"], ["address", "Address"]],
      fields: [
        { name: "first_name", label: "First name", type: "text", required: true },
        { name: "last_name", label: "Last name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone", type: "text" },
        { name: "address", label: "Address", type: "text" }] },
    { id: "packages", title: "Packages", api: "packages", key: ["package_id"],
      columns: [["package_id", "ID"], ["package_name", "Package"], ["description", "Description"], ["price_per_guest", "Price / guest", money]],
      fields: [
        { name: "package_name", label: "Package name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "price_per_guest", label: "Price per guest (PHP)", type: "number", required: true }] },
    { id: "menu-items", title: "Menu items", api: "menu-items", key: ["menu_item_id"],
      columns: [["menu_item_id", "ID"], ["item_name", "Item"], ["category", "Category"], ["description", "Description"], ["price", "Price", money]],
      fields: [
        { name: "item_name", label: "Item name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "category", label: "Category", type: "select", options: STATUS.category, required: true },
        { name: "price", label: "Price (PHP)", type: "number", required: true }] },
    { id: "employees", title: "Employees", api: "employees", key: ["employee_id"],
      columns: [["employee_id", "ID"], ["first_name", "First name"], ["last_name", "Last name"], ["position", "Position"], ["phone", "Phone"], ["email", "Email"]],
      fields: [
        { name: "first_name", label: "First name", type: "text", required: true },
        { name: "last_name", label: "Last name", type: "text", required: true },
        { name: "position", label: "Position", type: "text", required: true },
        { name: "phone", label: "Phone", type: "text" },
        { name: "email", label: "Email", type: "email" }] },
    { id: "inventory", title: "Inventory", api: "inventory", key: ["inventory_id"],
      columns: [["inventory_id", "ID"], ["item_name", "Item"], ["unit", "Unit"], ["quantity", "Qty", null, true], ["availability_status", "Status"]],
      fields: [
        { name: "item_name", label: "Item name", type: "text", required: true },
        { name: "unit", label: "Unit", type: "text", required: true },
        { name: "quantity", label: "Quantity", type: "int", required: true },
        { name: "availability_status", label: "Status", type: "select", options: STATUS.inventory }] },
    { id: "reservations", title: "Reservations", api: "reservations", key: ["reservation_id"],
      columns: [["reservation_id", "ID"], ["customer", "Customer", (v, r) => fullName(r)], ["package_name", "Package"], ["event_date", "Date"],
                ["event_type", "Event"], ["venue", "Venue"], ["number_of_guests", "Guests", null, true], ["estimated_cost", "Est. cost", money, true], ["status", "Status"]],
      fields: [
        { name: "customer_id", label: "Customer", type: "select", ref: "customer", required: true },
        { name: "package_id", label: "Package", type: "select", ref: "package", required: true },
        { name: "event_date", label: "Event date", type: "date", required: true },
        { name: "venue", label: "Venue", type: "text", required: true },
        { name: "event_type", label: "Event type", type: "text", required: true },
        { name: "number_of_guests", label: "Number of guests", type: "int", required: true },
        { name: "status", label: "Status", type: "select", options: STATUS.reservation }],
      note: "Estimated cost is calculated automatically (price per guest × guests)." },
    { id: "payments", title: "Payments", api: "payments", key: ["payment_id"],
      columns: [["payment_id", "ID"], ["reservation_id", "Reservation"], ["event_type", "Event"], ["payment_date", "Date"], ["payment_amount", "Amount", money, true], ["payment_status", "Status"], ["payment_method", "Method"], ["reference_number", "Reference"]],
      fields: [
        { name: "reservation_id", label: "Reservation", type: "select", ref: "reservation", required: true },
        { name: "payment_amount", label: "Amount (PHP)", type: "number", required: true },
        { name: "payment_date", label: "Payment date", type: "date", required: true },
        { name: "payment_status", label: "Status", type: "select", options: STATUS.payment },
        { name: "payment_method", label: "Method", type: "select", options: ["GCash", "Maya", "Bank Transfer", "Cash"] },
        { name: "reference_number", label: "Reference number", type: "text" }] },
    { id: "reservation-menu", title: "Reservation menu", api: "reservation-menu", key: ["reservation_id", "menu_item_id"],
      columns: [["reservation_id", "Reservation"], ["item_name", "Menu item"], ["category", "Category"], ["quantity", "Qty", null, true], ["price", "Unit price", money, true], ["line_total", "Total", money, true]],
      fields: [
        { name: "reservation_id", label: "Reservation", type: "select", ref: "reservation", required: true, keyField: true },
        { name: "menu_item_id", label: "Menu item", type: "select", ref: "menu", required: true, keyField: true },
        { name: "quantity", label: "Quantity", type: "int", required: true }] },
    { id: "event-assignments", title: "Event assignments", api: "event-assignments", key: ["reservation_id", "employee_id"],
      columns: [["reservation_id", "Reservation"], ["employee_id", "Employee ID"], ["assignment_role", "Role"]],
      fields: [
        { name: "reservation_id", label: "Reservation", type: "select", ref: "reservation", required: true, keyField: true },
        { name: "employee_id", label: "Employee", type: "select", ref: "employee", required: true, keyField: true },
        { name: "assignment_role", label: "Assignment role", type: "text", required: true }] },
    { id: "cancellations", title: "Cancellations", api: "cancellations", key: ["cancellation_id"],
      columns: [["cancellation_id", "ID"], ["reservation_id", "Reservation"], ["cancellation_date", "Date"], ["cancellation_reason", "Reason"],
                ["cancellation_fee", "Fee", money, true], ["refund_amount", "Refund", money, true], ["cancellation_status", "Status"]],
      fields: [
        { name: "reservation_id", label: "Reservation", type: "select", ref: "reservation", required: true },
        { name: "cancellation_date", label: "Cancellation date", type: "date", required: true },
        { name: "cancellation_reason", label: "Reason", type: "textarea" },
        { name: "cancellation_fee", label: "Fee (PHP)", type: "number" },
        { name: "refund_amount", label: "Refund (PHP)", type: "number" },
        { name: "cancellation_status", label: "Status", type: "select", options: STATUS.cancellation }],
      note: "New cancellation requests are Pending. Processing a cancellation changes the reservation status to Cancelled."
  }
];

// ---------- DOM ----------
const $ = (id) => document.getElementById(id);
const el = (tag, attrs = {}, ...kids) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (k === "class") e.className = v;
        else if (k === "text") e.textContent = v;
        else e.setAttribute(k, v);
    }
    kids.forEach((k) => e.append(k));
    return e;
};

let current = MODULES[0];
let rows = [];
let editing = null; // row being edited, or null when adding
const refCache = {};

async function api(path, options = {}) {
    const res = await fetch(`/api/${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options
    });
    let body = null;
    try { body = await res.json(); } catch (_) { /* empty body */ }
    if (!res.ok) throw new Error((body && body.message) || `Request failed (${res.status})`);
    return body;
}

const keyPath = (m, row) => m.key.map((k) => encodeURIComponent(row[k])).join("/");

function notify(msg, isError = false) {
    const n = $("notice");
    n.textContent = msg;
    n.className = "notice" + (isError ? " error" : "");
    n.hidden = false;
    clearTimeout(notify.t);
    notify.t = setTimeout(() => (n.hidden = true), 4500);
}

// ---------- table ----------
async function load() {
    $("title").textContent = current.title;
    try {
        rows = await api(current.api);
    } catch (e) {
        rows = [];
        notify(e.message, true);
    }
    renderTable();
}

function renderTable() {
    const table = $("table");
    table.replaceChildren();
    const head = el("tr");
    current.columns.forEach(([, label]) => head.append(el("th", { text: label })));
    head.append(el("th"));
    table.append(el("thead", {}, head));

    const body = el("tbody");
    rows.forEach((row) => {
        const tr = el("tr");
        current.columns.forEach(([name, , fmt, num]) => {
            const raw = row[name];
            const text = fmt ? fmt(raw, row) : raw === null || raw === undefined ? "" : String(raw);
            const td = el("td", { text });
            if (num) td.className = "num";
            if (text) td.title = text;
            tr.append(td);
        });
        const edit = el("button", { class: "btn small", text: "Edit" });
        edit.onclick = () => openForm(row);
        const del = el("button", { class: "btn small danger", text: "Delete" });
        del.onclick = () => remove(row);
        tr.append(el("td", { class: "act" }, edit, del));
        body.append(tr);
    });
    table.append(body);
    $("empty").hidden = rows.length > 0;
}

async function remove(row) {
    if (!confirm("Delete this record? This cannot be undone.")) return;
    try {
        const r = await api(`${current.api}/${keyPath(current, row)}`, { method: "DELETE" });
        notify(r.message || "Deleted.");
        load();
    } catch (e) { notify(e.message, true); }
}

// ---------- form ----------
async function refOptions(refName) {
    const ref = REF[refName];
    const data = await api(ref.api);
    return data.map((r) => [r[ref.value], ref.label(r)]);
}


async function openForm(row) {
    editing = row || null;
    const m = current;
    $("dlgTitle").textContent = (row ? "Edit" : "Add") + " · " + m.title;
    $("formError").hidden = true;
    const box = $("fields");
    box.replaceChildren();

    for (const f of m.fields) {
        const id = "f_" + f.name;
        let input;

        if (f.type === "select") {
            input = el("select", { id, name: f.name });
            const opts = f.ref
                ? await refOptions(f.ref).catch(() => [])
                : f.options.map((o) => [o, o]);

            input.append(el("option", {
                value: "",
                text: f.required ? "Select…" : "(default)"
            }));

            opts.forEach(([v, label]) =>
                input.append(el("option", { value: v, text: label }))
            );

        } else if (f.type === "textarea") {
            input = el("textarea", { id, name: f.name, rows: 3 });

        } else {
            const type = f.type === "int" ? "number" : f.type;
            input = el("input", { id, name: f.name, type });

            if (f.type === "int") {
                input.step = "1";
                input.min = "0";
            }

            if (f.type === "number") {
                input.step = "0.01";
                input.min = "0";
            }
        }

        if (f.required) input.required = true;

        if (row) {
            const v = row[f.name];

            if (v === null || v === undefined) {
                input.value = "";
            } else if (input.type === "date") {
                input.value = String(v).slice(0, 10);
            } else if (input.type === "datetime-local") {
                input.value = String(v).slice(0, 16);
            } else {
                input.value = v;
            }

            if (f.keyField) input.disabled = true;
        }

        box.append(
            el("label", {
                for: id,
                text: f.label + (f.required ? " *" : "")
            }),
            input
        );
    }

    if (m.note) {
        box.append(el("p", {
            class: "empty",
            text: m.note
        }));
    }

    $("dlg").showModal();
}

function collect() {
    const body = {};
    for (const f of current.fields) {
        const input = $("f_" + f.name);
        if (!input) continue;
        let v = input.value.trim();
        if (v === "") { body[f.name] = f.required ? "" : null; continue; }
        if (f.type === "int" || (f.type === "select" && f.ref)) v = Number(v);
        else if (f.type === "number") v = Number(v);
        body[f.name] = v;
    }
    return body;
}

$("form").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const body = collect();
    try {
        const path = editing ? `${current.api}/${keyPath(current, editing)}` : current.api;
        const r = await api(path, { method: editing ? "PUT" : "POST", body: JSON.stringify(body) });
        $("dlg").close();
        notify(r.message || "Saved.");
        load();
    } catch (e) {
        $("formError").textContent = e.message;
        $("formError").hidden = false;
    }
});
$("cancelBtn").onclick = () => $("dlg").close();
$("addBtn").onclick = () => openForm(null);

// ---------- nav + status ----------
function buildNav() {
    const nav = $("nav");
    MODULES.forEach((m) => {
        const b = el("button", { text: m.title });
        b.onclick = () => {
            current = m;
            [...nav.children].forEach((c) => c.classList.toggle("active", c === b));
            load();
        };
        if (m === current) b.classList.add("active");
        nav.append(b);
    });
}

async function checkDb() {
    const s = $("dbStatus");
    try {
        const r = await api("db-test");
        s.textContent = "● " + r.database;
        s.className = "status ok";
    } catch (_) {
        s.textContent = "● database unreachable";
        s.className = "status bad";
    }
}

buildNav();
checkDb();
load();

// Refresh incoming reservations, payment submissions and cancellation requests
setInterval(() => {
    if (["reservations", "payments", "cancellations"].includes(current.id) && !document.hidden && !$("dlg").open) {
        load();
    }
}, 5000);
