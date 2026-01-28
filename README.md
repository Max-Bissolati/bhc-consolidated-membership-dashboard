# BHC Membership Analytics Dashboard

A modern analytics dashboard for visualizing BHC (Bellville Hockey Club) membership sales data across multiple categories and time periods.

## Features

- **Revenue Analysis**: Trend visualization of membership revenue over time
- **Sales Volume Tracking**: Stacked bar charts showing monthly membership sales
- **Distribution Insights**: Pie charts comparing Legacy (BHC) vs New (PlayLocal) membership mix
- **Interactive Filtering**: Date range selection and category highlighting
- **Modern Design**: Monochromatic grayscale theme with color-on-highlight interaction

## Membership Categories

- U15 Club Membership
- Student Club Membership
- Junior Club Membership
- Senior Club Membership
- Masters Club Membership

## Data Sources

- **Legacy (BHC)**: Oct 2024 – Feb 2025
- **New (PlayLocal)**: Mar 2025 – Jan 2026

## Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Recharts** - Chart Library
- **Tailwind CSS** - Styling
- **Vite** - Build Tool
- **Lucide React** - Icons

## Getting Started

### Prerequisites
- Node.js (v18+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/bhc-membership-analytics.git
   cd bhc-membership-analytics
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
├── App.tsx                    # Main application component
├── constants.ts               # Color palettes and raw data
├── types.ts                   # TypeScript interfaces and enums
├── index.html                 # HTML entry point
├── index.tsx                  # React entry point
├── components/
│   └── CustomTooltip.tsx      # Reusable tooltip component
├── services/
│   └── dataProcessing.ts      # Data transformation utilities
└── package.json               # Dependencies and scripts
```

## Deployment

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## License

Private - Bellville Hockey Club
