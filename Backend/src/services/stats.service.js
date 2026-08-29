import { runRead } from '../db/driver.js';
import { GET_TOTALS_AND_TRUST, GET_FLAGGED_USER_COUNT, GET_WEEK_OVER_WEEK } from '../queries/stats.queries.js';
import { getFraudRings } from './fraud.service.js';

function toNum(value) {
  return typeof value?.toNumber === 'function' ? value.toNumber() : Number(value ?? 0);
}

function trend(current, previous, label) {
  if (previous === 0) {
    return { value: 0, direction: 'neutral', label };
  }
  const change = Math.round(((current - previous) / previous) * 100);
  return {
    value: Math.abs(change),
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    label,
  };
}

export async function getDashboardStats(range = '30d') {
  const [[totals], [flagged], rings] = await Promise.all([
    runRead(GET_TOTALS_AND_TRUST),
    runRead(GET_FLAGGED_USER_COUNT),
    getFraudRings(5),
  ]);

  // Temporal arithmetic support can vary by openCypher backend — degrade to
  // neutral trends rather than failing the whole endpoint if it errors.
  let weekOverWeek = { usersLast7: 0, usersPrev7: 0, productsLast7: 0, productsPrev7: 0 };
  try {
    const [wow] = await runRead(GET_WEEK_OVER_WEEK);
    if (wow) weekOverWeek = wow;
  } catch (err) {
    // Leave weekOverWeek at the neutral default.
  }

  const totalUsers = toNum(totals?.totalUsers);
  const totalProducts = toNum(totals?.totalProducts);
  const avgTrust = Number(totals?.avgTrust ?? 0);
  const flaggedUsers = toNum(flagged?.flaggedUsers);

  return {
    users: totalUsers,
    products: totalProducts,
    fraudAlerts: flaggedUsers,
    trustScore: Math.round(avgTrust * 100),
    trends: {
      users: trend(toNum(weekOverWeek.usersLast7), toNum(weekOverWeek.usersPrev7), 'vs last week'),
      products: trend(toNum(weekOverWeek.productsLast7), toNum(weekOverWeek.productsPrev7), 'vs last week'),
      fraud: { value: rings.length, direction: rings.length > 0 ? 'up' : 'neutral', label: 'active rings' },
      trust: { value: Math.round(avgTrust * 100), direction: 'neutral', label: 'platform average' },
    },
    trustDistribution: {
      trusted: toNum(totals?.trusted),
      moderate: toNum(totals?.moderate),
      suspicious: toNum(totals?.suspicious),
      critical: toNum(totals?.critical),
    },
    recentAlerts: rings.map((ring) => ({
      id: ring.id,
      severity: ring.severity,
      title: `Fraud ring detected — ${ring.connectedUsers} linked accounts`,
      description: `Shared IP ${ring.sharedIp} and payment ending ${ring.sharedPayment}`,
      timestamp: ring.detectedAt,
      actionLabel: 'Investigate',
    })),
  };
}
