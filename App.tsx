import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, TrendingUp, Users, Wallet, PieChart as PieIcon, Filter, Check, Calendar } from 'lucide-react';
import { getRawTimeline, aggregateStats } from './services/dataProcessing';
import { GRAYSCALE_COLORS, HIGHLIGHT_COLORS } from './constants';
import { MembershipCategory } from './types';
import { CustomTooltip } from './components/CustomTooltip';

const App: React.FC = () => {
  // --- State Management ---
  const [startDate, setStartDate] = useState('2024-10');
  const [endDate, setEndDate] = useState('2026-01');
  const [highlightedCategories, setHighlightedCategories] = useState<Set<MembershipCategory>>(new Set());

  // --- Data Processing ---
  const rawTimeline = useMemo(() => getRawTimeline(), []);

  // Filter timeline based on date range
  const filteredTimeline = useMemo(() => {
    return rawTimeline.filter(item => item.date >= startDate && item.date <= endDate);
  }, [rawTimeline, startDate, endDate]);

  // Recalculate stats based on filtered data
  const { bhcDistribution, playLocalDistribution, totalRevenue, totalMembers } = useMemo(
    () => aggregateStats(filteredTimeline),
    [filteredTimeline]
  );

  // --- Formatting Helpers ---
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(value);

  const formatCurrencyAxis = (value: number) => 
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', notation: 'compact' }).format(value);

  // --- Interaction Handlers ---
  const toggleCategory = (category: MembershipCategory) => {
    const newSet = new Set(highlightedCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setHighlightedCategories(newSet);
  };

  // Helper to determine visual styles based on highlight state
  const getOpacity = (category: MembershipCategory) => {
    if (highlightedCategories.size === 0) return 1;
    return highlightedCategories.has(category) ? 1 : 0.2;
  };

  const getStrokeWidth = (category: MembershipCategory) => {
    if (highlightedCategories.size === 0) return 3;
    return highlightedCategories.has(category) ? 4 : 1;
  };

  const getColor = (category: MembershipCategory): string => {
    if (highlightedCategories.size === 0) {
      return GRAYSCALE_COLORS[category];
    }
    return highlightedCategories.has(category)
      ? HIGHLIGHT_COLORS[category]
      : GRAYSCALE_COLORS[category];
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">BHC Membership Analytics</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600">
            <Calendar className="w-3.5 h-3.5" />
            <span>Fiscal Period: 2024-2026</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Date Range Filter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <Filter className="w-4 h-4" />
                <span>Filters:</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                <input 
                  type="month" 
                  value={startDate} 
                  min="2024-10" 
                  max="2026-01"
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent border-none text-sm text-slate-700 focus:ring-0 px-2 py-1 outline-none"
                />
                <span className="text-slate-400 text-xs">to</span>
                <input 
                  type="month" 
                  value={endDate}
                  min="2024-10" 
                  max="2026-01" 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent border-none text-sm text-slate-700 focus:ring-0 px-2 py-1 outline-none"
                />
              </div>
            </div>

            {/* Category Highlights */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-slate-500 font-medium mr-1 self-center">Highlight:</span>
              {Object.values(MembershipCategory).map((cat) => {
                const isActive = highlightedCategories.has(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border
                      ${isActive 
                        ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }
                    `}
                  >
                    <span 
                      className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : ''}`} 
                      style={{ backgroundColor: getColor(cat) }}
                    />
                    {cat.replace(' Club Membership', '')}
                    {isActive && <Check className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
              {highlightedCategories.size > 0 && (
                <button 
                  onClick={() => setHighlightedCategories(new Set())}
                  className="text-xs text-slate-400 underline hover:text-slate-600 ml-2"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between group hover:border-indigo-100 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500">Net Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {formatCurrency(totalRevenue)}
              </h3>
              <p className="text-xs text-green-600 mt-1 flex items-center bg-green-50 w-fit px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" />
                Selected Period
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg group-hover:bg-indigo-50 transition-colors">
              <Wallet className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between group hover:border-indigo-100 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500">Memberships Sold</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {totalMembers}
              </h3>
              <p className="text-xs text-indigo-600 mt-1 flex items-center bg-indigo-50 w-fit px-2 py-0.5 rounded-full">
                <Users className="w-3 h-3 mr-1" />
                Volume
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg group-hover:bg-indigo-50 transition-colors">
              <Users className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between group hover:border-amber-100 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500">Data Scope</p>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{startDate} <span className="text-slate-400 mx-1">→</span> {endDate}</h3>
              <p className="text-xs text-slate-400 mt-2">Inclusive Range</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg group-hover:bg-amber-50 transition-colors">
              <Filter className="w-6 h-6 text-slate-600 group-hover:text-amber-600" />
            </div>
          </div>
        </div>

        {/* Chart Section 1: Line Chart - Revenue Comparison (Prioritized to Top) */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Revenue Trend Analysis</h2>
            <p className="text-sm text-slate-500">Financial performance over time (ZAR)</p>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredTimeline}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tickFormatter={formatCurrencyAxis}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip currency />} />
                <Legend iconType="plainline" wrapperStyle={{ paddingTop: '20px' }} />
                
                <Line
                  type="monotone"
                  dataKey="revenue_U15"
                  name="U15 Revenue"
                  stroke={getColor(MembershipCategory.U15)}
                  strokeWidth={getStrokeWidth(MembershipCategory.U15)}
                  strokeOpacity={getOpacity(MembershipCategory.U15)}
                  dot={{ r: 4, fill: getColor(MembershipCategory.U15), strokeWidth: 0, fillOpacity: getOpacity(MembershipCategory.U15) }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue_Senior"
                  name="Senior Revenue"
                  stroke={getColor(MembershipCategory.Senior)}
                  strokeWidth={getStrokeWidth(MembershipCategory.Senior)}
                  strokeOpacity={getOpacity(MembershipCategory.Senior)}
                  dot={{ r: 4, fill: getColor(MembershipCategory.Senior), strokeWidth: 0, fillOpacity: getOpacity(MembershipCategory.Senior) }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue_Student"
                  name="Student Revenue"
                  stroke={getColor(MembershipCategory.Student)}
                  strokeWidth={getStrokeWidth(MembershipCategory.Student)}
                  strokeOpacity={getOpacity(MembershipCategory.Student)}
                  dot={{ r: 4, fill: getColor(MembershipCategory.Student), strokeWidth: 0, fillOpacity: getOpacity(MembershipCategory.Student) }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue_Junior"
                  name="Junior Revenue"
                  stroke={getColor(MembershipCategory.Junior)}
                  strokeWidth={getStrokeWidth(MembershipCategory.Junior)}
                  strokeOpacity={getOpacity(MembershipCategory.Junior)}
                  dot={{ r: 4, fill: getColor(MembershipCategory.Junior), strokeWidth: 0, fillOpacity: getOpacity(MembershipCategory.Junior) }}
                  activeDot={{ r: 6 }}
                />
                 <Line
                  type="monotone"
                  dataKey="revenue_Masters"
                  name="Masters Revenue"
                  stroke={getColor(MembershipCategory.Masters)}
                  strokeWidth={getStrokeWidth(MembershipCategory.Masters)}
                  strokeOpacity={getOpacity(MembershipCategory.Masters)}
                  dot={{ r: 4, fill: getColor(MembershipCategory.Masters), strokeWidth: 0, fillOpacity: getOpacity(MembershipCategory.Masters) }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Chart Section 2: Stacked Bar - Total Volume */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Monthly Membership Sales Volume</h2>
              <p className="text-sm text-slate-500">Total units sold per month by category</p>
            </div>
            {/* Simple Legend for Quick Reference */}
            <div className="hidden sm:flex gap-4 text-xs">
               <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getColor(MembershipCategory.U15) }}></span> U15</div>
               <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getColor(MembershipCategory.Senior) }}></span> Senior</div>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredTimeline}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                
                {Object.values(MembershipCategory).map((cat) => (
                  <Bar
                    key={cat}
                    dataKey={cat}
                    stackId="a"
                    fill={getColor(cat)}
                    name={cat.replace(' Club Membership', '')}
                    fillOpacity={getOpacity(cat)}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Chart Section 3: Distribution Pie Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Legacy BHC */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-900">Legacy Mix (BHC)</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6 uppercase tracking-wider font-semibold border-b border-slate-100 pb-2">
              Oct '24 – Feb '25 (Filtered)
            </p>
            <div className="h-[300px] w-full">
              {bhcDistribution.data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bhcDistribution.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {bhcDistribution.data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={getColor(entry.name as MembershipCategory)}
                          fillOpacity={getOpacity(entry.name as MembershipCategory)}
                          strokeWidth={0}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                 <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                   No BHC data in selected range
                 </div>
              )}
            </div>
          </div>

          {/* New PlayLocal */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
             <div className="flex items-center gap-2 mb-4">
              <PieIcon className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-900">New Mix (PlayLocal)</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6 uppercase tracking-wider font-semibold border-b border-slate-100 pb-2">
              Mar '25 – Jan '26 (Filtered)
            </p>
            <div className="h-[300px] w-full">
               {playLocalDistribution.data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={playLocalDistribution.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {playLocalDistribution.data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={getColor(entry.name as MembershipCategory)}
                          fillOpacity={getOpacity(entry.name as MembershipCategory)}
                          strokeWidth={0}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
               ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                   No PlayLocal data in selected range
                 </div>
               )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default App;