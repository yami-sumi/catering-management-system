--Creates the database if missing and installs schema.sql and seed.sql.
--npm run db:setup             -> Install schema and sample data
--npm run db:setup -- --no-seed -> Install schema only
--
-- SAFETY: Refuses to run if the database already contains public tables.
-- Existing application data will not be overwritten.
BEGIN;

INSERT INTO customer (first_name, last_name, email, phone, address) VALUES
('Maria', 'Santos', 'maria.santos@example.com', '09170000001', 'San Pedro, Laguna'),
('Paolo', 'Reyes', 'paolo.reyes@example.com', '09170000002', 'Muntinlupa City'),
('Ana', 'Cruz', 'ana.cruz@example.com', '09170000003', 'Las Pinas City');

INSERT INTO package (package_name, description, price_per_guest) VALUES
('Classic Filipino', 'Traditional Filipino buffet package', 450.00),
('Celebration', 'Buffet package for birthdays and family events', 650.00),
('Premium', 'Premium catering package for formal events', 950.00);

INSERT INTO menu_item (item_name, description, category, price) VALUES
('Chicken Adobo', 'Soy-vinegar braised chicken', 'Main Course', 180.00),
('Pancit Canton', 'Stir-fried noodles with vegetables', 'Noodles', 130.00),
('Leche Flan', 'Caramel custard dessert', 'Dessert', 85.00),
('Beef Caldereta', 'Beef stew with tomato sauce', 'Main Course', 240.00),
('Iced Tea', 'Chilled brewed tea', 'Beverage', 45.00);

INSERT INTO employee (first_name, last_name, role, phone, email) VALUES
('Jose', 'Garcia', 'Head Chef', '09170000011', 'jose.garcia@example.com'),
('Liza', 'Mendoza', 'Event Coordinator', '09170000012', 'liza.mendoza@example.com'),
('Carlo', 'Dela Cruz', 'Service Staff', '09170000013', 'carlo.delacruz@example.com');

INSERT INTO inventory (item_name, unit, quantity, availability_status) VALUES
('Rice', 'kg', 80, 'Available'),
('Chicken', 'kg', 35, 'Available'),
('Cooking Oil', 'liter', 20, 'Available'),
('Paper Plates', 'piece', 300, 'Available'),
('Table Napkins', 'pack', 0, 'Unavailable');

-- Resolve generated IDs by unique customer emails and package names.
INSERT INTO reservation (customer_id, package_id, event_date, venue, event_type, number_of_guests, status, estimated_cost)
VALUES
((SELECT customer_id FROM customer WHERE email = 'maria.santos@example.com'),
 (SELECT package_id FROM package WHERE package_name = 'Classic Filipino'),
 '2026-12-12', 'San Pedro Events Hall', 'Birthday', 50, 'Confirmed', 22500.00),
((SELECT customer_id FROM customer WHERE email = 'paolo.reyes@example.com'),
 (SELECT package_id FROM package WHERE package_name = 'Celebration'),
 '2026-12-19', 'Muntinlupa Function Room', 'Anniversary', 80, 'Pending', 52000.00),
((SELECT customer_id FROM customer WHERE email = 'ana.cruz@example.com'),
 (SELECT package_id FROM package WHERE package_name = 'Premium'),
 '2027-01-09', 'Las Pinas Convention Center', 'Corporate', 100, 'Cancelled', 95000.00);

INSERT INTO payment (reservation_id, payment_amount, payment_date, payment_status) VALUES
((SELECT r.reservation_id FROM reservation r JOIN customer c ON c.customer_id = r.customer_id WHERE c.email = 'maria.santos@example.com' AND r.event_date = '2026-12-12'), 10000.00, '2026-11-10', 'Paid'),
((SELECT r.reservation_id FROM reservation r JOIN customer c ON c.customer_id = r.customer_id WHERE c.email = 'paolo.reyes@example.com' AND r.event_date = '2026-12-19'), 5000.00, '2026-11-12', 'Pending');

INSERT INTO reservation_menu (reservation_id, menu_item_id, quantity) VALUES
((SELECT r.reservation_id FROM reservation r JOIN customer c ON c.customer_id = r.customer_id WHERE c.email = 'maria.santos@example.com' AND r.event_date = '2026-12-12'),
 (SELECT menu_item_id FROM menu_item WHERE item_name = 'Chicken Adobo'), 50),
((SELECT r.reservation_id FROM reservation r JOIN customer c ON c.customer_id = r.customer_id WHERE c.email = 'maria.santos@example.com' AND r.event_date = '2026-12-12'),
 (SELECT menu_item_id FROM menu_item WHERE item_name = 'Leche Flan'), 50),
((SELECT r.reservation_id FROM reservation r JOIN customer c ON c.customer_id = r.customer_id WHERE c.email = 'paolo.reyes@example.com' AND r.event_date = '2026-12-19'),
 (SELECT menu_item_id FROM menu_item WHERE item_name = 'Beef Caldereta'), 80);

INSERT INTO event_assignment (reservation_id, employee_id, assignment_role) VALUES
((SELECT r.reservation_id FROM reservation r JOIN customer c ON c.customer_id = r.customer_id WHERE c.email = 'maria.santos@example.com' AND r.event_date = '2026-12-12'),
 (SELECT employee_id FROM employee WHERE email = 'jose.garcia@example.com'), 'Head Chef'),
((SELECT r.reservation_id FROM reservation r JOIN customer c ON c.customer_id = r.customer_id WHERE c.email = 'maria.santos@example.com' AND r.event_date = '2026-12-12'),
 (SELECT employee_id FROM employee WHERE email = 'liza.mendoza@example.com'), 'Event Coordinator'),
((SELECT r.reservation_id FROM reservation r JOIN customer c ON c.customer_id = r.customer_id WHERE c.email = 'paolo.reyes@example.com' AND r.event_date = '2026-12-19'),
 (SELECT employee_id FROM employee WHERE email = 'carlo.delacruz@example.com'), 'Service Staff');

INSERT INTO cancellation (reservation_id, cancellation_date, cancellation_reason, cancellation_fee, refund_amount, cancellation_status)
VALUES
((SELECT r.reservation_id FROM reservation r JOIN customer c ON c.customer_id = r.customer_id WHERE c.email = 'ana.cruz@example.com' AND r.event_date = '2027-01-09'),
 '2026-11-15', 'Event plans changed', 0.00, 0.00, 'Completed');

COMMIT;
