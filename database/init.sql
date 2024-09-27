CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS personas (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    nombre2 TEXT,
    apellido TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    cedula TEXT NOT NULL UNIQUE,
    rut BIGINT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL
);

INSERT INTO personas (nombre, nombre2, apellido, email, cedula, rut, contrasena)
    VALUES ('Pepito', 'Pepe',  'Rodriguez', 'roberto@hotmail.com', '5.440.395-7', 214849650014, crypt('Juancito!8442', gen_salt('bf'))),
           ('Pepita', 'ana', 'perez', 'perez@hotmail.com', '5.479.508-3', 160338520015, crypt('Pepita!8442', gen_salt('bf'))), 
           ('jorgita','jorga', 'hernandez', 'hernandez@hotmail.com', '3.918.898-2', 160205570011, crypt('Jorgita!8442', gen_salt('bf')));
           
