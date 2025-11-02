-- ============================
-- INSERTAR PERSONAS
-- Clave Admin: admin123
-- Clave Usuarios: user123
-- ============================
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES 
(1, 'Administrador', 'admin@shipnet.com', '$2a$12$jFWWvVl.47emfuraZMnLheQ0O5iVH0E4IpGanpJqvP2cRmkziowJe', 'ADMIN'),
(2, 'Daniela Rodriguez', 'dani@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO'),
(3, 'Lucas Martinez', 'lucas@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO'),
(4, 'Sofia Gonzalez', 'sofia@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO'),
(5, 'Martin Lopez', 'martin@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO'),
(6, 'Valentina Fernandez', 'valen@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO'),
(7, 'Julian Perez', 'julian@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO'),
(8, 'Camila Diaz', 'camila@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO'),
(9, 'Facundo Torres', 'facundo@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO'),
(10, 'Martina Ruiz', 'martina@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO');

-- ============================
-- INSERTAR SALAS (6 total, 2 deshabilitadas)
-- ============================
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES
(1, 'Sala Principal', 20, TRUE),
(2, 'Sala de Conferencias', 15, TRUE),
(3, 'Sala de Capacitacion', 25, TRUE),
(4, 'Sala Ejecutiva', 8, TRUE),
(5, 'Sala en Mantenimiento', 12, FALSE),
(6, 'Sala Fuera de Servicio', 10, FALSE);

-- ============================
-- INSERTAR ARTICULOS (10 total, 4 deshabilitados)
-- ============================
INSERT INTO ARTICULO (id, nombre, disponible) VALUES 
(1, 'Proyector HD', TRUE),
(2, 'Notebook Dell', TRUE),
(3, 'Pizarra Electronica', TRUE),
(4, 'Microfono Inalambrico', TRUE),
(5, 'Sistema de Audio', TRUE),
(6, 'Camara Web 4K', TRUE),
(7, 'Proyector Averiado', FALSE),
(8, 'Notebook Antigua', FALSE),
(9, 'Microfono Defectuoso', FALSE),
(10, 'Parlantes Dañados', FALSE);

-- ============================
-- ============================

