
# Anony Trading - A Modern Journal for Professionals

![Anony Trading Dashboard](https://firebasestorage.googleapis.com/v0/b/tradevision-journal-pss69.appspot.com/o/readme%2Fanony-trading-screenshot.png?alt=media&token=8679f2ba-20a2-474c-8f4f-6962f3f7ca2b)

## Overview

Anony Trading is a sophisticated and modern trading journal designed for professionals who want to elevate their performance through detailed record-keeping and intelligent analysis. It provides a comprehensive suite of tools to log, review, and analyze trades, helping users identify patterns, refine strategies, and maintain discipline.

The journal is built with a focus on data-driven insights, psychological analysis, and a clean, intuitive user interface.

---

## Core Features

The application is organized into a primary tab-based interface for a seamless workflow.

### 1. Dashboard Tab
The main landing page, providing a high-level, at-a-glance overview of your trading performance.
- **Summary Banner**: Displays progress towards monthly profit/loss targets and highlights the most common mistake for the current month.
- **Key Performance Indicators (KPIs)**: A series of cards showing vital statistics like Total PNL, Win Rate, and Net R for the selected time period.
- **Monthly Calendar**: A visual, color-coded calendar showing daily profitability, allowing for quick identification of winning and losing days.
- **Equity Curve**: A chart that visualizes your cumulative R-value over time, showing the growth of your account.

### 2. Journal Tab
The central hub for all your individual trade records.
- **Responsive Trade List**: Displays all trades in a clean, organized table on desktops and an intuitive card view on mobile devices.
- **Add/Edit Trades**: A comprehensive modal form allows for detailed logging, including entry/exit prices, strategy, psychological state, and screenshots.
- **AI-Powered Import**: Users can upload a CSV, PDF, or even a screenshot of their broker statement, and the AI will automatically parse and import the trades, skipping any duplicates based on the Ticket/Order ID.
- **Export & Clear**: Functionality to export all trades to CSV/PDF or clear the entire log for a selected account.

### 3. Analytics Tab
A dedicated page for a deep-dive analysis of your trading data.
- **Core Metrics**: Cards displaying detailed statistics like largest win/loss, average win/loss, and most/least profitable day of the week.
- **Performance by Day/Session**: Bar charts visualizing profitability across different days of the week and trading sessions (London, New York, Asian).
- **P&L and R-Multiple Distribution**: Butterfly and Bar charts showing the frequency and magnitude of different profit/loss and R-multiple outcomes.
- **Trading Model View**: A sub-tab where you can define and manage your personal trading model checklists for various phases of your trading plan (e.g., Weekly Prep, Daily Prep, Execution).

### 4. Performance Tab
A page focused on advanced risk and return metrics, broken down into sub-sections.
- **Psychology Analysis**: Features a Mistake Frequency chart and a comprehensive Performance Radar Chart to provide a holistic view of your trading skills and discipline.
- **Risk Analysis**: Includes a Drawdown Analysis chart to visualize your equity curve against its peak, cards for key Risk-Adjusted Returns (Profit Factor, Expectancy), and a Risk Distribution chart analyzing profitability based on risk per trade.
- **Time Analysis**: Provides stat cards for your most profitable time, day, duration, and session, along with charts analyzing performance by time of day, trade duration, and month-over-month.

### 5. Settings Page
A centralized hub for managing your account and application preferences.
- **User Profile**: Displays user email and provides a logout option.
- **Account Management**: Add, edit, or remove different trading accounts.
- **Preferences**: Customize the app theme (Light/Dark), currency format (USD/INR), and toggle Streamer Mode to hide sensitive financial data.
- **Security**: Allows users to request a password reset link.

---

## AI-Powered Features

This application leverages Generative AI (via Google's Gemini model and Genkit) to provide intelligent assistance.

- **AI Trade Import (`/ai/flows/import-trades-flow.ts`)**: This AI flow can understand and parse various file formats (CSV, PDF, images) to extract structured trade data, saving significant manual entry time. It intelligently maps fields and handles missing data.

- **AI Pattern Detection (`/ai/flows/pattern-detection.ts`)**: This flow acts as a trading psychologist, analyzing journal notes and psychological data to identify behavioral patterns, emotional correlations, and actionable insights to improve performance.

---

## Technology Stack

- **Framework**: Next.js (with App Router)
- **Language**: TypeScript
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS
- **Database & Auth**: Firebase (Firestore, Firebase Auth, Storage)
- **Generative AI**: Genkit (with Google's Gemini models)
- **Charts**: Recharts
- **Deployment**: Firebase App Hosting
