import { CategoryDataSet, ConsolidatedMonth, MembershipCategory, MonthlyData, PeriodSummary } from '../types';
import { RAW_DATA_MAPPING } from '../constants';

const parseCSV = (csv: string): MonthlyData[] => {
  // Handle both CRLF and LF line endings
  const lines = csv.trim().split(/\r?\n/);
  // Skip header (index 0)
  return lines.slice(1).map(line => {
    const [date, net, netSold] = line.split(',');
    if (!date) return null; // Safety check for empty lines

    const [year, month] = date.split('-');
    // Ensure month is 2 digits for consistent ISO date strings
    const paddedMonth = month.length === 1 ? `0${month}` : month;
    const normalizedDate = `${year}-${paddedMonth}`;

    return {
      date: normalizedDate,
      netRevenue: parseFloat(net),
      netSold: parseInt(netSold, 10),
    };
  }).filter((item): item is MonthlyData => item !== null);
};

export const getRawTimeline = (): ConsolidatedMonth[] => {
  // 1. Parse all Raw Data
  const allDataSets: CategoryDataSet[] = RAW_DATA_MAPPING.map(item => ({
    category: item.category,
    source: item.source,
    data: parseCSV(item.csv),
  }));

  // 2. Collect unique dates to build the timeline
  const uniqueDates = new Set<string>();
  allDataSets.forEach(ds => ds.data.forEach(d => uniqueDates.add(d.date)));
  const sortedDates = Array.from(uniqueDates).sort();

  // 3. Build Timeline Data (Consolidated)
  return sortedDates.map(date => {
    const monthRecord: ConsolidatedMonth = {
      date,
      [MembershipCategory.U15]: 0,
      [MembershipCategory.Student]: 0,
      [MembershipCategory.Junior]: 0,
      [MembershipCategory.Senior]: 0,
      [MembershipCategory.Masters]: 0,
      totalSold: 0,
      revenue_U15: 0,
      revenue_Student: 0,
      revenue_Junior: 0,
      revenue_Senior: 0,
      revenue_Masters: 0,
      totalRevenue: 0,
    };

    allDataSets.forEach(ds => {
      const match = ds.data.find(d => d.date === date);
      if (match) {
        // Add to counts
        monthRecord[ds.category] += match.netSold;
        monthRecord.totalSold += match.netSold;
        
        // Add to revenue
        if(ds.category === MembershipCategory.U15) monthRecord.revenue_U15 += match.netRevenue;
        if(ds.category === MembershipCategory.Student) monthRecord.revenue_Student += match.netRevenue;
        if(ds.category === MembershipCategory.Junior) monthRecord.revenue_Junior += match.netRevenue;
        if(ds.category === MembershipCategory.Senior) monthRecord.revenue_Senior += match.netRevenue;
        if(ds.category === MembershipCategory.Masters) monthRecord.revenue_Masters += match.netRevenue;

        monthRecord.totalRevenue += match.netRevenue;
      }
    });

    return monthRecord;
  });
};

export const aggregateStats = (timeline: ConsolidatedMonth[]): {
  bhcDistribution: PeriodSummary;
  playLocalDistribution: PeriodSummary;
  totalRevenue: number;
  totalMembers: number;
  categoryRevenue: Record<MembershipCategory, number>;
} => {
  const bhcRevenue: Record<string, number> = {};
  const plRevenue: Record<string, number> = {};
  const categoryRevenue: Record<string, number> = {
    [MembershipCategory.U15]: 0,
    [MembershipCategory.Student]: 0,
    [MembershipCategory.Junior]: 0,
    [MembershipCategory.Senior]: 0,
    [MembershipCategory.Masters]: 0,
  };

  let totalRevenue = 0;
  let totalMembers = 0;

  timeline.forEach(month => {
    totalRevenue += month.totalRevenue;
    totalMembers += month.totalSold;

    const isBhc = month.date < '2025-03';
    
    // Revenue mapping for current month
    const monthRevenue: Record<MembershipCategory, number> = {
      [MembershipCategory.U15]: month.revenue_U15,
      [MembershipCategory.Student]: month.revenue_Student,
      [MembershipCategory.Junior]: month.revenue_Junior,
      [MembershipCategory.Senior]: month.revenue_Senior,
      [MembershipCategory.Masters]: month.revenue_Masters,
    };

    Object.entries(monthRevenue).forEach(([cat, revenue]) => {
      if (revenue > 0) {
        // Aggregate for pie charts (By Period)
        if (isBhc) {
          bhcRevenue[cat] = (bhcRevenue[cat] || 0) + revenue;
        } else {
          plRevenue[cat] = (plRevenue[cat] || 0) + revenue;
        }
        // Aggregate total revenue per category (For dynamic KPI)
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + revenue;
      }
    });
  });

  const bhcDistribution: PeriodSummary = {
    name: 'Legacy (BHC)',
    data: Object.entries(bhcRevenue).map(([name, value]) => ({ name, value })),
  };

  const playLocalDistribution: PeriodSummary = {
    name: 'New (PlayLocal)',
    data: Object.entries(plRevenue).map(([name, value]) => ({ name, value })),
  };

  return {
    bhcDistribution,
    playLocalDistribution,
    totalRevenue,
    totalMembers,
    categoryRevenue: categoryRevenue as Record<MembershipCategory, number>
  };
};

export const getConsolidatedData = () => {
  const timeline = getRawTimeline();
  const stats = aggregateStats(timeline);
  return { timeline, ...stats };
};