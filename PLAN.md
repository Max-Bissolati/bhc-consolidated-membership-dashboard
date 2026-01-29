# BHC Membership Analytics - Revenue-Focused Updates

## Overview
This plan implements revenue-focused changes to prioritize financial metrics over volume metrics.

---

## 1. Pie Charts: Revenue-Based Distribution

### Current State
- `aggregateStats()` in `dataProcessing.ts` aggregates **member counts** for pie charts
- Lines 100-112 sum `month[cat]` (netSold counts)

### Target State
- Pie charts show **revenue distribution** instead of member counts
- Uses revenue fields: `revenue_U15`, `revenue_Student`, `revenue_Junior`, `revenue_Senior`, `revenue_Masters`

### Implementation - dataProcessing.ts

```typescript
// Change distribution logic to use revenue instead of counts
export const aggregateStats = (timeline: ConsolidatedMonth[]): {
  bhcDistribution: PeriodSummary;
  playLocalDistribution: PeriodSummary;
  totalRevenue: number;
  totalMembers: number;
  categoryRevenue: Record<MembershipCategory, number>; // NEW
} => {
  const bhcRevenue: Record<string, number> = {};
  const plRevenue: Record<string, number> = {};
  const categoryRevenue: Record<string, number> = {}; // Track per-category totals

  // ... existing totalRevenue/totalMembers calculation ...

  timeline.forEach(month => {
    const isBhc = month.date < '2025-03';
    
    // Map categories to their revenue fields
    const revenueMapping: Record<MembershipCategory, number> = {
      [MembershipCategory.U15]: month.revenue_U15,
      [MembershipCategory.Student]: month.revenue_Student,
      [MembershipCategory.Junior]: month.revenue_Junior,
      [MembershipCategory.Senior]: month.revenue_Senior,
      [MembershipCategory.Masters]: month.revenue_Masters,
    };

    Object.entries(revenueMapping).forEach(([cat, revenue]) => {
      if (revenue > 0) {
        // Aggregate for pie charts
        if (isBhc) {
          bhcRevenue[cat] = (bhcRevenue[cat] || 0) + revenue;
        } else {
          plRevenue[cat] = (plRevenue[cat] || 0) + revenue;
        }
        // Aggregate per-category totals
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + revenue;
      }
    });
  });

  return {
    bhcDistribution: {
      name: 'Legacy (BHC)',
      data: Object.entries(bhcRevenue).map(([name, value]) => ({ name, value })),
    },
    playLocalDistribution: {
      name: 'New (PlayLocal)',
      data: Object.entries(plRevenue).map(([name, value]) => ({ name, value })),
    },
    totalRevenue,
    totalMembers,
    categoryRevenue: categoryRevenue as Record<MembershipCategory, number>,
  };
};
```

---

## 2. Dynamic Net Revenue KPI Widget

### Current State
- Lines 167-181 in `App.tsx` show static `totalRevenue`
- No interaction with category filters

### Target State
- When **no categories highlighted**: Show total revenue with label "All Categories"
- When **categories highlighted**: Show sum of highlighted categories' revenue
- Dynamic label showing which category(ies) are selected

### Implementation - App.tsx

```typescript
// Calculate dynamic revenue based on highlighted categories
const displayRevenue = useMemo(() => {
  if (highlightedCategories.size === 0) {
    return { value: totalRevenue, label: 'All Categories' };
  }
  
  // Sum revenue for highlighted categories only
  const highlightedRevenue = Array.from(highlightedCategories).reduce((sum, cat) => {
    return sum + (categoryRevenue[cat] || 0);
  }, 0);
  
  // Build label from highlighted category names
  const categoryNames = Array.from(highlightedCategories)
    .map(cat => cat.replace(' Club Membership', ''))
    .join(', ');
  
  return { value: highlightedRevenue, label: categoryNames };
}, [highlightedCategories, categoryRevenue, totalRevenue]);

// Update KPI Card JSX
<div className="bg-white p-6 rounded-xl ...">
  <div>
    <p className="text-sm font-medium text-slate-500">Net Revenue</p>
    <h3 className="text-2xl font-bold text-slate-900 mt-1">
      {formatCurrency(displayRevenue.value)}
    </h3>
    <p className="text-xs text-green-600 mt-1 flex items-center bg-green-50 ...">
      <TrendingUp className="w-3 h-3 mr-1" />
      {displayRevenue.label}  {/* Dynamic label */}
    </p>
  </div>
  ...
</div>
```

---

## 3. Pie Chart Tooltip Update

### Current State
- `CustomTooltip` component shows values without currency formatting for pie charts

### Target State
- Pie chart tooltips show revenue values formatted as currency

### Implementation - CustomTooltip.tsx or App.tsx

Option 1: Pass `currency={true}` to pie chart tooltips:
```tsx
<Tooltip content={<CustomTooltip currency />} />
```

---

## 4. Files to Modify

| File | Changes |
|------|---------|
| `services/dataProcessing.ts` | Aggregate revenue for distributions, add `categoryRevenue` return |
| `App.tsx` | Add `displayRevenue` computed value, update KPI card JSX, add currency to pie tooltips |

---

## 5. Implementation Checklist

- [ ] **dataProcessing.ts**: Change `bhcTotals`/`plTotals` to aggregate revenue instead of counts
- [ ] **dataProcessing.ts**: Add `categoryRevenue` to return type and calculation
- [ ] **App.tsx**: Destructure `categoryRevenue` from `aggregateStats`
- [ ] **App.tsx**: Add `displayRevenue` useMemo hook
- [ ] **App.tsx**: Update Net Revenue KPI to use `displayRevenue.value` and `displayRevenue.label`
- [ ] **App.tsx**: Add `currency` prop to pie chart Tooltip components
- [ ] Push changes to GitHub

---

## Ready for Implementation

Architecture complete. Switch to **Code++** for implementation.
