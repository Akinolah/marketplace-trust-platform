import neo4j from 'neo4j-driver';
import { env } from '../config/env.js';

let driver = null;

export function getDriver() {
  if (!driver) {
    driver = neo4j.driver(
      env.COGNODB_URI,
      neo4j.auth.basic(env.COGNODB_USER, env.COGNODB_PASSWORD),
      { maxConnectionPoolSize: 20 }
    );
  }
  return driver;
}

/**
 * Call once at startup. Throws if CognoDB is unreachable so the caller
 * can fail fast with a clear error instead of serving a broken API silently.
 * Resolves with { address, protocolVersion } on success.
 */
export async function verifyConnectivity() {
  const serverInfo = await getDriver().verifyConnectivity();
  return {
    address: serverInfo?.address ?? env.COGNODB_URI,
    protocolVersion: serverInfo?.protocolVersion ?? 'unknown',
  };
}

/**
 * Lightweight, repeatable check for the /health endpoint — actually round-trips
 * to the database instead of just reporting the process is alive.
 */
export async function checkHealth() {
  const start = Date.now();
  const session = getDriver().session({ defaultAccessMode: neo4j.session.READ });
  try {
    await session.run('RETURN 1');
    return { connected: true, latencyMs: Date.now() - start };
  } catch (err) {
    return { connected: false, latencyMs: Date.now() - start, error: err.message };
  } finally {
    await session.close();
  }
}

export async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

/**
 * Runs a read query with automatic session handling.
 * Use for GET-style queries — no writes.
 */
export async function runRead(cypher, params = {}) {
  const session = getDriver().session({ defaultAccessMode: neo4j.session.READ });
  try {
    const result = await session.run(cypher, params);
    return result.records.map((record) => record.toObject());
  } finally {
    await session.close();
  }
}

/**
 * Runs a write query with automatic session handling.
 * Use for seed scripts and any mutating endpoints.
 */
export async function runWrite(cypher, params = {}) {
  const session = getDriver().session({ defaultAccessMode: neo4j.session.WRITE });
  try {
    const result = await session.run(cypher, params);
    return result.records.map((record) => record.toObject());
  } finally {
    await session.close();
  }
}
