# n8n-nodes-beachday 🌴

[![npm version](https://img.shields.io/npm/v/n8n-nodes-beachday)](https://www.npmjs.com/package/n8n-nodes-beachday)
[![n8n Community Node](https://img.shields.io/badge/n8n-community%20node-blue)](https://docs.n8n.io/integrations/community-nodes/)

**Beach Day API** integration for n8n — real-time beach conditions, tides, water quality, and Beach Day Scores™ for **36,000+ beaches** across **103 countries**.

## Operations

| Operation | Description |
|---|---|
| **Get Beach Detail** | Full conditions: water quality, weather, ocean data, rules, amenities |
| **Get Beach Conditions** | Historical daily snapshots with tide data |
| **Get Beach Rules** | Activity rules (dogs, alcohol, fires, etc.) per beach |
| **Get Beach Amenities** | Lifeguards, restrooms, showers, parking, accessibility |
| **Get Tide Predictions** | Up to 7 days of high/low tide times + heights |
| **Get Top Scored Beaches** | Beaches ranked by Beach Day Score™ (0–100) |
| **Search Beaches** | Find beaches by name, country, or state code |
| **List Countries** | All available countries with beach counts |

## Installation

### In n8n (recommended)

1. Open n8n → **Settings** → **Community Nodes**
2. Click **Install a community node**
3. Enter `n8n-nodes-beachday`
4. Click **Install**

### Manual

```bash
npm install n8n-nodes-beachday
```

## Setup

1. Get your API key at [beachdayapi.com](https://beachdayapi.com)
2. In n8n, create a new **Beach Day API** credential
3. Paste your API key

## Example workflows

**"Is it a good beach day?"** — Get Beach Detail → extract `beach_day_score` → IF score > 70 → send Slack/email notification.

**Daily surf report** — Schedule trigger → Search Beaches (country: United States) → Get Tide Predictions for top results → format as message.

## Links

- [Beach Day API Documentation](https://beachdayapi.com/docs)
- [RapidAPI Listing](https://rapidapi.com/ryanvinson/api/beach-day-api)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Creator Portal](https://creators.n8n.io/nodes)