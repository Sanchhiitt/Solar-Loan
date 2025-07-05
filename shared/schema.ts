// Shared schema types for Solar Loan Fit Checker

export interface SolarFormData {
  zipCode: string;
  electricBill: number;
  creditBand: string;
  roofSize: string;
}

export interface SolarResults {
  status: 'approved' | 'borderline' | 'not_qualified';
  monthlyPayment: string;
  paybackYears: number;
  systemSizeKW: string;
  totalSavings: string;
  explanation: string;
  creditBand: string;
  currentBill: number;
  systemCost?: {
    gross_cost: number;
    federal_credit: number;
    state_credit: number;
    net_cost: number;
  };
  loanTerms?: {
    apr: number;
    term: number;
    downPayment: number;
  };
}

export interface ApiError {
  error: string;
}

export type CreditBand = 'Excellent' | 'Good' | 'Fair' | 'Building';
export type RoofSize = 'Small' | 'Medium' | 'Large';
export type QualificationStatus = 'approved' | 'borderline' | 'not_qualified';
