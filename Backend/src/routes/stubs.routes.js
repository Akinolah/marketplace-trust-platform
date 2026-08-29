/**
 * Remaining endpoints the Frontend calls that aren't wired to CognoDB yet.
 * /stats, /fraud/rings, /fraud/trends, and /recommendations/product/:id
 * are implemented for real — see fraud.routes.js, stats.routes.js, and
 * recommendation.routes.js. Each of these still needs a queries/*.js +
 * services/*.js pair before being wired here.
 * @param {import('fastify').FastifyInstance} app
 */
export default async function stubRoutes(app) {
  app.get('/fraud/suspicious-reviews', async (_req, reply) => {
    // TODO(cypher): port FAKE_REVIEW_RING detection query from planning doc
    return reply.notImplemented('GET /fraud/suspicious-reviews not yet wired to CognoDB');
  });

  app.get('/recommendations/user/:userId', async (_req, reply) => {
    // TODO(cypher): category exploration path query from planning doc
    return reply.notImplemented('GET /recommendations/user/:userId not yet wired to CognoDB');
  });

  app.get('/analytics', async (_req, reply) => {
    return reply.notImplemented('GET /analytics not yet wired to CognoDB');
  });

  app.get('/users', async (_req, reply) => {
    return reply.notImplemented('GET /users not yet wired to CognoDB');
  });

  app.get('/managed-products', async (_req, reply) => {
    return reply.notImplemented('GET /managed-products not yet wired to CognoDB');
  });

  app.get('/managed-reviews', async (_req, reply) => {
    return reply.notImplemented('GET /managed-reviews not yet wired to CognoDB');
  });

  app.get('/transactions', async (_req, reply) => {
    return reply.notImplemented('GET /transactions not yet wired to CognoDB');
  });

  app.get('/alerts-data', async (_req, reply) => {
    return reply.notImplemented('GET /alerts-data not yet wired to CognoDB');
  });

  app.get('/reports-data', async (_req, reply) => {
    return reply.notImplemented('GET /reports-data not yet wired to CognoDB');
  });

  app.get('/settings-data', async (_req, reply) => {
    return reply.notImplemented('GET /settings-data not yet wired to CognoDB');
  });
}
