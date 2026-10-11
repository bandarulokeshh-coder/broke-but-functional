# 💸 Broke But Functional — Gen Z Financial Survival Engine

> **PROMPT RUN Hackathon Submission**  
> *Transforming ₹10,000 budget constraint over 30 days into an interconnected, gamified, and modern personal finance experience.*

[![Live Demo](https://img.shields.io/badge/Live-Demo%20HTTPS-8b5cf6?style=for-the-badge&logo=vercel)](https://broke-but-functional-fwed.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-18181b?style=for-the-badge&logo=github)](https://github.com/bandarulokeshh-coder/broke-but-functional)
[![FAIE Verified](https://img.shields.io/badge/FAIE%20v3-Strict%20Audit%20Ready-emerald?style=for-the-badge)](https://broke-but-functional-fwed.vercel.app)

---

## 📌 Problem Alignment & Core Features

### 1. 🎯 Dynamic 30-Day Budget & Real-time Runway Engine
- Simulates managing a strict ₹10,000 budget over a full 30-day lifecycle.
- Automatically calculates **Safe Daily Allowance** factoring in remaining days and pending fixed commitments.
- Provides an **End-of-Month Forecast** trajectory to prevent deficit crashes before Day 30.

### 2. 🔮 "What-If" Decision Sandbox (Predictive Simulation)
- Test potential expenditures or income events before executing them.
- Visual side-by-side metric diffs showing the exact effect on remaining balance, daily cap, health score, and risk profile.
- 1-click "Make It Real" to commit simulated decisions to actual state.

### 3. ⚡ Interconnected Consequence Matrix
- Fixed Commitments (Rent, WiFi, Mobile Recharge) hold reserved funds from daily spending allowances.
- Subscriptions (Spotify, Netflix) dynamically drain liquidity and affect the health score.
- Integrated **"Adulting Shock / Life Happens"** RNG event simulator to train emergency resilience.

### 4. 🏆 Gamification, Badges & Audio Feedback
- Unlockable financial health achievement badges (*"Frugal Legend"*, *"Survivor"*, *"Demure Spender"*).
- Web Audio API zero-dependency sound effects for clicks, success chords, and panic sirens.
- 1-click **Panic Protocol** to instantly freeze recurring non-essential expenses.

### 5. 💾 Data Portability & Resilience
- Instant JSON / CSV export and backup recovery.
- Full offline state persistence via local storage.

---

## 🏛️ Architecture & Folder Structure

```text
src/
├── components/          # Reusable, accessible UI components
│   ├── ConsequenceBar.tsx   # Global live reactive status matrix
│   ├── Dashboard.tsx        # Responsive multi-column dashboard
│   ├── Goals.tsx            # Micro-savings targets with celebratory confetti
│   ├── Health.tsx           # Health audit & diagnostic breakdown
│   ├── PanicModal.tsx       # Emergency subscription freeze protocol
│   ├── Simulator.tsx        # Decision sandbox simulator
│   └── Transactions.tsx     # Expense/Income logger & CSV export
├── hooks/               # Custom React hooks for business logic
│   ├── useFinanceEngine.ts  # Derived calculation metrics
│   └── useSound.ts          # Zero-dependency Web Audio synthesizer
├── store/               # Centralized state management
│   └── index.tsx            # React Context + Reducer with local storage persistence
├── types.ts             # Strict TypeScript interfaces and domain models
└── utils/               # Sanitization, security, & formatting utilities
    ├── confetti.ts          # Zero-dependency particle celebration
    ├── finance.ts           # Core financial formulas
    ├── sanitize.ts          # XSS sanitization & input bounding
    └── sound.ts             # Web Audio API engine
```

---

## 🚀 Quick Setup & Local Development

```bash
npm install
npm run dev
npm run build
```
