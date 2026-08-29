import { getFraudRings, getFraudTrends } from '../services/fraud.service.js';

/** @param {import('fastify').FastifyInstance} app */
export default async function fraudRoutes(app) {
  app.get('/fraud/rings', async (request, reply) => {
    const limit = request.query.limit ? Number(request.query.limit) : 25;

    try {
      const rings = await getFraudRings(limit);
      return reply.send(rings);
    } catch (err) {
      request.log.error(err, 'Failed to fetch fraud rings');
      return reply.serviceUnavailable('Could not reach the graph database. Please try again shortly.');
    }
  });

  app.get('/fraud/trends', async (request, reply) => {
    const range = request.query.range ?? '30d';
    try {
      const trends = await getFraudTrends(range);
      return reply.send(trends);
    } catch (err) {
      request.log.error(err, 'Failed to fetch fraud trends');
      return reply.serviceUnavailable('Could not reach the graph database. Please try again shortly.');
    }
  });

  // TODO(cypher): /fraud/suspicious-reviews — port FAKE_REVIEW_RING query from planning doc
}
