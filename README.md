# Marketplace — Smart Trust & Discovery Platform

A marketplace platform that detects fraud rings and powers product recommendations using a graph database (CognoDB, openCypher over Bolt). Built with a monorepo: Next.js dashboard frontend and Fastify REST API backend.

---

## Table of Contents

- [Architecture](#architecture)
- [Why a Graph Database?](#why-a-graph-database)
- [How the Code Works](#how-the-code-works)
  - [Backend Connection Points](#backend-connection-points)
  - [Frontend Connection Points](#frontend-connection-points)
- [Data Model](#data-model)
- [UI Screenshot](#ui-screenshot)
- [Setup](#setup)
- [Main Queries](#main-queries)
- [Free-tier Hosting](#free-tier-hosting)

---

## Architecture

### Monorepo Layout

```
Marketplace/
├── Frontend/          Next.js 15 dashboard (TypeScript, Tailwind, React Query)
├── Backend/           Fastify 5 REST API (Node.js, Cypher queries, seed data)
├── package.json       Root workspace (shared dependencies if any)
└── README.md
```

### Tech Stack

| Layer          | Technology                          | Purpose                                                   |
| -------------- | ----------------------------------- | --------------------------------------------------------- |
| **Frontend**   | Next.js 15 + TypeScript             | Server & client-side rendering, dashboard UI              |
| **State Mgmt** | React Query (@tanstack/react-query) | Data fetching, caching, sync across components            |
| **Styling**    | Tailwind CSS + shadcn/ui            | Component library and utility-first CSS                   |
| **Backend**    | Fastify 5                           | High-performance REST API, routing, CORS                  |
| **Database**   | CognoDB (openCypher)                | Graph database for complex fraud & recommendation queries |
| **Protocol**   | Bolt over TLS (bolt+s://)           | Native Neo4j wire protocol, optimized for graph traversal |

---

## Why a Graph Database?

A **relational database (SQL)** organizes data into isolated tables with foreign key joins. A **graph database (Cypher)** models data as interconnected nodes and relationships, making certain queries dramatically simpler and faster.

### Problem: Fraud Detection with SQL

Fraud rings are **networks** — sets of users who share IP addresses, payment methods, or devices. In SQL:

```sql
-- SQL: Find all users who share the same IP as user X
SELECT DISTINCT u2.id, u2.name
FROM users u1
JOIN ip_addresses ip ON u1.ip_id = ip.id
JOIN users u2 ON ip.id = u2.ip_id
WHERE u1.id = 'X' AND u2.id != u1.id;

-- SQL: Find users who share BOTH the same IP AND payment method (multi-level join hell)
SELECT DISTINCT u3.id, u3.name
FROM users u1
JOIN ip_addresses ip ON u1.ip_id = ip.id
JOIN users u2 ON ip.id = u2.ip_id
JOIN payment_methods pm ON u1.payment_id = pm.id
JOIN users u3 ON pm.id = u3.payment_id
WHERE u1.id = 'X' AND (u2.id != u1.id OR u3.id != u1.id)
GROUP BY u3.id;
```

This becomes exponentially complex for **3+ hop relationships**.

### Solution: Fraud Detection with Cypher

Graph queries express relationships naturally:

```cypher
-- Cypher: Find fraud ring members (users sharing IP + payment method)
MATCH (u:User)-[:SHARES_IP]->(ip:IP_Address)
MATCH (u)-[:SHARES_PAYMENT]->(pm:Payment_Method)
WITH ip, pm, collect(DISTINCT u) AS ringUsers
WHERE size(ringUsers) > 1
RETURN ip.address, pm.lastFour, ringUsers
```

### Key Graph Database Advantages

| Feature                       | SQL                                           | Graph (Cypher)                   |
| ----------------------------- | --------------------------------------------- | -------------------------------- |
| **Multi-hop relationships**   | Repeated JOINs, N² complexity                 | Native path traversal, O(n)      |
| **Network clustering**        | Requires application logic + multiple queries | Single `MATCH` with grouping     |
| **Recommendation algorithms** | Correlated subqueries, materialized views     | Natural graph walks              |
| **Performance**               | Degrades with depth                           | Constant regardless of hops      |
| **Query readability**         | `JOIN ... JOIN ... JOIN`                      | `(node)-[:RELATIONSHIP]->(node)` |

### Fraud & Recommendation Use Cases

1. **Fraud Ring Detection**: Find clusters of users who share multiple attributes (IP, payment, device). _Graph advantage: Transitive closure in one query._

2. **Co-purchase Recommendations**: "Buyers who bought Product A also bought Product B." _Graph advantage: Two-hop traversal (`Product ← Buyer → Product`) is idiomatic; SQL requires self-join._

3. **Collusive Review Detection**: Identify suspicious high-rating reviews from ring members. _Graph advantage: Filter along relationship path: `(User)-[:SHARES_IP]->(...)-[:WROTE_REVIEW]->(Review)`._

4. **Trust Score Propagation**: Compute trust transitively across the network. _Graph advantage: BFS/DFS naturally follow edges._

---

## How the Code Works

### Frontend–Backend Connection Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ React Components (e.g., fraud-ring-card.tsx)        │   │
│  │   └─ useFraudRings() [React Query]                   │   │
│  │       └─ endpoints.getFraudRings()                   │   │
│  │           └─ apiClient.get('/fraud/rings')           │   │
│  │               └─ Axios HTTP GET                      │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬───────────────────────────────────────────┘
                   │ HTTPS/REST
                   │
┌──────────────────┴───────────────────────────────────────────┐
│                      Backend (Fastify)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ GET /api/fraud/rings [fraud.routes.js]              │   │
│  │   ├─ getFraudRings(limit=25) [fraud.service.js]      │   │
│  │   │   └─ runQuery(FIND_FRAUD_RINGS, {limit: 25})    │   │
│  │   │       └─ [fraud.queries.js] Cypher string        │   │
│  │   └─ Receive result array, send JSON reply          │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬───────────────────────────────────────────┘
                   │ Bolt Protocol
                   │
┌──────────────────┴───────────────────────────────────────────┐
│              Graph Database (CognoDB / Neo4j)                │
│  MATCH (u:User)-[:SHARES_IP]->(ip:IP_Address)               │
│  MATCH (u)-[:SHARES_PAYMENT]->(pm:Payment_Method)           │
│  WITH ip, pm, collect(DISTINCT u) AS ringUsers             │
│  WHERE size(ringUsers) > 1                                  │
│  RETURN ip.address, pm.lastFour, ringUsers ...              │
└─────────────────────────────────────────────────────────────┘
```

### Backend Connection Points

**1. Routes** (`Backend/src/routes/`)

- **Entry point**: HTTP endpoints listening on `/api`
- Files: `fraud.routes.js`, `recommendation.routes.js`, `stats.routes.js`
- Example: `GET /api/fraud/rings` → calls service layer

**2. Services** (`Backend/src/services/`)

- **Business logic**: Orchestrate database calls and response formatting
- Files: `fraud.service.js`, `recommendation.service.js`, `stats.service.js`
- Example: `getFraudRings()` → runs Cypher query, transforms result

**3. Queries** (`Backend/src/queries/`)

- **Cypher templates**: Parameterized graph queries
- Files: `fraud.queries.js`, `recommendation.queries.js`, `stats.queries.js`
- Example: `FIND_FRAUD_RINGS` exported as a Cypher string with `$limit` placeholder

**4. Database Driver** (`Backend/src/db/driver.js`)

- **Connection pool**: Manages Bolt connection to CognoDB
- Exports: `verifyConnectivity()`, `runQuery()`, `closeDriver()`

**5. App & Server** (`Backend/src/app.js`, `Backend/src/server.js`)

- **Initialization**: Fastify setup, CORS, error handlers
- Health check: Real `/health` endpoint that round-trips to CognoDB
- Startup: Connects to database and listens on `localhost:4000`

### Frontend Connection Points

**1. API Client & Endpoints** (`Frontend/lib/api/`)

- `client.ts`: Axios instance configured with backend base URL (from `.env.local`)
- `endpoints.ts`: Typed API methods (e.g., `getFraudRings()`, `getProductRecommendations()`)
- Returns: Promises typed with models from `@/lib/types`

**2. React Query Hooks** (`Frontend/hooks/use-api.ts`)

- Wraps endpoint calls in `useQuery()` for caching and refetching
- Examples:
  - `useFraudRings()` → `queryKey: ['fraud-rings']`, `queryFn: () => endpoints.getFraudRings()`
  - `useProductRecommendations(productId)` → parameterized query

**3. Components** (`Frontend/components/`)

- Consume hooks to fetch and display data
- Examples:
  - `fraud/fraud-ring-card.tsx`: Displays a single fraud ring
  - `fraud/graph-visualization.tsx`: Renders ring members and relationships
  - `products/product-recommendation-card.tsx`: Shows recommended products
- Automatically re-fetch on tab focus (React Query default)

**4. Type Definitions** (`Frontend/lib/types/`)

- `FraudRing`, `SuspiciousReview`, `FraudTrendPoint`, `Product`, etc.
- Keep frontend types in sync with backend JSON responses

---

## Data Model

### Core Nodes & Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│ Entities                                                        │
├─────────────────────────────────────────────────────────────────┤
│ :User (id, name, trustScore, createdAt)                        │
│   ├─ SHARES_IP ──→ :IP_Address (address)                       │
│   ├─ SHARES_PAYMENT ──→ :Payment_Method (lastFour, issuer)     │
│   ├─ WROTE_REVIEW ──→ :Review (rating, timestamp, text)        │
│   │                    ├─ ABOUT ──→ :Product                   │
│   │                    └─ BY_USER ──→ :User                    │
│   └─ IS_BUYER ──→ :Buyer                                       │
│         └─ PURCHASED ──→ :Transaction                          │
│               └─ FOR_PRODUCT ──→ :Product                      │
│                                                                 │
│ :Product (id, name, category, price, trustScore)              │
│   ├─ SOLD_BY ──→ :Seller                                       │
│   └─ ←─ ABOUT ─── :Review                                      │
│                                                                 │
│ :Seller (id, name, trustScore)                                │
│   └─ LISTED_PRODUCT ──→ :Product                              │
└─────────────────────────────────────────────────────────────────┘
```

### Why This Structure Enables Graph Queries

- **Fraud Ring Detection**: Groups users by shared (IP, payment) pairs
- **Co-purchase Recommendation**: Two-hop walk from target product through buyer nodes
- **Review Authenticity**: Checks if reviewers share infrastructure (IP/payment)
- **Trust Propagation**: Transitive trust scores across SHARES\_\* relationships

---

## UI Screenshot

The dashboard highlights the two core assessment features: fraud-ring detection and marketplace trust analytics.

![Marketplace Trust Dashboard](assets/Screenshot%202026-08-29%20052829.png)

This UI shows the main monitoring workflow:

- Fraud ring detection panel with risk scoring and shared infrastructure indicators
- Marketplace health metrics and trust score overview
- Product and review intelligence for investigation workflows

---

## Setup

### 1. Provision CognoDB

1. Sign up at https://console.cognodb.com/signup (no card required for free tier)
2. Create a free `c0` instance, pick a region
3. Copy the `bolt+s://` URI and generated password immediately — shown once

### 2. Backend

```bash
cd Backend

# Copy environment template and fill in credentials
cp .env.example .env
# Edit .env with your COGNODB_URI, COGNODB_USER, COGNODB_PASSWORD

npm install

# Load seed data (creates nodes and relationships)
npm run seed

# Start server (http://localhost:4000)
npm run dev

# In another terminal, verify health:
curl http://localhost:4000/health
```

### 3. Frontend

```bash
cd Frontend

# Copy environment template
cp .env.local.example .env.local
# Edit .env.local with backend URL (default: http://localhost:4000/api)

npm install

# Start dev server (http://localhost:3000)
npm run dev

# Redirects to /dashboard automatically
# Dashboard loads data from backend via React Query
```

---

## Free-tier Hosting

For a submission or demo, this app is already set up to deploy on Netlify's free tier.

### Option 1: Netlify (recommended)

1. Push this repo to GitHub.
2. In Netlify, choose "Add new site" → "Import an existing project".
3. Select the repository.
4. Set the build command to:

```bash
cd Frontend && npm install && npx next build
```

5. Set the publish directory to:

```bash
Frontend/.next
```

6. For the backend, either:
   - keep it local for the assessment, or
   - deploy the backend as a separate Node service on Render or Railway (free tiers), then update the frontend API URL in `Frontend/.env.local`.

### Option 2: Vercel

1. Import the repo in Vercel.
2. Set the app root to `Frontend`.
3. Use the default Next.js settings.
4. Add the backend URL as an environment variable such as `NEXT_PUBLIC_API_URL`.

> For a classroom assessment, the key requirement is usually a working public demo link plus a clear UI screenshot. Netlify/Vercel are the easiest free-tier options.

---

## Main Queries

### Fraud Detection: FIND_FRAUD_RINGS

**What it does**: Identifies clusters of users who share both the same IP address **and** payment method.

**Why it needs a graph**:

- SQL requires a self-join: `users u1 JOIN users u2 ON u1.ip_id = u2.ip_id AND u1.payment_id = u2.payment_id`
- Cypher naturally groups along two relationship axes in a single pass
- Returns ring members **with all their related reviews and transactions** in one query

**Query** (simplified):

```cypher
MATCH (u:User)-[:SHARES_IP]->(ip:IP_Address)
MATCH (u)-[:SHARES_PAYMENT]->(pm:Payment_Method)
WITH ip, pm, collect(DISTINCT u) AS ringUsers
WHERE size(ringUsers) > 1
UNWIND ringUsers AS member
OPTIONAL MATCH (member)-[:WROTE_REVIEW]->(:Review)-[:ABOUT]->(p:Product)
OPTIONAL MATCH (member)-[:PURCHASED]->(t:Transaction)
RETURN
  ip.address AS sharedIp,
  pm.lastFour AS sharedPayment,
  [u IN ringUsers | {id: u.id, name: u.name, trustScore: u.trustScore}] AS members,
  size(ringUsers) AS connectedUsers,
  count(DISTINCT p) AS suspiciousProducts,
  count(t) AS transactionCount
```

---

### Recommendations: GET_PRODUCT_RECOMMENDATIONS

**What it does**: For a given product, find other products frequently bought by the same customers (collaborative filtering via co-purchase).

**Why it needs a graph**:

- SQL: `SELECT rec FROM products rec JOIN transactions t2 ON rec.id = t2.product_id JOIN (SELECT DISTINCT buyer_id FROM transactions WHERE product_id = $targetId) buyers ON t2.buyer_id = buyers.buyer_id`
- Cypher: Two-hop walk from product through buyer to recommended products
- Easily ranks by overlap strength (how many shared buyers)

**Query** (simplified):

```cypher
MATCH (target:Product {id: $productId})<-[:FOR_PRODUCT]-(:Transaction)<-[:PURCHASED]-(buyer:Buyer)
MATCH (buyer)-[:PURCHASED]->(:Transaction)-[:FOR_PRODUCT]->(rec:Product)
WHERE rec.id <> target.id
WITH rec, count(DISTINCT buyer) AS buyerOverlap
WHERE buyerOverlap >= $minOverlap
RETURN rec, buyerOverlap
ORDER BY buyerOverlap DESC
LIMIT $limit
```

---

### Metrics: GET_FRAUD_TRENDS

**What it does**: Returns day-bucketed counts of flagged transactions over a date range for the dashboard chart.

**Why a graph**: Even simple aggregations benefit from graph indexes; CognoDB's native timestamp indexing is optimized for time-series queries on relationships.

---

## Summary

| Feature             | Benefit                                                                       |
| ------------------- | ----------------------------------------------------------------------------- |
| **Fraud Rings**     | Find connected clusters in one query (Cypher) vs. multiple nested joins (SQL) |
| **Recommendations** | Natural co-purchase traversal; easy to tune by overlap threshold              |
| **Scalability**     | Graph queries scale with relationship density, not table size                 |
| **Readability**     | Cypher mirrors the mental model: "users who share X are connected"            |
| **Extensibility**   | Add new relationship types without schema migration—just add edges            |
