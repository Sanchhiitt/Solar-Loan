#backend/utils/solar_calculator.py
import numpy as np
from typing import Dict, Any
from datetime import datetime
class SolarCalculator:
    """Core calculation engine for solar loan qualification"""
    # Constants
    # backend/utils/solar_calculator.py (continued)
    PANEL_WATTAGE = 400  # Standard panel size in watts
    SYSTEM_EFFICIENCY = 0.85  # 85% efficiency including losses
    PANEL_DEGRADATION = 0.005  # 0.5% per year
    COST_PER_WATT = 2.75  # Average $ per watt installed
    @staticmethod
    def calculate_system_size(monthly_bill: float, electricity_rate: float, sun_hours: float) -> float:
        """Calculate required system size in kW"""
        # Calculate monthly kWh usage
        monthly_kwh = monthly_bill / (electricity_rate / 100)
        # Annual kWh needed
        annual_kwh = monthly_kwh * 12
        # System size = Annual kWh / (365 days * sun hours * efficiency)
        system_size_kw = annual_kwh / (365 * sun_hours * SolarCalculator.SYSTEM_EFFICIENCY)
        # Round up to nearest 0.5 kW
        return round(system_size_kw * 2) / 2
    @staticmethod
    def calculate_system_cost(system_size_kw: float, state: str = None) -> Dict[str, float]:
        """Calculate total system cost with incentives"""
        # Base cost
        gross_cost = system_size_kw * 1000 * SolarCalculator.COST_PER_WATT
        # Federal tax credit (30%)
        federal_credit = gross_cost * 0.30
        # State incentives (simplified)
        state_incentives = {
            'CA': min(1000, gross_cost * 0.05),
            'NY': min(5000, gross_cost * 0.10),
            'TX': 0,  # No state incentive
            'FL': 0,
            'IL': min(3000, gross_cost * 0.07)
        }
        state_credit = state_incentives.get(state, 0)
        # Net cost
        net_cost = gross_cost - federal_credit - state_credit
        return {
            'gross_cost': round(gross_cost, 2),
            'federal_credit': round(federal_credit, 2),
            'state_credit': round(state_credit, 2),
            'net_cost': round(net_cost, 2)
        }
    @staticmethod
    def calculate_monthly_payment(principal: float, apr: float, years: int) -> float:
        """Calculate monthly loan payment"""
        if apr == 0:
            return principal / (years * 12)
        monthly_rate = apr / 100 / 12
        num_payments = years * 12
        # Monthly payment formula
        payment = principal * (monthly_rate * (1 + monthly_rate)**num_payments) / \
                 ((1 + monthly_rate)**num_payments - 1)
        return round(payment, 2)
    @staticmethod
    def calculate_payback_period(system_cost: float, monthly_bill: float,
                                monthly_payment: float) -> float:
        """Calculate payback period in years"""
        # Annual savings = current electric bill * 12
        annual_savings = monthly_bill * 12
        # Net annual cost = loan payment * 12 - savings
        net_annual_cost = (monthly_payment * 12) - annual_savings
        if net_annual_cost <= 0:
            # System pays for itself immediately
            return 0
        # Simple payback = net cost / annual savings
        payback_years = system_cost / annual_savings
        return round(payback_years, 1)
    @staticmethod
    def calculate_lifetime_savings(system_size_kw: float, electricity_rate: float,
                                 sun_hours: float, years: int = 25) -> float:
        """Calculate 25-year savings"""
        total_kwh = 0
        for year in range(years):
            # Account for panel degradation
            efficiency = SolarCalculator.SYSTEM_EFFICIENCY * (1 - SolarCalculator.PANEL_DEGRADATION * year)
            annual_kwh = system_size_kw * 365 * sun_hours * efficiency * 1000 / 1000
            total_kwh += annual_kwh
        # Assume 3% annual electricity rate increase
        avg_rate = electricity_rate * ((1.03**years - 1) / (0.03 * years))
        lifetime_savings = total_kwh * (avg_rate / 100)
        return round(lifetime_savings, 2)
