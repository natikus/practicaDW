import { Static, Type } from "@sinclair/typebox";

// Expresión regular para la contraseña

// Expresión regular para el formato de cédula
const cedulaRegex = /^[1-9]{1}\.[0-9]{3}\.[0-9]{3}-[0-9]{1}$/;

// Expresión regular para el formato del RUT
const rutRegex = /^\d{12}$/;

const FileSchema = Type.Object(
  {
    type: Type.Literal("file", { description: "Tipo de campo, en este caso es un archivo" }),
    fieldname: Type.String({ description: "Nombre del campo donde se sube el archivo" }),
    filename: Type.String({ description: "Nombre del archivo subido" }),
    encoding: Type.String({ description: "Tipo de codificación del archivo" }),
    mimetype: Type.String({ description: "Tipo MIME del archivo" }),
    file: Type.Object({}, { description: "Objeto que representa el archivo subido" }),
    _buf: Type.Object({}, { description: "Buffer temporal del archivo subido" }),
  },
  { additionalProperties: false }
);

export const nameSchema = Type.Object(
  {
    type: Type.Literal("field", { description: "Tipo de campo, en este caso es un campo de formulario" }),
    fieldname: Type.String({ description: "Nombre del campo del formulario" }),
    mimetype: Type.String({ description: "Tipo MIME del campo" }),
    encoding: Type.String({ description: "Codificación del campo" }),
    value: Type.String({ description: "Valor del campo del formulario" }),
    fieldnameTruncated: Type.Boolean({ description: "Indica si el nombre del campo fue truncado" }),
    valueTruncated: Type.Boolean({ description: "Indica si el valor del campo fue truncado" }),
  },
  { additionalProperties: false }
);

const emailSchema = Type.Object(
  {
    type: Type.Literal("field", { description: "Tipo de campo, en este caso es un campo de email" }),
    fieldname: Type.String({ description: "Nombre del campo del formulario de email" }),
    mimetype: Type.String({ description: "Tipo MIME del campo de email" }),
    encoding: Type.String({ description: "Codificación del campo de email" }),
    value: Type.String({ description: "Valor del campo de email" }),
    fieldnameTruncated: Type.Boolean({ description: "Indica si el nombre del campo fue truncado" }),
    valueTruncated: Type.Boolean({ description: "Indica si el valor del campo fue truncado" }),
  },
  { additionalProperties: false }
);

export const PersonaSchema = Type.Object({
  id: Type.Number({ description: "Número identificador de la persona" }),
  nombre: Type.String({ minLength: 2, maxLength: 50, description: "Nombre de la persona" }),
  nombre2: Type.Optional(Type.String({ minLength: 2, maxLength: 50, description: "Segundo nombre de la persona si es que tiene" })),
  apellido: Type.String({ minLength: 2, maxLength: 50, description: "Apellido de la persona" }),
  email: Type.String({ type: 'string', format: 'email', description: "Email relacionado a la persona" }),
  cedula: Type.String({ pattern: cedulaRegex.source, description: "Cédula de la persona" }),
  rut: Type.String({ pattern: rutRegex.source, description: "RUT de la persona" }),
  imagen: Type.Optional(Type.String({ description: "Foto del usuario" })),
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
  nombre: Type.Optional(Type.String({ minLength: 2, maxLength: 50, description: "Nombre de la persona" })),
  nombre2: Type.Optional(Type.String({ minLength: 2, maxLength: 50, description: "Segundo nombre de la persona si es que tiene" })),
  apellido: Type.Optional(Type.String({ minLength: 2, maxLength: 50, description: "Apellido de la persona" })),
  email: Type.Optional(Type.String({ type: 'string', format: 'email', description: "Email relacionado a la persona" })),
  cedula: Type.Optional(Type.String({ pattern: cedulaRegex.source, description: "Cédula de la persona" })),
  rut: Type.Optional(Type.String({ pattern: rutRegex.source, description: "RUT de la persona" })),
  contrasena: Type.Optional(Type.String({ description: "Contraseña de la persona" })),
});

export const PersonaIdSchema = Type.Object({
  id: Type.Number({ description: "Número identificador de la persona" }),
});

export type PersonaType = Static<typeof PersonaSchema>;
export type PersonaPostType = Static<typeof PersonaPostSchema>;
export type PersonaPutType = Static<typeof PersonaPutSchema>;
export type PersonaIdType = Static<typeof PersonaIdSchema>;
