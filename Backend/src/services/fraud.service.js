import { runRead } from '../db/driver.js';
import { FIND_FRAUD_RINGS, GET_FRAUD_TRENDS, GET_COLLUSIVE_REVIEW_TRENDS } from '../queries/fraud.queries.js';

// neo4j-driver returns count()/aggregate results as lossless Integer objects,
// not plain JS numbers — normalize before doing arithmetic or comparisons.
function toNum(value) {
  return typeof value?.toNumber === 'function' ? value.toNumber() : Number(value ?? 0);
}

function toSeverity(connectedUsers, suspiciousProducts) {
  if (connectedUsers >= 6 || suspiciousProducts >= 3) return 'critical';
  if (connectedUsers >= 4 || suspiciousProducts >= 2) return 'high';
  if (suspiciousProducts >= 1) return 'medium';
  return 'low';
}

function toRiskScore(connectedUsers, suspiciousProducts, transactionCount) {
  // Simple weighted composite, clamped to 0-100.
  const score = connectedUsers * 8 + suspiciousProducts * 15 + Math.min(transactionCount, 20) * 1.5;
  return Math.min(100, Math.round(score));
}

function toGraph(row) {
  const nodes = [
    { id: `ip:${row.sharedIp}`, type: 'ip', label: row.sharedIp },
    { id: `payment:${row.sharedPayment}`, type: 'payment', label: `Card •••• ${row.sharedPayment}` },
    ...row.members.map((m) => ({
      id: `user:${m.id}`,
      type: 'user',
      label: m.name,
      metadata: { trustScore: m.trustScore },
    })),
  ];

  const relationships = row.members.flatMap((m) => [
    { id: `${m.id}-ip`, source: `user:${m.id}`, target: `ip:${row.sharedIp}`, type: 'SHARES_IP' },
    { id: `${m.id}-pm`, source: `user:${m.id}`, target: `payment:${row.sharedPayment}`, type: 'SHARES_PAYMENT' },
  ]);

  return { nodes, relationships };
}

export async function getFraudRings(limit = 25) {
  const rows = await runRead(FIND_FRAUD_RINGS, { limit });

  return rows.map((row, index) => {
    const connectedUsers = toNum(row.connectedUsers);
    const suspiciousProducts = toNum(row.suspiciousProducts);
    const transactionCount = toNum(row.transactionCount);
    const detectedAt =
      row.members
        .map((m) => m.createdAt)
        .filter(Boolean)
        .sort()[0] ?? new Date().toISOString();

    return {
      id: `${row.sharedIp}-${row.sharedPayment}`,
      ringNumber: `RING-${String(index + 1).padStart(3, '0')}`,
      severity: toSeverity(connectedUsers, suspiciousProducts),
      connectedUsers,
      sharedIp: row.sharedIp,
      sharedPayment: row.sharedPayment,
      transactions: transactionCount,
      riskScore: toRiskScore(connectedUsers, suspiciousProducts, transactionCount),
      detectedAt,
      graph: toGraph(row),
    };
  });
}

const RANGE_TO_DAYS = { '7d': 7, '30d': 30, '90d': 90 };

export async function getFraudTrends(range = '30d') {
  const days = RANGE_TO_DAYS[range] ?? 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [transactionRows, reviewRows] = await Promise.all([
    runRead(GET_FRAUD_TRENDS, { since }),
    runRead(GET_COLLUSIVE_REVIEW_TRENDS, { since }),
  ]);

  const byDay = new Map();
  for (const row of transactionRows) {
    const day = row.day.toString();
    byDay.set(day, { date: day, suspiciousTransactions: row.suspiciousTransactions.toNumber?.() ?? row.suspiciousTransactions, alerts: 0 });
  }
  for (const row of reviewRows) {
    const day = row.day.toString();
    const existing = byDay.get(day) ?? { date: day, suspiciousTransactions: 0, alerts: 0 };
    existing.alerts = row.alerts.toNumber?.() ?? row.alerts;
    byDay.set(day, existing);
  }

  return [...byDay.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => {
      const total = d.alerts + d.suspiciousTransactions;
      return {
        date: d.date,
        alerts: d.alerts,
        suspiciousTransactions: d.suspiciousTransactions,
        detectionRate: total > 0 ? Math.round((d.alerts / total) * 100) : 0,
        low: Math.round(total * 0.4),
        medium: Math.round(total * 0.3),
        high: Math.round(total * 0.2),
        critical: Math.round(total * 0.1),
      };
    });
}
