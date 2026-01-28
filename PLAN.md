# BHC Membership Analytics - Implementation Plan

## Overview
This plan outlines the architectural changes required to update the Membership Sales Dashboard with:
1. Revenue chart prioritized to the top
2. Modern monochromatic grayscale design with color-on-highlight behavior
3. Naming alignment with "BHC Membership Analytics"
4. Updated README documentation

---

## 1. Chart Reordering - Revenue First

### Current Order (App.tsx)
```
main
├── KPI Cards (lines 161-205)
├── Monthly Membership Sales Volume - BarChart (lines 207-257)  ← 1st chart
├── Revenue Trend Analysis - LineChart (lines 259-344)          ← 2nd chart
└── Distribution Pie Charts (lines 346-433)
```

### Target Order
```
main
├── KPI Cards (unchanged)
├── Revenue Trend Analysis - LineChart                          ← MOVE TO TOP
├── Monthly Membership Sales Volume - BarChart                  ← Move down
└── Distribution Pie Charts (unchanged)
```

### Implementation
**File:** `App.tsx`
- Cut lines 259-344 (Revenue Trend Analysis section)
- Paste immediately after line 205 (after KPI cards, before BarChart)

---

## 2. Modern Monochromatic Design System

### 2.1 New Color Palettes (constants.ts)

Replace `CATEGORY_COLORS` with a dual-palette system:

```typescript
// Default grayscale palette - Modern monochromatic design
export const GRAYSCALE_COLORS: Record<MembershipCategory, string> = {
  [MembershipCategory.U15]: '#9ca3af',     // Gray 400
  [MembershipCategory.Student]: '#6b7280', // Gray 500
  [MembershipCategory.Junior]: '#4b5563',  // Gray 600
  [MembershipCategory.Senior]: '#374151',  // Gray 700
  [MembershipCategory.Masters]: '#1f2937', // Gray 800
};

// Highlight colors - Vibrant palette only shown when highlighted
export const HIGHLIGHT_COLORS: Record<MembershipCategory, string> = {
  [MembershipCategory.U15]: '#10b981',     // Emerald 500
  [MembershipCategory.Student]: '#3b82f6', // Blue 500
  [MembershipCategory.Junior]: '#f59e0b',  // Amber 500
  [MembershipCategory.Senior]: '#6366f1',  // Indigo 500
  [MembershipCategory.Masters]: '#ef4444', // Red 500
};

// Legacy export for backwards compatibility (remove after migration)
export const CATEGORY_COLORS = GRAYSCALE_COLORS;
```

### 2.2 Dynamic Color Logic (App.tsx)

Update the color getter function to return grayscale by default, colors only on highlight:

```typescript
// Import both palettes
import { GRAYSCALE_COLORS, HIGHLIGHT_COLORS } from './constants';

// New dynamic color getter - grayscale default, color on highlight
const getColor = (category: MembershipCategory): string => {
  if (highlightedCategories.size === 0) {
    return GRAYSCALE_COLORS[category]; // Default: grayscale
  }
  return highlightedCategories.has(category)
    ? HIGHLIGHT_COLORS[category]  // Highlighted: vibrant color
    : GRAYSCALE_COLORS[category]; // Not highlighted: stays grayscale
};
```

### 2.3 Chart Updates Required

Replace all `CATEGORY_COLORS[cat]` references with `getColor(cat)`:

| Component | Location | Change |
|-----------|----------|--------|
| BarChart | `Bar.fill` | `fill={getColor(cat)}` |
| LineChart | `Line.stroke` | `stroke={getColor(category)}` |
| LineChart | `Line.dot.fill` | `fill: getColor(category)` |
| PieChart | `Cell.fill` | `fill={getColor(entry.name)}` |
| Filter buttons | Legend dot color | `backgroundColor: getColor(cat)` |
| Section legends | Quick reference dots | Use CSS or dynamic color |

### 2.4 Filter Button Color Updates (App.tsx lines 126-144)

Update the highlight filter buttons to also use dynamic colors:

```typescript
<span 
  className={`w-2 h-2 rounded-full ${isActive ? '' : ''}`} 
  style={{ 
    backgroundColor: isActive 
      ? HIGHLIGHT_COLORS[cat]  // Show vibrant color when active
      : GRAYSCALE_COLORS[cat]  // Grayscale when inactive
  }} 
/>
```

---

## 3. Naming Alignment - "BHC Membership Analytics"

### 3.1 Files to Update

| File | Location | Current | New |
|------|----------|---------|-----|
| `index.html` | Line 6 `<title>` | "Membership Sales Dashboard" | "BHC Membership Analytics" |
| `App.tsx` | Line 81 `<h1>` | "Membership Analytics" | "BHC Membership Analytics" |
| `package.json` | Line 2 `name` | "membership-sales-analyst-dashboard" | "bhc-membership-analytics" |

---

## 4. README.md Update

Replace the current AI Studio template with proper project documentation:

```markdown
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
```

---

## 5. Implementation Checklist

- [ ] **constants.ts**: Add `GRAYSCALE_COLORS` and `HIGHLIGHT_COLORS` palettes
- [ ] **App.tsx**: Add `getColor()` helper function
- [ ] **App.tsx**: Update BarChart to use `getColor(cat)`
- [ ] **App.tsx**: Update LineChart to use `getColor(category)`
- [ ] **App.tsx**: Update PieChart cells to use `getColor(entry.name)`
- [ ] **App.tsx**: Update filter button styling to use dynamic colors
- [ ] **App.tsx**: Move Revenue LineChart section above BarChart section
- [ ] **App.tsx**: Update header to "BHC Membership Analytics"
- [ ] **App.tsx**: Update section legend dots to use grayscale by default
- [ ] **index.html**: Update title to "BHC Membership Analytics"
- [ ] **package.json**: Update name to "bhc-membership-analytics"
- [ ] **README.md**: Replace with project documentation

---

## 6. Visual Design Reference

### Default State (No Highlight)
- All chart elements render in **grayscale** (gray-400 to gray-800)
- Creates a sophisticated, modern monochromatic look
- Reduces visual noise, improves data focus

### Highlighted State
- Selected categories pop with **vibrant accent colors**
- Non-selected categories remain grayscale
- Creates clear visual hierarchy and contrast

### Color Mapping

| Category | Grayscale (Default) | Highlight Color |
|----------|---------------------|-----------------|
| U15 | `#9ca3af` (Gray 400) | `#10b981` (Emerald) |
| Student | `#6b7280` (Gray 500) | `#3b82f6` (Blue) |
| Junior | `#4b5563` (Gray 600) | `#f59e0b` (Amber) |
| Senior | `#374151` (Gray 700) | `#6366f1` (Indigo) |
| Masters | `#1f2937` (Gray 800) | `#ef4444` (Red) |

---

## Ready for Implementation

This plan is ready for **Code++ (Gemini 3 Pro)** to execute. All changes are clearly defined with specific file locations and code snippets.
