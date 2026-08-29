import { buildApp } from './app.js';
import { env } from './config/env.js';
import { verifyConnectivity, closeDriver } from './db/driver.js';

function logStep(label, detail = '') {
  console.log(`${label}${detail ? ` — ${detail}` : ''}`);
}

async function main() {
  console.log('\n=== Marketplace Backend ===');
  logStep('Environment', process.env.NODE_ENV || 'development');
  logStep('Port', String(env.PORT));
  logStep('CORS origins', env.CORS_ORIGINS.join(', '));

  const app = await buildApp();

  console.log('\nConnecting to CognoDB...');
  const start = Date.now();
  try {
    const { address, protocolVersion } = await verifyConnectivity();
    const elapsed = Date.now() - start;
    console.log(`✔ Connected — ${address} (Bolt ${protocolVersion}) in ${elapsed}ms`);
  } catch (err) {
    // Fail fast and loud rather than serving a broken API silently.
    console.error(`✘ Connection FAILED after ${Date.now() - start}ms`);
    console.error(`  ${err.message}`);
    console.error('  Check COGNODB_URI / COGNODB_USER / COGNODB_PASSWORD in .env');
    process.exit(1);
  }

  const shutdown = async (signal) => {
    console.log(`\nReceived ${signal}, shutting down...`);
    await closeDriver();
    await app.close();
    console.log('Shutdown complete.');
    process.exit(0);
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  await app.listen({ port: env.PORT, host: env.HOST });

  console.log('\n✔ Server listening');
  logStep('  Local', `http://localhost:${env.PORT}`);
  logStep('  Health', `http://localhost:${env.PORT}/health`);
  logStep('  API base', `http://localhost:${env.PORT}/api`);
  console.log('===========================\n');
}

main().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
