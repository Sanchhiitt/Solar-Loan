# backend/tests/test_calculator.py
import pytest
from backend.utils.solar_calculator import SolarCalculator
class TestSolarCalculator:
    """Test solar calculations"""
    def test_system_size_calculation(self):
        """Test system size calculation"""
        # Test case: $150 bill, 15¢/kWh, 5 sun hours
        size = SolarCalculator.calculate_system_size(150, 15, 5)
        # Should be around 6-8 kW
        assert 6 <= size <= 8
    def test_monthly_payment(self):
        """Test loan payment calculation"""
        # $20,000 loan, 5% APR, 20 years
        payment = SolarCalculator.calculate_monthly_payment(20000, 5, 20)
        # Should be around $132
        assert 130 <= payment <= 135
    def test_payback_period(self):
        """Test payback calculation"""
        # $15,000 system, $150 monthly bill, $120 payment
        payback = SolarCalculator.calculate_payback_period(15000, 150, 120)
        # Should be around 8-10 years
        assert 7 <= payback <= 11
# Run tests
if __name__ == "__main__":
    pytest.main([__file__])