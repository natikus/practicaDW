import { google } from 'googleapis';
import type { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

const googleDataRoutes: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {

    // Ruta para obtener datos de Google Calendar
    fastify.get('/calendar', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                return reply.code(401).send({ message: 'Token no proporcionado' });
            }

            const calendar = google.calendar({ version: 'v3', auth: token });
            const calendarList = await calendar.calendarList.list();
            reply.send(calendarList.data.items); // Envía la lista de calendarios al frontend
        } catch (error) {
            reply.code(500).send({ message: 'Error al obtener calendarios' });
        }
    });

    // Ruta para obtener datos de Google Contacts
    fastify.get('/contacts', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                return reply.code(401).send({ message: 'Token no proporcionado' });
            }

            const people = google.people({ version: 'v1', auth: token });
            const contacts = await people.people.connections.list({
                resourceName: 'people/me',
                personFields: 'names,emailAddresses',
            });
            reply.send(contacts.data.connections); // Envía la lista de contactos al frontend
        } catch (error) {
            reply.code(500).send({ message: 'Error al obtener contactos' });
        }
    });

    // Ruta para obtener datos de Google Drive
    fastify.get('/drive', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                return reply.code(401).send({ message: 'Token no proporcionado' });
            }

            const drive = google.drive({ version: 'v3', auth: token });
            const driveFiles = await drive.files.list();
            reply.send(driveFiles.data.files); // Envía la lista de archivos de Drive al frontend
        } catch (error) {
            reply.code(500).send({ message: 'Error al obtener archivos de Drive' });
        }
    });
};

export default googleDataRoutes;
