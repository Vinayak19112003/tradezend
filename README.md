
# Anony Trading: The Modern Trading Journal

Anony Trading is a sophisticated, feature-rich trading journal built for professional traders who understand that success is forged through meticulous record-keeping and intelligent self-analysis. It provides a comprehensive suite of tools to log, review, and analyze trades, helping users identify winning patterns, refine strategies, and cultivate discipline.

Built with a focus on data-driven insights, psychological analysis, and a clean, intuitive user interface, Anony Trading transforms raw trade data into actionable intelligence.

## Core Features

### 1. Unified Dashboard
The main landing page provides a high-level overview of your trading performance with a summary banner, key performance indicators (KPIs), a monthly calendar view, and an equity curve chart.

### 2. Intelligent Journal
The central hub for all your individual trade records. It features a responsive trade list, a comprehensive form for detailed logging, and AI-powered import from broker statements (CSV, PDF, or even screenshots).

### 3. In-Depth Analytics
A dedicated space for a deep-dive analysis of your trading data. It includes core metrics, performance charts by day and session, and P&L/R-multiple distribution charts. It also features a "Trading Model" view to define and manage your personal trading checklists.

### 4. Advanced Performance Review
This page focuses on advanced risk and return metrics, including:
- **Psychology Analysis**: Mistake frequency charts and a comprehensive performance radar chart to visualize your skills and discipline.
- **Risk Analysis**: Drawdown analysis, risk-adjusted return metrics (Profit Factor, Expectancy), and risk distribution charts.
- **Time Analysis**: Performance breakdown by time of day, trade duration, and month-over-month.

### 5. Centralized Settings
Manage your user profile, trading accounts, custom strategies, and application preferences like theme (Light/Dark) and Streamer Mode to hide sensitive financial data.

## Generative AI Features

This application leverages **Google's Gemini model** via **Genkit** to provide intelligent assistance:

- **AI Trade Import (`/ai/flows/import-trades-flow.ts`)**: This AI flow understands and parses various file formats (CSV, PDF, images) to extract structured trade data, saving significant manual entry time. It intelligently maps fields and handles missing data.

## Tech Stack

- **Framework**: Next.js (with App Router)
- **Language**: TypeScript
- **UI Components**: ShadCN UI & Framer Motion
- **Styling**: Tailwind CSS
- **Database & Auth**: Firebase (Firestore, Firebase Auth, Storage)
- **Generative AI**: Genkit (with Google's Gemini models)
- **Charts**: Recharts
- **Deployment**: Firebase App Hosting

## Getting Started

To run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Firebase:**
    - Create a Firebase project at [firebase.google.com](https://firebase.google.com/).
    - Enable Firestore, Firebase Authentication (with Email/Password), and Cloud Storage.
    - Copy your Firebase project configuration into `src/lib/firebase.ts`.

4.  **Set up Environment Variables:**
    - Create a `.env` file in the root of the project.
    - Add your Gemini API Key for the AI features:
      ```
      GEMINI_API_KEY=your_api_key_here
      ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.
