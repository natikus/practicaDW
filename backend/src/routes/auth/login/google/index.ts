import { google } from "googleapis";
import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import type { AppOptions } from "./../../../../app.ts";
import { query } from "./../../../../services/database.js";

const googleRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: AppOptions
): Promise<void> => {
  fastify.get(
    "/callback",
    {
      schema: {
        tags: ["persona"],
        summary: "Google OAuth2 Callback",
        description:
          "Ruta para manejar el callback de autenticación de Google OAuth2.",
        params: { type: "object", properties: {} },
        response: {
          302: {
            description:
              "Redirección exitosa con el token JWT o registro de usuario.",
            type: "object",
            properties: { token: { type: "string" }, user: { type: "object" } },
          },
          500: {
            description: "Error durante el proceso de autenticación.",
            type: "object",
            properties: { error: { type: "string" } },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const googletoken =
          await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
            request
          );
        const accessToken = googletoken.token.access_token;

        // Obtiene la información del usuario directamente
        const userinfo = await fastify.googleOAuth2.userinfo(accessToken);
        const { email, given_name, family_name, picture, locale } = userinfo;

        // API de Google Calendar
        const calendar = google.calendar({ version: "v3", auth: accessToken });
        // API de Google Contacts
        const people = google.people({ version: "v1", auth: accessToken });
        // API de Google Drive
        const drive = google.drive({ version: "v3", auth: accessToken });

        try {
          const calendarList = await calendar.calendarList.list();
          console.log(
            "Calendarios:",
            calendarList.data.items || "No hay calendarios disponibles"
          );
        } catch (error) {
          console.error("Error al obtener la lista de calendarios:", error);
        }

        try {
          const contacts = await people.people.connections.list({
            resourceName: "people/me",
            personFields: "names,emailAddresses",
          });
          console.log(
            "Contactos:",
            contacts.data.connections || "No hay contactos disponibles"
          );
        } catch (error) {
          console.error("Error al obtener contactos:", error);
        }

        try {
          const driveFiles = await drive.files.list();
          console.log(
            "Archivos en Drive:",
            driveFiles.data.files || "No hay archivos disponibles"
          );
        } catch (error) {
          console.error("Error al obtener archivos de Drive:", error);
        }

        const res = await query(
          `SELECT id, email FROM personas WHERE email = $1`,
          [email]
        );

        if (res.rows.length > 0) {
          const user = res.rows[0];
          const token = fastify.jwt.sign({ id: user.id, email });
          reply.redirect(
            `https://localhost/usuario/ver/index.html?token=${token}&user=${user.id}`
          );
        } else {
          reply.redirect(
            `https://localhost/usuario/registro/index.html?email=${email}&given_name=${given_name}&family_name=${family_name}&picture=${picture}&locale=${locale}`
          );
        }
      } catch (error) {
        console.error("Error al procesar la autenticación:", error);
        reply.status(500).send({ error: "Error al procesar la autenticación" });
      }
    }
  );
};

export default googleRoutes;
