export type CauseCategory =
  | 'All Causes'
  | 'Crisis Relief'
  | 'Clean Water'
  | 'Education'
  | 'Local Food'
  | 'Climate';

export type NavScreen = 'discover' | 'impact' | 'csr';
export type ViewMode = 'donor' | 'volunteer';

export interface AllocationItem {
  label: string;
  percentage: number;
}

export interface ContributorEntry {
  id: string;
  name: string;
  amount: number;
  matchedAmount: number;
  timestamp: string;
  note?: string;
}

export interface Campaign {
  id: string;
  title: string;
  organization: string;
  ein: string;
  category: Exclude<CauseCategory, 'All Causes'>;
  location: string;
  summary: string;
  impactUnitLabel: string;
  unitCost: number;
  raisedAmount: number;
  matchedAmount: number;
  goalAmount: number;
  matchMultiplier: 2 | 3;
  matchSponsor: string;
  matchPoolRemaining: number;
  daysLeft: number;
  urgent: boolean;
  verified: boolean;
  donorCount: number;
  allocation: AllocationItem[];
  recentContributors: ContributorEntry[];
}

export interface VolunteerShift {
  id: string;
  title: string;
  organization: string;
  category: Exclude<CauseCategory, 'All Causes'>;
  location: string;
  address: string;
  dateLabel: string;
  timeRange: string;
  durationHours: number;
  spotsFilled: number;
  spotsTotal: number;
  urgent: boolean;
  skillsNeeded: string;
  coordinatorName: string;
  registered: boolean;
  checkedIn?: boolean;
}

export interface DonationReceipt {
  id: string;
  receiptCode: string;
  date: string;
  campaignId: string;
  campaignTitle: string;
  organization: string;
  ein: string;
  category: Exclude<CauseCategory, 'All Causes'>;
  amount: number;
  matchedAmount: number;
  matchSponsor: string;
  status: 'Verified' | 'Match Pending';
  taxDeductible: boolean;
}

export interface DepartmentGiving {
  department: string;
  participants: number;
  totalDonors: number;
  employeeGiven: number;
  corporateMatched: number;
  volunteerHours: number;
}
