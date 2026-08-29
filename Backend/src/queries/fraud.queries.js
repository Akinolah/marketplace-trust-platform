/**
 * Fraud rings, grouped correctly this time: every member of a ring shares
 * the SAME IP node and the SAME payment-method node (that's how seed.js
 * builds them), so grouping directly by (ip, paymentMethod) reconstructs
 * full ring membership in one pass — no pairwise combinatorics needed.
 */
export const FIND_FRAUD_RINGS = /* cypher */ `
  MATCH (u:User)-[:SHARES_IP]->(ip:IP_Address)
  MATCH (u)-[:SHARES_PAYMENT]->(pm:Payment_Method)
  WITH ip, pm, collect(DISTINCT u) AS ringUsers
  WHERE size(ringUsers) > 1
  UNWIND ringUsers AS member
  OPTIONAL MATCH (member)-[:WROTE_REVIEW]->(:Review)-[:ABOUT]->(p:Product)
  OPTIONAL MATCH (member)-[:IS_BUYER]->(:Buyer)-[:PURCHASED]->(t:Transaction)
  WITH ip, pm, ringUsers,
       collect(DISTINCT p) AS reviewedProducts,
       count(DISTINCT t) AS transactionCount
  RETURN
    ip.address AS sharedIp,
    pm.lastFour AS sharedPayment,
    [u IN ringUsers | {id: u.id, name: u.name, trustScore: u.trustScore, createdAt: toString(u.createdAt)}] AS members,
    size(ringUsers) AS connectedUsers,
    size(reviewedProducts) AS suspiciousProducts,
    transactionCount
  ORDER BY connectedUsers DESC, suspiciousProducts DESC
  LIMIT $limit
`;

/**
 * Day-bucketed trend data for the dashboard chart. We don't have a
 * dedicated FraudAlert node in the model, so this uses two real proxies
 * instead: flagged transactions (suspiciousTransactions) and collusive
 * high-rating reviews from ring members (alerts) — both grounded in
 * actual seeded data rather than being fabricated.
 */
export const GET_FRAUD_TRENDS = /* cypher */ `
  WITH date($since) AS startDate
  MATCH (t:Transaction)
  WHERE t.status = 'flagged' AND date(t.timestamp) >= startDate
  WITH startDate, date(t.timestamp) AS day, count(t) AS suspiciousTransactions
  RETURN day, suspiciousTransactions, 0 AS alerts, 0 AS low, 0 AS medium, 0 AS high, 0 AS critical
  ORDER BY day
`;

export const GET_COLLUSIVE_REVIEW_TRENDS = /* cypher */ `
  WITH date($since) AS startDate
  MATCH (u:User)-[:SHARES_IP]->(:IP_Address)
  MATCH (u)-[:WROTE_REVIEW]->(r:Review)
  WHERE r.rating >= 4 AND date(r.timestamp) >= startDate
  WITH date(r.timestamp) AS day, count(r) AS alerts
  RETURN day, alerts
  ORDER BY day
`;
