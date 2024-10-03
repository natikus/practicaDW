import { Static, Type } from "@sinclair/typebox";

// Expresión regular para la contraseña

// Expresión regular para el formato de cédula
const cedulaRegex = /^[1-9]{1}\.[0-9]{3}\.[0-9]{3}-[0-9]{1}$/;

// Expresión regular para el formato del RU
const rutRegex = /^\d{12}$/;
const FileSchema = Type.Object(
  {
    type: Type.Literal("file"),
    fieldname: Type.String(),
    filename: Type.String(),
    encoding: Type.String(),
    mimetype: Type.String(),
    file: Type.Object({}),
    _buf: Type.Object({}),
  },
  { additionalProperties: false }
);
export const nameSchema = Type.Object(
  {
    type: Type.Literal("field"),
    fieldname: Type.String(),
    mimetype: Type.String(),
    encoding: Type.String(),
    value: Type.String(),
    fieldnameTruncated: Type.Boolean(),
    valueTruncated: Type.Boolean(),
  },
  { additionalProperties: false }
);

const emailSchema = Type.Object(
  {
    type: Type.Literal("field"),
    fieldname: Type.String(),
    mimetype: Type.String(),
    encoding: Type.String(),
    value: Type.String(),
    fieldnameTruncated: Type.Boolean(),
    valueTruncated: Type.Boolean(),
  },
  { additionalProperties: false },
);
export const PersonaSchema = Type.Object({
  id: Type.Number(),
  nombre: Type.String({ minLength: 2, maxLength: 50 }),
  nombre2: Type.Optional(Type.String({ minLength: 2, maxLength: 50 })),
  apellido: Type.String({ minLength: 2, maxLength: 50 }),
  email: Type.String({ type: 'string', format: 'email' }),
  cedula: Type.String({ pattern: cedulaRegex.source }),
  rut: Type.String({ pattern: rutRegex.source }),
  imagen: Type.Optional(Type.String()),

});

export const PersonaPostSchema = Type.Object({
  nombre: nameSchema,
  email: emailSchema,
  imagen: FileSchema,
  cedula: nameSchema,
  rut: nameSchema,
  contrasena: nameSchema,
  apellido: nameSchema,

});

export const PersonaPutSchema = Type.Object({
  nombre: Type.Optional(Type.String({ minLength: 2, maxLength: 50 })),
  nombre2: Type.Optional(Type.String({ minLength: 2, maxLength: 50 })),
  apellido: Type.Optional(Type.String({ minLength: 2, maxLength: 50 })),
  email: Type.Optional(Type.String({ type: 'string', format: 'email' })),
  cedula: Type.Optional(Type.String({ pattern: cedulaRegex.source })),
  rut: Type.Optional(Type.String({ pattern: rutRegex.source })),
  contrasena: Type.Optional(Type.String()),
});


export const PersonaIdSchema = Type.Object({
  id: Type.Number(),
});


export type PersonaType = Static<typeof PersonaSchema>;
export type PersonaPostType = Static<typeof PersonaPostSchema>;
export type PersonaPutType = Static<typeof PersonaPutSchema>;
export type PersonaIdType = Static<typeof PersonaIdSchema>;