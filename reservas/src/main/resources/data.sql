-- ============================
-- INSERTAR PERSONAS Clave Admin: admin123   Clave USUARIO: user123 
-- ============================
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES (1, 'Administrador', 'admin@shipnet.com', '$2a$12$jFWWvVl.47emfuraZMnLheQ0O5iVH0E4IpGanpJqvP2cRmkziowJe', 'ADMIN');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES (2, 'Daniela', 'dani@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES (3, 'Lucia', 'lucia@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES(4, 'Juan', 'juan@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES(5, 'Sofia', 'sofia@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES(6, 'Carlos', 'carlos@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES(7, 'Valentina', 'valen@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES(8, 'Marcos', 'marcos@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES(9, 'Ana', 'ana@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES(10, 'Franco', 'franco@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES(11, 'Julia', 'julia@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES(12, 'Pedro', 'pedro@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES(13, 'Florencia', 'flor@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES(14, 'Andres', 'andres@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES(15, 'Camila', 'camila@example.com', '$2a$12$4cNHDtbEOL9wSKJxPkRhguyDvP0zki6cRKYu.V1HmUQf7yTZM2A2.', 'USUARIO');



-- ============================
-- INSERTAR SALAS
-- ============================
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(1, 'Sala A', 8, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(2, 'Sala B', 10, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(3, 'Sala C', 12, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(4, 'Sala D', 15, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(5, 'Sala E', 20, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(6, 'Sala F', 8, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(7, 'Sala G', 10, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(8, 'Sala H', 12, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(9, 'Sala I', 15, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(10, 'Sala J', 20, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(11, 'Sala K', 8, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(12, 'Sala L', 10, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(13, 'Sala M', 12, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(14, 'Sala N', 15, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(15, 'Sala O', 20, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(16, 'Sala P', 8, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(17, 'Sala Q', 10, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(18, 'Sala R', 12, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(19, 'Sala S', 15, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(20, 'Sala T', 20, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(21, 'Sala 1', 10, TRUE);
INSERT INTO SALA (id, nombre, capacidad, disponible) VALUES(22, 'Sala 2', 20, FALSE);

-- ============================
-- INSERTAR ARTICULOS
-- ============================
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (1, 'Proyector', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (2, 'Notebook', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (3, 'Pizarra ElectrÃ³nica', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (4, 'MicrÃ³fono', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (5, 'Parlantes', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (6, 'Cable HDMI', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (7, 'Control Remoto', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (8, 'CÃ¡mara Web', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (9, 'Router Wi-Fi', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (10, 'ExtensiÃ³n ElÃ©ctrica', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (11, 'Monitor 27"', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (12, 'Silla ErgonÃ³mica', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (13, 'Mesa de ReuniÃ³n', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (14, 'Teclado', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (15, 'Mouse', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (16, 'Tablet', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (17, 'Proyector PortÃ¡til', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (18, 'Auriculares', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (19, 'MicrÃ³fono InalÃ¡mbrico', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (20, 'Impresora', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (21, 'Scanner', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (22, 'TV 42"', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (23, 'Adaptador VGA', FALSE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (24, 'Altavoz Bluetooth', FALSE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (25, 'Notebook vieja', FALSE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (26, 'CÃ¡mara DaÃ±ada', FALSE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (27, 'MicrÃ³fono Defectuoso', FALSE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (28, 'Proyector Antiguo', FALSE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (29, 'Soporte Proyector', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (30, 'Pantalla Plegable', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (31, 'Reproductor Multimedia', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (32, 'Disco Externo', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (33, 'Router Secundario', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (34, 'Cable Ethernet', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (35, 'MicrÃ³fono de Sala', TRUE);

-- ============================
-- INSERTAR RESERVAS
-- ============================
-- Nota: IDs de persona, sala y artÃ­culo deben existir
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (1, 2, 1, 1, TIMESTAMP '2025-09-01 10:00:00', TIMESTAMP '2025-09-01 11:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (2, 3, 2, 2, TIMESTAMP '2025-09-02 09:00:00', TIMESTAMP '2025-09-02 10:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (3, 4, 3, 3, TIMESTAMP '2025-09-03 14:00:00', TIMESTAMP '2025-09-03 15:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (4, 5, 4, 4, TIMESTAMP '2025-09-04 08:00:00', TIMESTAMP '2025-09-04 09:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (5, 6, 5, 5, TIMESTAMP '2025-09-05 16:00:00', TIMESTAMP '2025-09-05 17:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (6, 7, 6, 6, TIMESTAMP '2025-09-06 11:00:00', TIMESTAMP '2025-09-06 12:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (7, 8, 7, 7, TIMESTAMP '2025-09-07 09:00:00', TIMESTAMP '2025-09-07 10:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (8, 9, 8, 8, TIMESTAMP '2025-09-08 15:00:00', TIMESTAMP '2025-09-08 16:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (9, 10, 9, 9, TIMESTAMP '2025-09-09 13:00:00', TIMESTAMP '2025-09-09 14:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (10, 11, 10, 10, TIMESTAMP '2025-09-10 09:30:00', TIMESTAMP '2025-09-10 11:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (11, 12, 11, 11, TIMESTAMP '2025-09-11 10:00:00', TIMESTAMP '2025-09-11 11:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (12, 13, 12, 12, TIMESTAMP '2025-09-12 08:30:00', TIMESTAMP '2025-09-12 10:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (13, 14, 13, 13, TIMESTAMP '2025-09-13 14:00:00', TIMESTAMP '2025-09-13 15:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (14, 15, 14, 14, TIMESTAMP '2025-09-14 09:00:00', TIMESTAMP '2025-09-14 10:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (15, 2, 15, 15, TIMESTAMP '2025-09-15 16:00:00', TIMESTAMP '2025-09-15 17:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (16, 3, 16, 16, TIMESTAMP '2025-09-16 13:00:00', TIMESTAMP '2025-09-16 14:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (17, 4, 17, 17, TIMESTAMP '2025-09-17 11:00:00', TIMESTAMP '2025-09-17 12:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (18, 5, 18, 18, TIMESTAMP '2025-09-18 15:00:00', TIMESTAMP '2025-09-18 16:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (19, 6, 19, 19, TIMESTAMP '2025-09-19 09:00:00', TIMESTAMP '2025-09-19 10:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (20, 7, 20, 20, TIMESTAMP '2025-09-20 08:30:00', TIMESTAMP '2025-09-20 10:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (21, 8, 1, 21, TIMESTAMP '2025-09-21 09:00:00', TIMESTAMP '2025-09-21 10:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (22, 9, 2, 22, TIMESTAMP '2025-09-22 14:00:00', TIMESTAMP '2025-09-22 15:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (23, 10, 3, 23, TIMESTAMP '2025-09-23 10:00:00', TIMESTAMP '2025-09-23 11:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (24, 11, 4, 24, TIMESTAMP '2025-09-24 09:00:00', TIMESTAMP '2025-09-24 10:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (25, 12, 5, 25, TIMESTAMP '2025-09-25 15:00:00', TIMESTAMP '2025-09-25 16:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (26, 13, 6, 26, TIMESTAMP '2025-09-26 13:00:00', TIMESTAMP '2025-09-26 14:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (27, 14, 7, 27, TIMESTAMP '2025-09-27 08:00:00', TIMESTAMP '2025-09-27 09:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (28, 15, 8, 28, TIMESTAMP '2025-09-28 10:00:00', TIMESTAMP '2025-09-28 11:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (29, 2, 9, 29, TIMESTAMP '2025-09-29 09:00:00', TIMESTAMP '2025-09-29 10:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (30, 3, 10, 30, TIMESTAMP '2025-09-30 14:00:00', TIMESTAMP '2025-09-30 15:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (31, 4, 11, 31, TIMESTAMP '2025-10-01 08:00:00', TIMESTAMP '2025-10-01 09:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (32, 5, 12, 32, TIMESTAMP '2025-10-02 11:00:00', TIMESTAMP '2025-10-02 12:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (33, 6, 13, 33, TIMESTAMP '2025-10-03 16:00:00', TIMESTAMP '2025-10-03 17:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (34, 7, 14, 34, TIMESTAMP '2025-10-04 09:00:00', TIMESTAMP '2025-10-04 10:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (35, 8, 15, 35, TIMESTAMP '2025-10-05 14:00:00', TIMESTAMP '2025-10-05 15:30:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (36, 1, 1, 1, TIMESTAMP '2025-09-01 10:00:00', TIMESTAMP '2025-09-01 11:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (37, 2, 2, 2, TIMESTAMP '2025-09-02 14:00:00', TIMESTAMP '2025-09-02 15:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (38, 3, 1, 1, TIMESTAMP '2025-09-03 09:00:00', TIMESTAMP '2025-09-03 10:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (39, 1, 2, 2, TIMESTAMP '2025-09-05 09:00:00', TIMESTAMP '2025-09-05 10:00:00');
