import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { env } from './config/env.js';
import { checkHealth } from './db/driver.js';
import fraudRoutes from './routes/fraud.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';
import statsRoutes from './routes/stats.routes.js';
import stubRoutes from './routes/stubs.routes.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      transport: { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname' } },
    },
  });

  await app.register(sensible); // gives reply.notImplemented(), reply.serviceUnavailable(), etc.
  await app.register(cors, { origin: env.CORS_ORIGINS });

  // Real health check — round-trips to CognoDB rather than just confirming the
  // process is alive, and logs each check to the console so DB drops are visible
  // in real time, not just at startup.
  app.get('/health', async (request, reply) => {
    const db = await checkHealth();
    const status = db.connected ? 'ok' : 'degraded';

    if (db.connected) {
      request.log.info(`Health check OK — CognoDB responded in ${db.latencyMs}ms`);
    } else {
      request.log.error(`Health check FAILED — CognoDB unreachable: ${db.error}`);
    }

    return reply.status(db.connected ? 200 : 503).send({
      status,
      uptimeSeconds: Math.round(process.uptime()),
      database: db,
      timestamp: new Date().toISOString(),
    });
  });

  await app.register(fraudRoutes, { prefix: '/api' });
  await app.register(recommendationRoutes, { prefix: '/api' });
  await app.register(statsRoutes, { prefix: '/api' });
  await app.register(stubRoutes, { prefix: '/api' });

  // Catch-all: anything that reaches here without a matching route or handler.
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    const statusCode = error.statusCode ?? 500;
    reply.status(statusCode).send({
      message: statusCode >= 500 ? 'Something went wrong on our end.' : error.message,
    });
  });

  return app;
}
