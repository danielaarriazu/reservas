-- ============================
-- INSERTAR PERSONAS
-- ============================
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES (1, 'Administrador', 'admin@shipnet.com', 'admin123', 'ADMIN');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES (2, 'Daniela', 'dani@example.com', 'user123', 'USUARIO');
INSERT INTO PERSONA (id, nombre, email, password, rol) VALUES (3, 'Lucia', 'lucia@example.com', 'user123', 'USUARIO');


-- ============================
-- INSERTAR SALAS
-- ============================
INSERT INTO SALA (id, nombre, capacidad) VALUES (1, 'Sala A', 10);
INSERT INTO SALA (id, nombre, capacidad) VALUES (2, 'Sala B', 20);

-- ============================
-- INSERTAR ARTICULOS
-- ============================
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (1, 'Proyector', TRUE);
INSERT INTO ARTICULO (id, nombre, disponible) VALUES (2, 'Notebook', TRUE);

-- ============================
-- INSERTAR RESERVAS
-- ============================
-- Nota: IDs de persona, sala y artículo deben existir
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (1, 1, 1, 1, TIMESTAMP '2025-09-01 10:00:00', TIMESTAMP '2025-09-01 11:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (2, 2, 2, 2, TIMESTAMP '2025-09-02 14:00:00', TIMESTAMP '2025-09-02 15:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (3, 3, 1, 1, TIMESTAMP '2025-09-03 09:00:00', TIMESTAMP '2025-09-03 10:00:00');
INSERT INTO RESERVA (id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin) VALUES (4, 1, 2, 2, TIMESTAMP '2025-09-05 09:00:00', TIMESTAMP '2025-09-05 10:00:00');
