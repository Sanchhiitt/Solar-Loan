# backend/utils/qualification_engine.py
from typing import Dict, Any
from database.schema import SessionLocal, ZipCodeData, LoanRate
from utils.solar_calculator import SolarCalculator
class QualificationEngine:
    """Main engine for loan qualification decisions"""
    def __init__(self):
        self.db = SessionLocal()
        self.calculator = SolarCalculator()
    def process_qualification(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process qualification request and return decision"""
        # Extract input data
        zip_code = data['zipCode']
        monthly_bill = float(data['electricBill'])
        credit_band = data['creditBand']
        roof_size = float(data['roofSize'])
        # Get location data
        location = self.db.query(ZipCodeData).filter_by(zip_code=zip_code).first()
        if not location:
            # Use defaults if ZIP not found
            location = {
                'electricity_rate_cents': 15.0,
                'sun_hours_daily': 4.5,
                'state': 'US'
            }
        else:
            location = {
                'electricity_rate_cents': location.electricity_rate_cents,
                'sun_hours_daily': location.sun_hours_daily,
                'state': location.state
            }
        # Calculate system size
        system_size = self.calculator.calculate_system_size(
            monthly_bill,
            location['electricity_rate_cents'],
            location['sun_hours_daily']
        )
        # Check if roof is big enough (assume 20 sq ft per kW)
        required_roof_size = system_size * 200  # More realistic: 200 sq ft per kW
        if roof_size < required_roof_size:
            system_size = roof_size / 200  # Adjust system size to fit roof
        # Calculate costs
        costs = self.calculator.calculate_system_cost(system_size, location['state'])
        # Get loan terms
        loan_info = self.db.query(LoanRate).filter_by(credit_band=credit_band).first()
        if not loan_info:
            # Default terms if not found
            loan_info = LoanRate(
                apr_rate=8.99,
                max_term_years=15,
                down_payment_required=10
            )
        # Calculate monthly payment
        monthly_payment = self.calculator.calculate_monthly_payment(
            costs['net_cost'],
            loan_info.apr_rate,
            loan_info.max_term_years
        )
        # Calculate payback period
        payback_years = self.calculator.calculate_payback_period(
            costs['net_cost'],
            monthly_bill,
            monthly_payment
        )
        # Calculate lifetime savings
        lifetime_savings = self.calculator.calculate_lifetime_savings(
            system_size,
            location['electricity_rate_cents'],
            location['sun_hours_daily']
        )
        # Determine qualification status
        status = self._determine_status(
            monthly_bill,
            monthly_payment,
            credit_band,
            payback_years
        )
        # Close database session
        self.db.close()
        return {
            'status': status,
            'monthlyPayment': monthly_payment,
            'paybackYears': payback_years,
            'systemSizeKW': system_size,
            'totalSavings': lifetime_savings,
            'systemCost': costs,
            'currentBill': monthly_bill,
            'creditBand': credit_band,
            'loanTerms': {
                'apr': loan_info.apr_rate,
                'term': loan_info.max_term_years,
                'downPayment': loan_info.down_payment_required
            }
        }
    def _determine_status(self, monthly_bill: float, monthly_payment: float,
                         credit_band: str, payback_years: float) -> str:
        """Determine qualification status based on criteria"""
        # Calculate payment to bill ratio
        payment_ratio = monthly_payment / monthly_bill if monthly_bill > 0 else float('inf')
        # Decision logic
        if credit_band == 'Excellent':
            if payment_ratio <= 1.2 and payback_years <= 10:
                return 'approved'
            elif payment_ratio <= 1.5 and payback_years <= 15:
                return 'borderline'
            else:
                return 'not_qualified'
        elif credit_band == 'Good':
            if payment_ratio <= 1.0 and payback_years <= 8:
                return 'approved'
            elif payment_ratio <= 1.3 and payback_years <= 12:
                return 'borderline'
            else:
                return 'not_qualified'
        elif credit_band == 'Fair':
            if payment_ratio <= 0.9 and payback_years <= 7:
                return 'approved'
            elif payment_ratio <= 1.1 and payback_years <= 10:
                return 'borderline'
            else:
                return 'not_qualified'
        else:  # Poor credit
            if payment_ratio <= 0.8 and payback_years <= 5:
                return 'borderline'
            else:
                return 'not_qualified'