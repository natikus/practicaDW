import { PersonaPutSchema, PersonaPutType, PersonaPostType, PersonaPostSchema, PersonaIdSchema } from "../../tipos/persona.js"
import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { query } from "../../services/database.js";
import bcrypt from 'bcrypt';
// Definición del plugin de ruta
const personaRoute: FastifyPluginAsync = async (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions
): Promise<void> => {
    // Ruta para obtener todas las personas
    fastify.get("/", {
        schema: {
            tags: ["persona"],
        },

        onRequest: fastify.authenticate,

        handler: async function (request, reply) {
            const res = await query(`SELECT
        id,
        nombre,
        nombre2,
        apellido,
        email,
        cedula,
        rut
        FROM personas`);//no lleva , despues del ultimo parametro
            if (res.rows.length === 0) {
                reply.code(404).send({ message: "No hay personas registradas" });
                return;
            }
            return res.rows;
        }
    });


    fastify.post("/", {
        schema: {
            body: PersonaPostSchema,  // `params` no es correcto aquí; debería ser `body`
            tags: ["persona"],
            description: "Crea una nueva persona",
        },
        handler: async function (request, reply) {
            const personaPost = request.body as PersonaPostType;

            // Cifrar la contraseña
            const hashedPassword = await bcrypt.hash(personaPost.contrasena, 10);

            // Insertar persona en la base de datos, usando sentencias parametrizadas para evitar inyección SQL
            const res = await query(
                `INSERT INTO personas (nombre, nombre2, apellido, email, cedula, rut, contrasena)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id;`,
                [personaPost.nombre,
                personaPost.nombre2,
                personaPost.apellido,
                personaPost.email,
                personaPost.cedula,
                personaPost.rut,
                    hashedPassword]
            );

            if (res.rows.length === 0) {
                reply.code(404).send({ message: "Persona no creada" });
                return;
            }

            const id = res.rows[0].id;

            // Generar JWT
            const token = fastify.jwt.sign({ id, email: personaPost.email });

            // Responder con el token y los datos de la persona
            reply.code(201).send({ id, token, ...personaPost });
        }
    });


    // Ruta para eliminar una persona
    fastify.delete("/:id", {
        schema: {
            tags: ["persona"],
            description: "Elimina una persona por ID",
            params: PersonaIdSchema,
            response: {
                200: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        id: { type: "string" }
                    }
                },
                404: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            }
        },

        onRequest: fastify.authenticate,

        handler: async function (request, reply) {
            const { id } = request.params as { id: string };
            const res = await query(`DELETE FROM personas WHERE id = ${id};`);
            if (res.rowCount === 0) {
                reply.code(404).send({ message: "Persona no encontrada" });
                return;
            }
            reply.code(200).send({ message: "Persona eliminada", id });
        }
    });

    // Ruta para editar una persona
    fastify.put("/:id", {
        schema: {
            tags: ["persona"],
            description: "Actualiza una persona por ID",
            params: PersonaIdSchema,
            body: PersonaPutSchema,
            response: {
                200: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        nombre: { type: "string" },
                        nombre2: { type: "string" },
                        apellido: { type: "string" },
                        email: { type: "string" },
                        cedula: { type: "string" },
                        rut: { type: "string" },
                    }
                },
                404: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            }
        },

        onRequest: fastify.authenticate,

        handler: async function (request, reply) {
            const { id } = request.params as { id: string };
            const personaPut = request.body as PersonaPutType;

            // Obtener el ID del token JWT
            const userIdFromToken = request.user.id;  // Suponiendo que el token tiene un campo 'id'

            // Verificar si el usuario autenticado es el mismo que está siendo modificado
            if (userIdFromToken !== id) {
                return reply.code(403).send({ message: "No tienes permiso para modificar esta persona" });
            }

            // Actualizar la persona en la base de datos
            const res = await query(`UPDATE personas
                SET nombre = $1,
                    nombre2 = $2,
                    apellido = $3,
                    email = $4,
                    cedula = $5,
                    rut = $6
                WHERE id = $7
                RETURNING id;`,
                [personaPut.nombre, personaPut.nombre2, personaPut.apellido, personaPut.email, personaPut.cedula, personaPut.rut, id]
            );

            if (res.rows.length === 0) {
                reply.code(404).send({ message: "Persona no encontrada" });
                return;
            }
            reply.code(200).send({ ...personaPut, id });
        }
    });

    // Ruta para ver los datos de una persona específica
    fastify.get("/:id", {
        schema: {
            tags: ["persona"],
            description: "Obtiene los detalles de una persona por ID",
            params: PersonaIdSchema,
            response: {
                200: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        nombre: { type: "string" },
                        nombre2: { type: "string" },
                        apellido: { type: "string" },
                        email: { type: "string" },
                        cedula: { type: "string" },
                        rut: { type: "string" },
                    }
                },
                404: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            }
        },
        onRequest: fastify.authenticate,

        handler: async function (request, reply) {
            const { id } = request.params as { id: string };
            const res = await query(`SELECT 
        id,
        nombre,
        nombre2,
        apellido,
        email,
        cedula,
        rut
        FROM personas WHERE id = ${id};`);

            if (res.rows.length === 0) {
                reply.code(404).send({ message: "Persona no encontrada" });
                return;
            }
            const persona = res.rows[0];
            return persona;
        }
    });

    fastify.post("/login", {
        schema: {
            body: {
                type: "object",
                properties: {
                    email: { type: "string" },
                    password: { type: "string" },
                },
                required: ["email", "password"],
            },
            tags: ["persona"],
            description: "Login de usuario para obtener token JWT",
        },
        handler: async (request, reply) => {
            // Tipar el cuerpo de la solicitud correctamente
            const { email, password } = request.body as { email: string, password: string };

            try {
                // Verificar si el usuario existe
                const res = await query("SELECT id, contrasena FROM personas WHERE email = $1", [email]);
                if (res.rows.length === 0) {
                    return reply.code(401).send({ message: "Usuario no encontrado" });
                }

                const { id, contrasena: hashedPassword, nombre, apellido } = res.rows[0];

                // Verificar la contraseña
                const isPasswordValid = await bcrypt.compare(password, hashedPassword);
                if (!isPasswordValid) {
                    return reply.code(401).send({ message: "Contraseña incorrecta" });
                }

                // Generar token JWT
                const token = fastify.jwt.sign({ id, email });

                // Responder con el token
                reply.code(200).send({ token, id, user: { nombre, apellido, email } }); // Aquí incluyes lo que necesitas
            } catch (error) {
                console.error("Error en el login:", error);
                reply.code(500).send({ message: "Error en el servidor" });
            }
        },
    });
};

export default personaRoute;
