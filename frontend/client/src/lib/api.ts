// API service for communicating with the Python backend

export interface QualificationRequest {
  zipCode: string;
  billRange: string;
  creditScore: string;
  roofSize: string;
}

export interface QualificationResult {
  status: 'approved' | 'not_qualified' | 'borderline';
  system_size_kw?: number;
  lifetime_savings?: number;
  total_cost?: number;
  net_cost_after_incentives?: number;
  explanation?: string;
  location?: {
    city: string;
    state: string;
    zip_code: string;
  };
  loan_terms?: {
    apr: number;
    term_years: number;
    down_payment_percent: number;
  };
  calculations?: {
    monthly_kwh_usage: number;
    system_annual_production: number;
  };
  error?: string;
}

export interface ZipCodeData {
  zip_code: string;
  city: string;
  state: string;
  data_source: string;
  average_monthly_bill?: number;
  average_monthly_usage_kwh?: number;
  utility_rate_per_kwh?: number;
  period?: string;
}

export interface VantageScoreData {
  zip_code: string;
  vantage_score: number;
  source: string;
  endpoint_used?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    // In development, proxy to backend through frontend server
    // In production, this would be the actual backend URL
    this.baseUrl = '/api';
  }

  async checkQualification(data: QualificationRequest): Promise<QualificationResult> {
    try {
      // Convert form data to backend expected format
      const requestData = {
        zipCode: data.zipCode,
        electricBill: this.parseBillRange(data.billRange),
        creditBand: this.parseCreditScore(data.creditScore),
        roofSize: this.parseRoofSize(data.roofSize)
      };

      const response = await fetch(`${this.baseUrl}/check-qualification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error:', error);
      return {
        status: 'not_qualified',
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }

  async getZipCodeData(zipCode: string): Promise<ZipCodeData> {
    try {
      const response = await fetch(`${this.baseUrl}/electricity-data?zip=${zipCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Fetch demographic data in background for logging (don't wait for it)
      this.fetchDemographicDataBackground(zipCode);

      return result;
    } catch (error) {
      console.error('ZIP Code API Error:', error);
      throw error;
    }
  }

  private async fetchDemographicDataBackground(zipCode: string): Promise<void> {
    try {
      // Fetch demographic data in background - this will be logged but not returned to frontend
      await fetch(`${this.baseUrl}/demographic-data?zip=${zipCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(`Background demographic data fetched for ZIP: ${zipCode}`);
    } catch (error) {
      console.warn('Background demographic fetch failed:', error);
      // Don't throw error - this is background operation
    }
  }

  async getVantageScore(zipCode: string): Promise<VantageScoreData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/vantage-score?zip=${zipCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No Vantage Score data available for this ZIP
          return null;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.warn('Vantage Score API Error:', error);
      return null; // Return null instead of throwing to handle gracefully
    }
  }

  async getStats() {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Stats API Error:', error);
      return null;
    }
  }

  private parseBillRange(billRange: string): number {
    // If it's already a number (from slider), return it directly
    const numericValue = parseFloat(billRange);
    if (!isNaN(numericValue)) {
      return numericValue;
    }

    // Convert legacy bill range to average value for backend
    switch (billRange) {
      case '50-100':
        return 75;
      case '100-200':
        return 150;
      case '200-300':
        return 250;
      case '300+':
        return 350;
      default:
        return 150; // Default to average
    }
  }

  private parseCreditScore(creditScore: string): string {
    // Convert frontend credit score values to backend expected format
    switch (creditScore.toLowerCase()) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'fair':
        return 'Fair';
      case 'poor':
        return 'Poor';
      default:
        return 'Good'; // Default to Good
    }
  }

  private parseRoofSize(roofSize: string): number {
    // Convert roof size to square footage for backend
    if (!isNaN(Number(roofSize))) {
      // If it's already a number (custom input), return it
      return Number(roofSize);
    }

    // Convert predefined ranges to average values
    switch (roofSize) {
      case 'small':
        return 750; // Under 1,000 sq ft
      case 'medium':
        return 1500; // 1,000 - 2,000 sq ft
      case 'large':
        return 2500; // 2,000 - 3,000 sq ft
      case 'extra-large':
        return 3500; // Over 3,000 sq ft
      default:
        return 1500; // Default to medium
    }
  }
}

export const apiService = new ApiService();
