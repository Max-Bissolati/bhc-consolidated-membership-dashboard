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
} => {
  const bhcTotals: Record<string, number> = {};
  const plTotals: Record<string, number> = {};

  let totalRevenue = 0;
  let totalMembers = 0;

  timeline.forEach(month => {
    totalRevenue += month.totalRevenue;
    totalMembers += month.totalSold;

    // Distribution logic based on date
    // BHC Period: Dates < '2025-03'
    // PlayLocal Period: Dates >= '2025-03'
    const isBhc = month.date < '2025-03';
    
    // We need to iterate categories to sum them up for the period
    Object.values(MembershipCategory).forEach(cat => {
      // Use type assertion to access dynamic property safely
      const count = month[cat as keyof ConsolidatedMonth];
      
      // Ensure count is a number and greater than 0
      if (typeof count === 'number' && count > 0) {
        if (isBhc) {
          bhcTotals[cat] = (bhcTotals[cat] || 0) + count;
        } else {
          plTotals[cat] = (plTotals[cat] || 0) + count;
        }
      }
    });
  });

  const bhcDistribution: PeriodSummary = {
    name: 'Legacy (BHC)',
    data: Object.entries(bhcTotals).map(([name, value]) => ({ name, value })),
  };

  const playLocalDistribution: PeriodSummary = {
    name: 'New (PlayLocal)',
    data: Object.entries(plTotals).map(([name, value]) => ({ name, value })),
  };

  return {
    bhcDistribution,
    playLocalDistribution,
    totalRevenue,
    totalMembers
  };
};

export const getConsolidatedData = () => {
  const timeline = getRawTimeline();
  const stats = aggregateStats(timeline);
  return { timeline, ...stats };
};