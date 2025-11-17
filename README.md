# TradeZend - Professional Trading Journal

A sophisticated, feature-rich trading journal built for professional traders. TradeZend helps you log, review, and analyze trades to identify winning patterns, refine strategies, and cultivate discipline through data-driven insights.

## 🎯 Overview

TradeZend is a comprehensive SaaS application designed for professional and serious amateur traders who want to improve their performance through meticulous record-keeping and advanced analytics.

### Key Features

- 📊 **Advanced Analytics** - Comprehensive performance metrics, charts, and insights
- 🤖 **AI-Powered Import** - Import trades from CSV, PDF, or screenshots using Google AI
- 📈 **Real-time Dashboard** - Live performance tracking with equity curves and calendars
- 🎨 **Beautiful UI** - Modern, responsive design with dark mode support
- 🔐 **Secure** - Firebase Authentication with granular Firestore security rules
- 📱 **Multi-Account** - Manage multiple trading accounts seamlessly
- 🎯 **Strategy Tracking** - Monitor performance across different trading strategies
- 💼 **Psychology Analysis** - Track emotional states and rule adherence

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account
- Google AI API key (for trade import feature)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vinayak19112003/tradezend.git
   cd tradezend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Firebase and Google AI credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GOOGLE_API_KEY=your_google_ai_key
   ```

4. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Firebase Storage
   - Deploy the security rules:
     ```bash
     firebase deploy --only firestore:rules
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4, Shadcn UI
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Google Gemini 2.0 Flash via Genkit
- **State Management**: React Context API
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React

## 📁 Project Structure

```
tradezend/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/          # Base UI components
│   │   ├── dashboard/   # Dashboard components
│   │   ├── analytics/   # Analytics components
│   │   └── ...
│   ├── contexts/        # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and configuration
│   └── ai/              # AI/Genkit flows
├── docs/                # Documentation
└── public/              # Static assets
```

## 🔒 Security

- Firebase Authentication for user management
- Granular Firestore security rules
- Client-side input validation with Zod
- Secure file uploads to Firebase Storage
- Environment variables for sensitive data
- No critical secrets in client-side code

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run genkit:dev   # Start Genkit dev server
```

### Code Quality

This project follows best practices:
- TypeScript for type safety
- ESLint for code quality
- Strict Firestore security rules
- Comprehensive JSDoc documentation
- Error boundaries for graceful error handling
- Accessibility-first component design

## 📊 Features in Detail

### Dashboard
- Real-time performance metrics
- Equity curve visualization
- Monthly calendar view
- Win rate and profit factor
- Directional analysis (Buy/Sell)

### Analytics
- Session-based analysis (London, NY, Asian)
- R-multiple distribution
- Drawdown and streak analysis
- Strategy performance comparison
- Mistake frequency tracking

### Trade Journal
- Comprehensive trade logging
- Screenshot uploads
- Trading model checklist
- Emotional state tracking
- Advanced filtering and sorting
- Bulk import/export

### AI Import
- Parse CSV files
- Extract from broker PDFs
- Analyze trade screenshots
- Intelligent field mapping
- Risk/Reward calculation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- AI powered by [Google Gemini](https://ai.google.dev/)
- Backend by [Firebase](https://firebase.google.com/)

---

**Note**: For detailed architectural information, see [docs/blueprint.md](docs/blueprint.md)
