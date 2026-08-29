/**
 * Multi-hop "buyers who bought this also bought" recommendation.
 * Two hops: target product -> buyers who purchased it -> other products
 * those same buyers purchased, excluding the target itself.
 */
export const GET_PRODUCT_RECOMMENDATIONS = /* cypher */ `
  MATCH (target:Product {id: $productId})<-[:FOR_PRODUCT]-(:Transaction)<-[:PURCHASED]-(buyer:Buyer)
  MATCH (buyer)-[:PURCHASED]->(:Transaction)-[:FOR_PRODUCT]->(rec:Product)
  WHERE rec.id <> target.id
  WITH rec, count(DISTINCT buyer) AS buyerOverlap
  WHERE buyerOverlap >= $minOverlap
  OPTIONAL MATCH (reviewer)-[:WROTE_REVIEW]->(review:Review)-[:ABOUT]->(rec)
  WITH rec, buyerOverlap, avg(review.rating) AS avgRating, count(review) AS reviewCount
  RETURN
    rec.id AS id,
    rec.name AS name,
    rec.category AS category,
    rec.price AS price,
    buyerOverlap,
    coalesce(avgRating, 4.0) AS avgRating,
    reviewCount
  ORDER BY buyerOverlap DESC
  LIMIT $limit
`;

/**
 * Fallback for the "browse all" view (no specific product selected yet) —
 * ranks products by overall purchase popularity instead of co-purchase
 * overlap with one target product.
 */
export const GET_TRENDING_PRODUCTS = /* cypher */ `
  MATCH (p:Product)<-[:FOR_PRODUCT]-(:Transaction)<-[:PURCHASED]-(buyer:Buyer)
  WITH p, count(DISTINCT buyer) AS buyerOverlap
  WHERE buyerOverlap >= $minOverlap
  OPTIONAL MATCH (reviewer)-[:WROTE_REVIEW]->(review:Review)-[:ABOUT]->(p)
  WITH p, buyerOverlap, avg(review.rating) AS avgRating, count(review) AS reviewCount
  RETURN
    p.id AS id,
    p.name AS name,
    p.category AS category,
    p.price AS price,
    buyerOverlap,
    coalesce(avgRating, 4.0) AS avgRating,
    reviewCount
  ORDER BY buyerOverlap DESC
  LIMIT $limit
`;
