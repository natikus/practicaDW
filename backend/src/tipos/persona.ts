import { Static, Type } from "@sinclair/typebox";

export const PersonaIdSchema = Type.Object({
  id: Type.Number({ description: "Número identificador de la persona" }),
});

export const contrasenaSchema = Type.Object(
  {
    type: Type.Literal("field", {
      description: "Tipo de campo, en este caso es un campo de formulario",
    }),
    fieldname: Type.String({ description: "Nombre del campo del formulario" }),
    mimetype: Type.String({ description: "Tipo MIME del campo" }),
    encoding: Type.String({ description: "Codificación del campo" }),
    value: Type.String({ description: "Valor del campo del formulario" }),
    fieldnameTruncated: Type.Boolean({
      description: "Indica si el nombre del campo fue truncado",
    }),
    valueTruncated: Type.Boolean({
      description: "Indica si el valor del campo fue truncado",
    }),
  },
  { additionalProperties: false }
);

const emailSchema = Type.Object(
  {
    type: Type.Literal("field", {
      description: "Tipo de campo, en este caso es un campo de email",
    }),
    fieldname: Type.String({
      description: "Nombre del campo del formulario de email",
    }),
    mimetype: Type.String({ description: "Tipo MIME del campo de email" }),
    encoding: Type.String({ description: "Codificación del campo de email" }),
    value: Type.String({ description: "Valor del campo de email" }),
    fieldnameTruncated: Type.Boolean({
      description: "Indica si el nombre del campo fue truncado",
    }),
    valueTruncated: Type.Boolean({
      description: "Indica si el valor del campo fue truncado",
    }),
  },
  { additionalProperties: false }
);

export const PersonaSchema = Type.Object({
  id: PersonaIdSchema,
  email: emailSchema,
});

export const PersonaPostSchema = Type.Object({
  email: emailSchema,
  contrasena: contrasenaSchema,
});

export type PersonaType = Static<typeof PersonaSchema>;
export type PersonaPostType = Static<typeof PersonaPostSchema>;
export type PersonaIdType = Static<typeof PersonaIdSchema>;
