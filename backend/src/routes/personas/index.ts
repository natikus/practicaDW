import type { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import bcrypt from 'bcrypt';
import { query } from "./../../services/database.js";
import { PersonaIdSchema, PersonaPostSchema, PersonaPutSchema, PersonaSchema, PersonaPutType, PersonaPostType } from '../../tipos/persona.js';
import path from 'path';
import { writeFileSync } from 'fs';

const personaRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {

  // Ruta para obtener todas las personas
  fastify.get("/", {
    schema: {
      summary: "Obtener todas las personas",
      description: "Devuelve la lista completa de personas registradas en la base de datos.",
      tags: ["persona"],
      response: {
        200: {
          type: "array",

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
      const res = await query(`SELECT id, nombre, nombre2, apellido, email, cedula, rut, imagen FROM personas`);
      if (res.rows.length === 0) {
        reply.code(404).send({ message: "No hay personas registradas" });
        return;
      }
      return res.rows;
    }
  });

  // Ruta para crear una nueva persona
  fastify.post("/", {
    schema: {
      tags: ["persona"],
      consumes: ["multipart/form-data"],
      body: PersonaPostSchema,
    },

    handler: async function (request, reply) {
      const personaPost = request.body as PersonaPostType;

      let imageUrl = '';
      if (personaPost.imagen) {
        const fileBuffer = personaPost.imagen._buf as Buffer;
        const filepath = path.join(process.cwd(), "uploads", personaPost.imagen.filename);
        writeFileSync(filepath, fileBuffer);
        imageUrl = `/uploads/${personaPost.imagen.filename}`;
      }
      const nombre = personaPost.nombre.value;
      const apellido = personaPost.apellido.value;
      const email = personaPost.email.value;
      const cedula = personaPost.cedula.value;
      const rut = personaPost.rut.value;
      const hashedPassword = await bcrypt.hash(personaPost.contrasena.value, 10);

      const res = await query(
        `INSERT INTO personas
       (nombre, apellido, email, cedula, rut, contrasena, imagen)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id;`,
        [nombre, apellido, email, cedula, rut, hashedPassword, imageUrl]
      );

      if (res.rowCount === 0) {
        reply.code(404).send({ message: "Failed to insert persona" });
        return;
      }

      const id = res.rows[0].id;
      reply.code(201).send({
        id,
        nombre,
        apellido,
        email,
        cedula,
        rut,
        imageUrl
      });
    }
  });



  // Ruta para eliminar una persona
  fastify.delete("/:id", {
    schema: {
      summary: "Eliminar una persona",
      description: "Elimina una persona de la base de datos por su ID.",
      params: PersonaIdSchema,
      tags: ["persona"],
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
            id: { type: "number" }
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
    onRequest: fastify.verifySelf,
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


  // Ruta para actualizar una persona
  fastify.put("/:id", {
    schema: {
      summary: "Actualizar una persona",
      description: "Actualiza los datos de una persona por su ID.",
      params: PersonaIdSchema,
      body: PersonaPutSchema,
      tags: ["persona"],
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
        },
        403: {
          type: "object",
          properties: {
            message: { type: "string" }
          }
        }
      }
    },
    onRequest: fastify.verifySelf,
    handler: async function (request, reply) {
      const { id } = request.params as { id: string };
      const personaPut = request.body as PersonaPutType;

      const userIdFromToken = request.user.id;
      if (userIdFromToken !== id) {
        return reply.code(403).send({ message: "No tienes permiso para modificar esta persona" });
      }

      const updates: string[] = [];
      const values: (string | number)[] = [];

      let paramIndex = 1;

      if (personaPut.nombre !== undefined) {
        updates.push(`nombre = $${paramIndex}`);
        values.push(personaPut.nombre);
        paramIndex++;
      }
      if (personaPut.nombre2 !== undefined) {
        updates.push(`nombre2 = $${paramIndex}`);
        values.push(personaPut.nombre2);
        paramIndex++;
      }
      if (personaPut.apellido !== undefined) {
        updates.push(`apellido = $${paramIndex}`);
        values.push(personaPut.apellido);
        paramIndex++;
      }
      if (personaPut.email !== undefined) {
        updates.push(`email = $${paramIndex}`);
        values.push(personaPut.email);
        paramIndex++;
      }
      if (personaPut.cedula !== undefined) {
        updates.push(`cedula = $${paramIndex}`);
        values.push(personaPut.cedula);
        paramIndex++;
      }
      if (personaPut.rut !== undefined) {
        updates.push(`rut = $${paramIndex}`);
        values.push(personaPut.rut);
        paramIndex++;
      }

      values.push(id);

      const res = await query(
        `UPDATE personas
         SET ${updates.join(", ")}
         WHERE id = $${paramIndex}
         RETURNING id;`,
        values
      );

      if (res.rows.length === 0) {
        reply.code(404).send({ message: "Persona no encontrada" });
        return;
      }

      reply.code(200).send({ ...personaPut, id });
    }
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
            message: { type: "string" }
          }
        }
      }
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const { id } = request.params as { id: string };
      const res = await query(`SELECT id, nombre, nombre2, apellido, email, cedula, rut, imagen FROM personas WHERE id = ${id};`);
      if (res.rows.length === 0) {
        reply.code(404).send({ message: "Persona no encontrada" });
        return;
      }
      return res.rows[0];
    }
  });


};

export default personaRoute;
