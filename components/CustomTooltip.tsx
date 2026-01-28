import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  currency?: boolean;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, currency = false }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 border border-slate-200 shadow-xl rounded-lg text-sm z-50">
        {label && <p className="font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1">{label}</p>}
        {payload.map((entry: any, index: number) => {
          // Attempt to extract percent from Recharts payload if available (Pie Chart)
          const percent = entry.payload.percent;
          
          return (
            <div key={index} className="flex items-center gap-3 mb-1 last:mb-0">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-600 font-medium">
                {entry.name}:
              </span>
              <div className="ml-auto flex items-center gap-2">
                <span className="font-bold text-slate-900">
                  {currency 
                    ? new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(entry.value)
                    : entry.value
                  }
                </span>
                {percent !== undefined && (
                  <span className="text-xs text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                    {(percent * 100).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};