import { FastifyReply, FastifyRequest } from "fastify";

export interface AuthenticateFunction {
    (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: AuthenticateFunction;

        verifySelf: AuthenticateFunction;
        googleOAuth2: any;
    }

    interface FastifyJWT {
        payload: { id: string; email: string };
        user: { id: string; email: string };
    }
}

export default AuthenticateFunction;
