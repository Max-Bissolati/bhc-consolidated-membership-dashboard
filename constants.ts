import { MembershipCategory } from './types';

// BHC Data (Files 1-5)
const RAW_BHC_U15 = `Date,Net,Net Sold
2024-10,2275.00,5
2024-11,2275.00,5
2024-12,385.00,1
2025-1,385.00,1
2025-2,385.00,1
2025-3,0.00,0
2025-4,0.00,0
2025-5,0.00,0
2025-6,0.00,0
2025-7,0.00,0
2025-8,0.00,0
2025-9,0.00,0
2025-10,0.00,0
2025-11,0.00,0
2025-12,0.00,0
2026-1,0.00,0`;

const RAW_BHC_STUDENT = `Date,Net,Net Sold
2024-10,2940.00,14
2024-11,2730.00,13
2024-12,0.00,0
2025-1,0.00,0
2025-2,0.00,0
2025-3,0.00,0
2025-4,0.00,0
2025-5,1470.00,1
2025-6,0.00,0
2025-7,0.00,0
2025-8,0.00,0
2025-9,0.00,0
2025-10,0.00,0
2025-11,0.00,0
2025-12,0.00,0
2026-1,0.00,0`;

const RAW_BHC_JUNIOR = `Date,Net,Net Sold
2024-10,330.00,1
2024-11,330.00,1
2024-12,0.00,0
2025-1,0.00,0
2025-2,0.00,0
2025-3,0.00,0
2025-4,0.00,0
2025-5,0.00,0
2025-6,0.00,0
2025-7,0.00,0
2025-8,0.00,0
2025-9,0.00,0
2025-10,0.00,0
2025-11,0.00,0
2025-12,0.00,0
2026-1,0.00,0`;

const RAW_BHC_SENIOR = `Date,Net,Net Sold
2024-10,6545.00,17
2024-11,6160.00,16
2024-12,770.00,2
2025-1,0.00,0
2025-2,0.00,0
2025-3,0.00,0
2025-4,0.00,0
2025-5,0.00,0
2025-6,0.00,0
2025-7,0.00,0
2025-8,0.00,0
2025-9,0.00,0
2025-10,0.00,0
2025-11,0.00,0
2025-12,0.00,0
2026-1,0.00,0`;

const RAW_BHC_MASTERS = `Date,Net,Net Sold
2024-10,6225.00,15
2024-11,5810.00,14
2024-12,830.00,2
2025-1,0.00,0
2025-2,800.00,1
2025-3,0.00,0
2025-4,0.00,0
2025-5,0.00,0
2025-6,0.00,0
2025-7,0.00,0
2025-8,0.00,0
2025-9,0.00,0
2025-10,0.00,0
2025-11,0.00,0
2025-12,0.00,0
2026-1,0.00,0`;

// PlayLocal Data (Files 6-10)
const RAW_PL_U15 = `Date,Net,Net Sold
2025-3,0.00,0
2025-4,0.00,0
2025-5,315.00,1
2025-6,119664.00,94
2025-7,6426.00,26
2025-8,6111.00,25
2025-9,5796.00,24
2025-10,5796.00,24
2025-11,5481.00,23
2025-12,2646.00,14
2026-1,0.00,0`;

const RAW_PL_STUDENT = `Date,Net,Net Sold
2025-3,0.00,0
2025-4,11015.00,8
2025-5,17695.00,16
2025-6,2970.00,7
2025-7,2970.00,7
2025-8,2970.00,7
2025-9,2970.00,7
2025-10,1870.00,5
2025-11,1320.00,4
2025-12,1320.00,4
2026-1,0.00,0`;

const RAW_PL_JUNIOR = `Date,Net,Net Sold
2025-3,0.00,0
2025-4,20371.00,10
2025-5,105662.00,81
2025-6,23580.00,42
2025-7,19931.00,38
2025-8,19532.00,37
2025-9,18232.00,35
2025-10,15484.00,30
2025-11,5985.00,15
2025-12,5187.00,13
2026-1,0.00,0`;

const RAW_PL_SENIOR = `Date,Net,Net Sold
2025-3,0.00,0
2025-4,3750.00,2
2025-5,125265.00,84
2025-6,16750.00,38
2025-7,16000.00,36
2025-8,14625.00,33
2025-9,14250.00,32
2025-10,11000.00,26
2025-11,7500.00,20
2025-12,7125.00,19
2026-1,0.00,0`;

const RAW_PL_MASTERS = `Date,Net,Net Sold
2025-3,0.00,0
2025-4,0.00,0
2025-5,700.00,2
2025-6,42372.00,33
2025-7,3795.00,13
2025-8,3795.00,13
2025-9,3795.00,13
2025-10,3795.00,13
2025-11,3047.00,10
2025-12,597.00,3
2026-1,0.00,0`;

// Mapping strategy array
export const RAW_DATA_MAPPING = [
  { csv: RAW_BHC_U15, category: MembershipCategory.U15, source: 'BHC' as const },
  { csv: RAW_BHC_STUDENT, category: MembershipCategory.Student, source: 'BHC' as const },
  { csv: RAW_BHC_JUNIOR, category: MembershipCategory.Junior, source: 'BHC' as const },
  { csv: RAW_BHC_SENIOR, category: MembershipCategory.Senior, source: 'BHC' as const },
  { csv: RAW_BHC_MASTERS, category: MembershipCategory.Masters, source: 'BHC' as const },
  { csv: RAW_PL_U15, category: MembershipCategory.U15, source: 'PlayLocal' as const },
  { csv: RAW_PL_STUDENT, category: MembershipCategory.Student, source: 'PlayLocal' as const },
  { csv: RAW_PL_JUNIOR, category: MembershipCategory.Junior, source: 'PlayLocal' as const },
  { csv: RAW_PL_SENIOR, category: MembershipCategory.Senior, source: 'PlayLocal' as const },
  { csv: RAW_PL_MASTERS, category: MembershipCategory.Masters, source: 'PlayLocal' as const },
];

// Original vibrant color palette
export const CATEGORY_COLORS: Record<MembershipCategory, string> = {
  [MembershipCategory.U15]: '#10b981', // Emerald 500
  [MembershipCategory.Student]: '#3b82f6', // Blue 500
  [MembershipCategory.Junior]: '#f59e0b', // Amber 500
  [MembershipCategory.Senior]: '#6366f1', // Indigo 500
  [MembershipCategory.Masters]: '#ef4444', // Red 500
};

// Highlight colors - Same colors for consistency
export const HIGHLIGHT_COLORS = CATEGORY_COLORS;