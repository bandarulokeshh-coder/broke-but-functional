# 🏛️ Architecture & System Blueprint — Broke But Functional

## 1. System Overview
Broke But Functional is a modern, high-performance web application designed to simulate managing a ₹10,000 budget over a 30-day lifecycle.

## 2. Directory Hierarchy
```text
broke-app/
├── public/                 # Static assets, PWA Manifest, SEO
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── __tests__/          # Unit Test Suite
│   ├── components/         # Accessible React UI Components
│   ├── hooks/              # Business Logic Custom Hooks
│   ├── store/              # Central State Management (Context + Reducer)
│   ├── types/              # Domain Models & Type Safety
│   └── utils/              # Financial Formulas & Security
├── vercel.json             # Edge Headers & Caching Strategy
└── vite.config.ts          # Rollup Code Splitting Config
```

## 3. Data Flow
State mutations trigger real-time calculations across balance, safe daily allowance, health score, and risk level.