// routes/googleData.ts
import { FastifyInstance } from "fastify";
import got from "got";

export default async function (fastify: FastifyInstance) {
  fastify.get("/google/drive", async (request, reply) => {
    const accessToken = request.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const driveData = await got
      .get("https://www.googleapis.com/drive/v3/files", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .json();

    return reply.send(driveData);
  });

  fastify.get("/google/calendar", async (request, reply) => {
    const accessToken = request.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const calendarData = await got
      .get("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .json();

    return reply.send(calendarData);
  });
}
