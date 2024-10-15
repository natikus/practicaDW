import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";
import bcrypt from "bcrypt";
import { query } from "./../../services/database.js";
import {
  PersonaIdSchema,
  PersonaPostSchema,
  PersonaSchema,
  PersonaPostType,
} from "../../tipos/persona.js";

const personaRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para crear una nueva persona
  fastify.post("/", {
    schema: {
      tags: ["persona"],
      consumes: ["multipart/form-data"],
      body: PersonaPostSchema,
    },

    handler: async function (request, reply) {
      const personaPost = request.body as PersonaPostType;

      const email = personaPost.email.value;

      const hashedPassword = await bcrypt.hash(
        personaPost.contrasena.value,
        10
      );

      const res = await query(
        `INSERT INTO personas
       (email,contrasena)
       VALUES ($1, $2)
       RETURNING id;`,
        [email, hashedPassword]
      );

      if (res.rowCount === 0) {
        reply.code(404).send({ message: "Failed to insert persona" });
        return;
      }

      const id = res.rows[0].id;
      reply.code(201).send({
        id,

        email,
      });
    },
  });

  // Ruta para obtener los detalles de una persona por ID
  fastify.get("/:id", {
    schema: {
      summary: "Obtener detalles de una persona",
      description: "Obtiene los detalles de una persona específica por su ID.",
      params: PersonaIdSchema,
      tags: ["persona"],
      response: {
        200: PersonaSchema,
        404: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const { id } = request.params as { id: string };
      const res = await query(
        `SELECT id, nombre, nombre2, apellido, email, cedula, rut, imagen FROM personas WHERE id = ${id};`
      );
      if (res.rows.length === 0) {
        reply.code(404).send({ message: "Persona no encontrada" });
        return;
      }
      return res.rows[0];
    },
  });
};

export default personaRoute;
