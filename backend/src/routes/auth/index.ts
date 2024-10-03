import { FastifyPluginAsync } from "fastify";
import bcrypt from "bcrypt";
import { query } from "../../services/database.js";

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.post("/login", {
        schema: {
            summary: "Login de persona",
            description: "Permite a una persona iniciar sesión y obtener un token JWT.",
            body: {
                type: "object",
                properties: {
                    email: { type: "string" },
                    contrasena: { type: "string" },
                },
                required: ["email", "contrasena"],
            },
            tags: ["auth"],
            response: {
                200: {
                    type: "object",
                    properties: {
                        token: { type: "string" },
                        id: { type: "number" },
                        user: {
                            type: "object",
                            properties: {
                                nombre: { type: "string" },
                                apellido: { type: "string" },
                                email: { type: "string" },
                            }
                        }
                    }
                },
                401: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            }
        },
        handler: async function (request, reply) {
            const { email, contrasena } = request.body as { email: string, contrasena: string };

            try {
                const res = await query("SELECT id, contrasena, nombre, apellido FROM personas WHERE email = $1", [email]);
                if (res.rows.length === 0) {
                    return reply.code(401).send({ message: "Usuario no encontrado" });
                }

                const { id, contrasena: hashedPassword, nombre, apellido } = res.rows[0];
                const isContrasenaValid = await bcrypt.compare(contrasena, hashedPassword);
                if (!isContrasenaValid) {
                    return reply.code(401).send({ message: "Contraseña incorrecta" });
                }

                const token = fastify.jwt.sign({ id, email });
                reply.code(200).send({ token, id, user: { nombre, apellido, email } });
            } catch (error) {
                reply.code(500).send({ message: "Error interno del servidor" });
            }
        }
    });
};

export default auth;
