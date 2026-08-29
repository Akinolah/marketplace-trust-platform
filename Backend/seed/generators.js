import { faker } from '@faker-js/faker';

export function generateUser() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    verified: faker.datatype.boolean(),
    trustScore: faker.number.float({ min: 0.4, max: 1, fractionDigits: 2 }),
  };
}

export function generateProduct() {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    category: faker.commerce.department(),
    price: Number(faker.commerce.price({ min: 5, max: 500 })),
    listedAt: faker.date.past({ years: 1 }).toISOString(),
  };
}

/**
 * A fraud ring: 3-8 users deliberately sharing one IP and one payment method,
 * with deliberately LOW trust scores so they're distinguishable from
 * ordinary users who occasionally share a household IP.
 */
export function generateFraudRing() {
  const sharedIp = faker.internet.ipv4();
  const sharedCardLastFour = faker.finance.creditCardNumber('####').slice(-4);
  const size = faker.number.int({ min: 3, max: 8 });

  const users = Array.from({ length: size }, () => ({
    ...generateUser(),
    trustScore: faker.number.float({ min: 0.05, max: 0.35, fractionDigits: 2 }),
  }));

  return { sharedIp, sharedCardLastFour, users };
}

export function generateBuyerProfile(userId) {
  return {
    id: faker.string.uuid(),
    userId,
    spendingTier: faker.helpers.arrayElement(['low', 'medium', 'high']),
  };
}

export function generateTransaction() {
  return {
    id: faker.string.uuid(),
    amount: Number(faker.commerce.price({ min: 5, max: 500 })),
    timestamp: faker.date.past({ years: 1 }).toISOString(),
    status: faker.helpers.weightedArrayElement([
      { value: 'completed', weight: 9 },
      { value: 'flagged', weight: 1 },
    ]),
  };
}

/**
 * @param {number} rating - pass a fixed high rating (4-5) when generating
 *   collusive fraud-ring reviews so the fraud query's suspiciousProducts
 *   count actually finds something.
 */
export function generateReview(rating) {
  return {
    id: faker.string.uuid(),
    rating: rating ?? faker.number.int({ min: 1, max: 5 }),
    text: faker.lorem.sentence(),
    timestamp: faker.date.past({ years: 1 }).toISOString(),
  };
}
