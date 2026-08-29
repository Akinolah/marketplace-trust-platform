import { getDashboardStats } from '../services/stats.service.js';

/** @param {import('fastify').FastifyInstance} app */
export default async function statsRoutes(app) {
  app.get('/stats', async (request, reply) => {
    const range = request.query.range ?? '30d';
    try {
      const stats = await getDashboardStats(range);
      return reply.send(stats);
    } catch (err) {
      request.log.error(err, 'Failed to fetch dashboard stats');
      return reply.serviceUnavailable('Could not reach the graph database. Please try again shortly.');
    }
  });
}
