import { FastifyReply, FastifyRequest } from "fastify";

export interface AuthenticateFunction {
    (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: AuthenticateFunction;
        verifyUserId: AuthenticateFunction;
    }

    interface FastifyJWT {
        payload: { id: string; email: string };  // Aquí especificamos que el payload incluye 'id' y 'email'
        user: { id: string; email: string };  // Aquí especificamos que request.user tendrá 'id' y 'email'
    }
}

export default AuthenticateFunction;
