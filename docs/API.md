# Marketplace Trust Platform API Documentation

Base URL:

- Backend: https://marketplace-trust-platform.onrender.com

## Overview

This API exposes the marketplace monitoring and recommendation endpoints used by the frontend dashboard.

The current implementation focuses on the two core assessment features:

- Fraud ring detection
- Product recommendation and dashboard trust insights

## Authentication

This project does not currently implement user authentication or API keys.

## Endpoints

### GET /health

Returns the health status of the backend and database connection.

Example response:

```json
{
  "status": "ok",
  "uptimeSeconds": 1234,
  "database": {
    "connected": true,
    "latencyMs": 14,
    "address": "bolt+s://your-cognodb-instance"
  },
  "timestamp": "2026-08-29T12:00:00.000Z"
}
```

### GET /api/stats

Returns summary statistics for the dashboard.

Query params:

- `range` (optional): `7d`, `30d`, or `90d`

Example:

```bash
GET /api/stats?range=30d
```

Example response:

```json
{
  "totalAlerts": 128,
  "riskRate": 14.3,
  "trustScore": 92.4,
  "verifiedUsers": 84,
  "blockedTransactions": 29
}
```

### GET /api/fraud/rings

Returns detected fraud rings based on shared IP and payment relationships.

Query params:

- `limit` (optional): maximum number of rings to return

Example:

```bash
GET /api/fraud/rings?limit=10
```

Example response:

```json
[
  {
    "id": "192.168.1.55-4242",
    "ringNumber": "RING-001",
    "severity": "critical",
    "connectedUsers": 6,
    "sharedIp": "192.168.1.55",
    "sharedPayment": "4242",
    "transactions": 21,
    "riskScore": 95,
    "detectedAt": "2026-08-29T09:32:00.000Z",
    "graph": {
      "nodes": [],
      "relationships": []
    }
  }
]
```

### GET /api/fraud/trends

Returns fraud trend data over a time range.

Query params:

- `range` (optional): `7d`, `30d`, or `90d`

Example:

```bash
GET /api/fraud/trends?range=30d
```

### GET /api/recommendations/product/:productId

Returns product recommendations based on co-purchase overlap.

Example:

```bash
GET /api/recommendations/product/all
GET /api/recommendations/product/prod_123
```

Example response:

```json
[
  {
    "id": "prod_321",
    "name": "Smart Speaker",
    "category": "Electronics",
    "price": 89.99,
    "rating": 4.8,
    "matchScore": 84,
    "buyersAlsoBought": 12,
    "recommendationConfidence": 84,
    "recommendationReasons": [
      "12 buyers who bought related items also bought this",
      "8 reviews, averaging 4.8/5"
    ]
  }
]
```

## Error Responses

The API uses standard Fastify error responses.

Example:

```json
{
  "message": "Something went wrong on our end."
}
```

## Notes

- This API is currently designed for the marketplace trust and fraud monitoring use case.
- Some dashboard pages may still use stubbed or mock endpoints depending on the assessment scope.
- The core data model is graph-based and optimized for networks of shared identity, purchases, and reviews.
