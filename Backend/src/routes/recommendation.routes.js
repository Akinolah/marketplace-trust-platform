import { getProductRecommendations, getTrendingProducts } from '../services/recommendation.service.js';

/** @param {import('fastify').FastifyInstance} app */
export default async function recommendationRoutes(app) {
  app.get('/recommendations/product/:productId', async (request, reply) => {
    const { productId } = request.params;
    try {
      // No specific product selected yet — the "browse all" view falls
      // back to overall purchase popularity instead of co-purchase overlap.
      const recommendations =
        productId === 'all' ? await getTrendingProducts() : await getProductRecommendations(productId);
      return reply.send(recommendations);
    } catch (err) {
      request.log.error(err, 'Failed to fetch product recommendations');
      return reply.serviceUnavailable('Could not reach the graph database. Please try again shortly.');
    }
  });

  // TODO(cypher): /recommendations/user/:userId — category-progression query from planning doc
}
