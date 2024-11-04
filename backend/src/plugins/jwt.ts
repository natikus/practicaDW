import jwt, { FastifyJWTOptions } from "@fastify/jwt";
import fp from "fastify-plugin";
import { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticateFunction } from "../../uploads/tipos/fastify.js";

const jwtOptions: FastifyJWTOptions = {
  secret: "supersecret",
};

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string; email: string }; // Tipos del payload del token
    user: { id: string; email: string }; // Tipos del user tras la verificación
  }
}
export default fp<FastifyJWTOptions>(async (fastify) => {
  fastify.register(jwt, jwtOptions);

  const authenticate: AuthenticateFunction = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  };

  fastify.decorate("authenticate", authenticate);
});
