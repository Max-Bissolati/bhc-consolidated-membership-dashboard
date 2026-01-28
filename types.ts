export interface MonthlyData {
  date: string; // YYYY-MM
  netRevenue: number;
  netSold: number;
}

export enum MembershipCategory {
  U15 = 'U15 Club Membership',
  Student = 'Student Club Membership',
  Junior = 'Junior Club Membership',
  Senior = 'Senior Club Membership',
  Masters = 'Masters Club Membership',
}

export interface CategoryDataSet {
  category: MembershipCategory;
  source: 'BHC' | 'PlayLocal';
  data: MonthlyData[];
}

export interface ConsolidatedMonth {
  date: string;
  [MembershipCategory.U15]: number;
  [MembershipCategory.Student]: number;
  [MembershipCategory.Junior]: number;
  [MembershipCategory.Senior]: number;
  [MembershipCategory.Masters]: number;
  totalSold: number;
  // Revenue fields
  revenue_U15: number;
  revenue_Student: number;
  revenue_Junior: number;
  revenue_Senior: number;
  revenue_Masters: number;
  totalRevenue: number;
}

export interface PeriodSummary {
  name: string;
  data: { name: string; value: number }[];
}