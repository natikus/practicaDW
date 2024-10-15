CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS personas (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL
);

INSERT INTO personas ( email, contrasena)
    VALUES ('roberto@hotmail.com', crypt('Juancito!8442', gen_salt('bf'))),
           ( 'perez@hotmail.com', crypt('Pepita!8442', gen_salt('bf'))),
           ( 'hernandez@hotmail.com', crypt('Jorgita!8442', gen_salt('bf')));
           
