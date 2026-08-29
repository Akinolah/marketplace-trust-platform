import 'dotenv/config';
import { faker } from '@faker-js/faker';
import { getDriver, closeDriver } from '../src/db/driver.js';
import {
  generateUser,
  generateProduct,
  generateFraudRing,
  generateBuyerProfile,
  generateTransaction,
  generateReview,
} from './generators.js';

const NORMAL_USER_COUNT = 300;
const PRODUCT_COUNT = 150;
const FRAUD_RING_COUNT = 8;
const BUYER_RATIO = 0.7; // fraction of normal users who also become buyers
const REVIEWER_RATIO = 0.6; // fraction of normal users who leave reviews

async function run() {
  const driver = getDriver();
  const session = driver.session();
  const startedAt = Date.now();

  try {
    console.log('Clearing existing data...');
    await session.run('MATCH (n) DETACH DELETE n');

    console.log(`Seeding ${NORMAL_USER_COUNT} normal users...`);
    const users = Array.from({ length: NORMAL_USER_COUNT }, generateUser);
    await session.run(
      `UNWIND $users AS u
       CREATE (:User {id: u.id, name: u.name, email: u.email, createdAt: datetime(u.createdAt), verified: u.verified, trustScore: u.trustScore})`,
      { users }
    );

    console.log(`Seeding ${PRODUCT_COUNT} products...`);
    const products = Array.from({ length: PRODUCT_COUNT }, generateProduct);
    await session.run(
      `UNWIND $products AS p
       CREATE (:Product {id: p.id, name: p.name, category: p.category, price: p.price, listedAt: datetime(p.listedAt)})`,
      { products }
    );

    console.log('Marking a subset of users as buyers...');
    const buyerCount = Math.floor(users.length * BUYER_RATIO);
    const buyerUsers = faker.helpers.arrayElements(users, buyerCount);
    const buyerProfiles = buyerUsers.map((u) => generateBuyerProfile(u.id));
    await session.run(
      `UNWIND $buyers AS b
       MATCH (u:User {id: b.userId})
       CREATE (buyer:Buyer {id: b.id, spendingTier: b.spendingTier})
       CREATE (u)-[:IS_BUYER]->(buyer)`,
      { buyers: buyerProfiles }
    );

    console.log('Seeding purchases (PURCHASED -> Transaction -> FOR_PRODUCT)...');
    const purchaseLinks = [];
    for (const buyer of buyerProfiles) {
      const purchaseCount = faker.number.int({ min: 2, max: 10 });
      const chosenProducts = faker.helpers.arrayElements(products, purchaseCount);
      for (const product of chosenProducts) {
        purchaseLinks.push({
          buyerId: buyer.id,
          productId: product.id,
          transaction: generateTransaction(),
        });
      }
    }
    await session.run(
      `UNWIND $links AS link
       MATCH (b:Buyer {id: link.buyerId})
       MATCH (p:Product {id: link.productId})
       CREATE (t:Transaction {id: link.transaction.id, amount: link.transaction.amount, timestamp: datetime(link.transaction.timestamp), status: link.transaction.status})
       CREATE (b)-[:PURCHASED]->(t)
       CREATE (t)-[:FOR_PRODUCT]->(p)`,
      { links: purchaseLinks }
    );
    console.log(`  -> ${purchaseLinks.length} transactions linked`);

    console.log('Seeding reviews (WROTE_REVIEW -> Review -> ABOUT)...');
    const reviewerCount = Math.floor(users.length * REVIEWER_RATIO);
    const reviewers = faker.helpers.arrayElements(users, reviewerCount);
    const reviewLinks = [];
    for (const reviewer of reviewers) {
      const reviewCount = faker.number.int({ min: 1, max: 5 });
      const reviewedProducts = faker.helpers.arrayElements(products, reviewCount);
      for (const product of reviewedProducts) {
        reviewLinks.push({
          userId: reviewer.id,
          productId: product.id,
          review: generateReview(),
        });
      }
    }
    await session.run(
      `UNWIND $links AS link
       MATCH (u:User {id: link.userId})
       MATCH (p:Product {id: link.productId})
       CREATE (r:Review {id: link.review.id, rating: link.review.rating, text: link.review.text, timestamp: datetime(link.review.timestamp)})
       CREATE (u)-[:WROTE_REVIEW]->(r)
       CREATE (r)-[:ABOUT]->(p)`,
      { links: reviewLinks }
    );
    console.log(`  -> ${reviewLinks.length} reviews linked`);

    console.log(`Seeding ${FRAUD_RING_COUNT} fraud rings...`);
    let ringUserTotal = 0;
    let ringSuspiciousLinks = 0;
    for (let i = 0; i < FRAUD_RING_COUNT; i++) {
      const ring = generateFraudRing();
      ringUserTotal += ring.users.length;

      await session.run(
        `UNWIND $users AS u
         CREATE (usr:User {id: u.id, name: u.name, email: u.email, createdAt: datetime(u.createdAt), verified: u.verified, trustScore: u.trustScore})
         MERGE (ip:IP_Address {address: $sharedIp})
         MERGE (pm:Payment_Method {lastFour: $sharedCardLastFour})
         MERGE (usr)-[:SHARES_IP]->(ip)
         MERGE (usr)-[:SHARES_PAYMENT]->(pm)`,
        { users: ring.users, sharedIp: ring.sharedIp, sharedCardLastFour: ring.sharedCardLastFour }
      );

      // Give the ring 1-2 shared "target" products they all review highly —
      // this is what makes the fraud query's suspiciousProducts count > 0,
      // simulating collusive fake-review / inflated-rating behavior.
      const targetProducts = faker.helpers.arrayElements(products, faker.number.int({ min: 1, max: 2 }));
      const collusiveReviews = [];
      for (const ringUser of ring.users) {
        for (const product of targetProducts) {
          collusiveReviews.push({
            userId: ringUser.id,
            productId: product.id,
            review: generateReview(faker.number.int({ min: 4, max: 5 })),
          });
        }
      }
      await session.run(
        `UNWIND $links AS link
         MATCH (u:User {id: link.userId})
         MATCH (p:Product {id: link.productId})
         CREATE (r:Review {id: link.review.id, rating: link.review.rating, text: link.review.text, timestamp: datetime(link.review.timestamp)})
         CREATE (u)-[:WROTE_REVIEW]->(r)
         CREATE (r)-[:ABOUT]->(p)`,
        { links: collusiveReviews }
      );
      ringSuspiciousLinks += collusiveReviews.length;
    }
    console.log(`  -> ${ringUserTotal} ring users, ${ringSuspiciousLinks} collusive reviews seeded`);

    const counts = await session.run(
      `MATCH (n) WITH count(n) AS nodeCount
       MATCH ()-[r]->() RETURN nodeCount, count(r) AS relCount`
    );
    const { nodeCount, relCount } = counts.records[0]?.toObject() ?? {};
    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);

    console.log(`\nSeed complete in ${elapsed}s`);
    console.log(`  Nodes:        ${nodeCount}`);
    console.log(`  Relationships: ${relCount}`);
  } finally {
    await session.close();
    await closeDriver();
  }
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