-- RESERVAS PASADAS (Octubre 2025)
INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (2, 1, 1, TIMESTAMP '2025-10-01 09:00:00', TIMESTAMP '2025-10-01 11:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (3, 2, 2, TIMESTAMP '2025-10-01 14:00:00', TIMESTAMP '2025-10-01 16:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (4, 3, 3, TIMESTAMP '2025-10-02 10:00:00', TIMESTAMP '2025-10-02 12:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (5, 4, 4, TIMESTAMP '2025-10-03 08:00:00', TIMESTAMP '2025-10-03 10:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (6, 1, 5, TIMESTAMP '2025-10-03 13:00:00', TIMESTAMP '2025-10-03 15:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (7, 2, 6, TIMESTAMP '2025-10-04 09:00:00', TIMESTAMP '2025-10-04 11:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (8, 3, 1, TIMESTAMP '2025-10-05 14:00:00', TIMESTAMP '2025-10-05 16:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (9, 4, 2, TIMESTAMP '2025-10-07 10:00:00', TIMESTAMP '2025-10-07 12:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (10, 1, 3, TIMESTAMP '2025-10-08 15:00:00', TIMESTAMP '2025-10-08 17:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (2, 2, 4, TIMESTAMP '2025-10-09 08:30:00', TIMESTAMP '2025-10-09 10:30:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (3, 3, 5, TIMESTAMP '2025-10-10 13:00:00', TIMESTAMP '2025-10-10 15:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (4, 4, 6, TIMESTAMP '2025-10-11 09:00:00', TIMESTAMP '2025-10-11 11:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (5, 1, 1, TIMESTAMP '2025-10-14 14:00:00', TIMESTAMP '2025-10-14 16:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (6, 2, 2, TIMESTAMP '2025-10-15 10:00:00', TIMESTAMP '2025-10-15 12:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (7, 3, 3, TIMESTAMP '2025-10-16 08:00:00', TIMESTAMP '2025-10-16 10:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (8, 4, 4, TIMESTAMP '2025-10-17 13:00:00', TIMESTAMP '2025-10-17 15:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (9, 1, 5, TIMESTAMP '2025-10-18 09:00:00', TIMESTAMP '2025-10-18 11:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (10, 2, 6, TIMESTAMP '2025-10-21 14:00:00', TIMESTAMP '2025-10-21 16:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (2, 3, 1, TIMESTAMP '2025-10-22 10:00:00', TIMESTAMP '2025-10-22 12:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (3, 4, 2, TIMESTAMP '2025-10-23 08:30:00', TIMESTAMP '2025-10-23 10:30:00');

-- RESERVAS FUTURAS (Noviembre-Diciembre 2025)
INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (4, 1, 3, TIMESTAMP '2025-11-04 09:00:00', TIMESTAMP '2025-11-04 11:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (5, 2, 4, TIMESTAMP '2025-11-04 14:00:00', TIMESTAMP '2025-11-04 16:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (6, 3, 5, TIMESTAMP '2025-11-05 10:00:00', TIMESTAMP '2025-11-05 12:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (7, 4, 6, TIMESTAMP '2025-11-06 08:00:00', TIMESTAMP '2025-11-06 10:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (8, 1, 1, TIMESTAMP '2025-11-07 13:00:00', TIMESTAMP '2025-11-07 15:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (9, 2, 2, TIMESTAMP '2025-11-08 09:00:00', TIMESTAMP '2025-11-08 11:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (10, 3, 3, TIMESTAMP '2025-11-11 14:00:00', TIMESTAMP '2025-11-11 16:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (2, 4, 4, TIMESTAMP '2025-11-12 10:00:00', TIMESTAMP '2025-11-12 12:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (3, 1, 5, TIMESTAMP '2025-11-13 08:30:00', TIMESTAMP '2025-11-13 10:30:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (4, 2, 6, TIMESTAMP '2025-11-14 13:00:00', TIMESTAMP '2025-11-14 15:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (5, 3, 1, TIMESTAMP '2025-11-15 09:00:00', TIMESTAMP '2025-11-15 11:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (6, 4, 2, TIMESTAMP '2025-11-18 14:00:00', TIMESTAMP '2025-11-18 16:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (7, 1, 3, TIMESTAMP '2025-11-19 10:00:00', TIMESTAMP '2025-11-19 12:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (8, 2, 4, TIMESTAMP '2025-11-20 08:00:00', TIMESTAMP '2025-11-20 10:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (9, 3, 5, TIMESTAMP '2025-11-21 13:00:00', TIMESTAMP '2025-11-21 15:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (10, 4, 6, TIMESTAMP '2025-11-22 09:00:00', TIMESTAMP '2025-11-22 11:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (2, 1, 1, TIMESTAMP '2025-12-02 14:00:00', TIMESTAMP '2025-12-02 16:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (3, 2, 2, TIMESTAMP '2025-12-03 10:00:00', TIMESTAMP '2025-12-03 12:00:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (4, 3, 3, TIMESTAMP '2025-12-04 08:30:00', TIMESTAMP '2025-12-04 10:30:00');

INSERT INTO RESERVA (persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) 
VALUES (5, 4, 4, TIMESTAMP '2025-12-05 13:00:00', TIMESTAMP '2025-12-05 15:00:00');

-- ============================
-- RESETEAR SECUENCIAS
-- ============================
ALTER TABLE PERSONA ALTER COLUMN id RESTART WITH 11;
ALTER TABLE SALA ALTER COLUMN id RESTART WITH 7;
ALTER TABLE ARTICULO ALTER COLUMN id RESTART WITH 11;