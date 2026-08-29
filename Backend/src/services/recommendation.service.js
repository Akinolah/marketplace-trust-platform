import { runRead } from '../db/driver.js';
import { GET_PRODUCT_RECOMMENDATIONS, GET_TRENDING_PRODUCTS } from '../queries/recommendation.queries.js';

function toNum(value) {
  return typeof value?.toNumber === 'function' ? value.toNumber() : Number(value ?? 0);
}

function mapRow(row, maxOverlap) {
  const buyerOverlap = toNum(row.buyerOverlap);
  const reviewCount = toNum(row.reviewCount);
  const avgRating = typeof row.avgRating?.toNumber === 'function' ? row.avgRating.toNumber() : Number(row.avgRating ?? 4);
  const matchScore = maxOverlap > 0 ? Math.round((buyerOverlap / maxOverlap) * 100) : 50;

  const badges = [];
  if (matchScore >= 80) badges.push('best-seller');
  else if (matchScore >= 50) badges.push('trending');

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    rating: Math.round(avgRating * 10) / 10,
    image: `https://picsum.photos/seed/${row.id}/480/360`,
    matchScore,
    buyersAlsoBought: buyerOverlap,
    badges,
    recommendationReasons: [
      `${buyerOverlap} buyer${buyerOverlap === 1 ? '' : 's'} who bought related items also bought this`,
      reviewCount > 0 ? `${reviewCount} review${reviewCount === 1 ? '' : 's'}, averaging ${Math.round(avgRating * 10) / 10}/5` : 'No reviews yet',
    ],
    recommendationConfidence: matchScore,
    graph: {
      nodes: [
        { id: `product:${row.id}`, type: 'product', label: row.name },
        { id: `buyers:${row.id}`, type: 'user', label: `${buyerOverlap} shared buyers` },
      ],
      relationships: [
        { id: `${row.id}-buyers`, source: `buyers:${row.id}`, target: `product:${row.id}`, type: 'PURCHASED' },
      ],
    },
  };
}

export async function getProductRecommendations(productId, limit = 10, minOverlap = 1) {
  const rows = await runRead(GET_PRODUCT_RECOMMENDATIONS, { productId, limit, minOverlap });
  const maxOverlap = Math.max(1, ...rows.map((r) => toNum(r.buyerOverlap)));
  return rows.map((row) => mapRow(row, maxOverlap));
}

export async function getTrendingProducts(limit = 10, minOverlap = 1) {
  const rows = await runRead(GET_TRENDING_PRODUCTS, { limit, minOverlap });
  const maxOverlap = Math.max(1, ...rows.map((r) => toNum(r.buyerOverlap)));
  return rows.map((row) => mapRow(row, maxOverlap));
}
