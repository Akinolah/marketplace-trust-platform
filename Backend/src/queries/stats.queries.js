export const GET_TOTALS_AND_TRUST = /* cypher */ `
  MATCH (u:User)
  WITH count(u) AS totalUsers, avg(u.trustScore) AS avgTrust,
       sum(CASE WHEN u.trustScore < 0.4 THEN 1 ELSE 0 END) AS critical,
       sum(CASE WHEN u.trustScore >= 0.4 AND u.trustScore < 0.6 THEN 1 ELSE 0 END) AS suspicious,
       sum(CASE WHEN u.trustScore >= 0.6 AND u.trustScore < 0.8 THEN 1 ELSE 0 END) AS moderate,
       sum(CASE WHEN u.trustScore >= 0.8 THEN 1 ELSE 0 END) AS trusted
  MATCH (p:Product)
  RETURN totalUsers, avgTrust, critical, suspicious, moderate, trusted, count(p) AS totalProducts
`;

export const GET_FLAGGED_USER_COUNT = /* cypher */ `
  MATCH (u:User)-[:SHARES_IP]->(:IP_Address)
  RETURN count(DISTINCT u) AS flaggedUsers
`;

// Week-over-week comparison used for the dashboard trend arrows. Wrapped in
// try/catch by the caller since temporal arithmetic support can vary by
// openCypher implementation — falls back to a neutral trend if it errors.
export const GET_WEEK_OVER_WEEK = /* cypher */ `
  WITH datetime() AS now
  MATCH (u:User) WHERE u.createdAt >= now - duration({days: 7})
  WITH now, count(u) AS usersLast7
  MATCH (u2:User) WHERE u2.createdAt >= now - duration({days: 14}) AND u2.createdAt < now - duration({days: 7})
  WITH now, usersLast7, count(u2) AS usersPrev7
  MATCH (p:Product) WHERE p.listedAt >= now - duration({days: 7})
  WITH now, usersLast7, usersPrev7, count(p) AS productsLast7
  MATCH (p2:Product) WHERE p2.listedAt >= now - duration({days: 14}) AND p2.listedAt < now - duration({days: 7})
  RETURN usersLast7, usersPrev7, productsLast7, count(p2) AS productsPrev7
`;
