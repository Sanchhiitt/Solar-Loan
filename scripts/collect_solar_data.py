# scripts/collect_solar_data.py
import requests
import pandas as pd
import json
from datetime import datetime
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.database.schema import SessionLocal, ZipCodeData
class SolarDataCollector:
    """Collect solar data from various sources"""
    def __init__(self):
        self.session = SessionLocal()
        # Get free API key from https://developer.nrel.gov/signup/
        self.nrel_api_key = os.getenv('NREL_API_KEY', 'DEMO_KEY')
    def get_solar_data_for_zip(self, zip_code):
        """Get solar data from NREL for a ZIP code"""
        try:
            # First, get lat/lon for ZIP code
            zip_data = self.session.query(ZipCodeData).filter_by(zip_code=zip_code).first()
            if not zip_data:
                print(f":x: ZIP code {zip_code} not found in database")
                return None
            # Call NREL PVWatts API
            url = "https://developer.nrel.gov/api/pvwatts/v6.json"
            params = {
                'api_key': self.nrel_api_key,
                'lat': zip_data.latitude,
                'lon': zip_data.longitude,
                'system_capacity': 4,  # 4kW system
                'azimuth': 180,
                'tilt': 20,
                'array_type': 1,
                'module_type': 1,
                'losses': 14
            }
            response = requests.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                # Update sun hours in database
                if 'outputs' in data:
                    annual_radiation = data['outputs']['solrad_annual']
                    zip_data.sun_hours_daily = annual_radiation
                    self.session.commit()
                    print(f":white_check_mark: Updated solar data for ZIP {zip_code}")
                    return data
            else:
                print(f":x: API error: {response.status_code}")
                return None
        except Exception as e:
            print(f":x: Error collecting solar data: {str(e)}")
            return None
    def collect_all_zip_codes(self):
        """Update solar data for all ZIP codes in database"""
        zip_codes = self.session.query(ZipCodeData).all()
        for zip_data in zip_codes:
            print(f":arrows_counterclockwise: Collecting data for {zip_data.zip_code}...")
            self.get_solar_data_for_zip(zip_data.zip_code)
            # Be nice to the API
            import time
            time.sleep(1)
    def close(self):
        self.session.close()
# Create a simple CSV data file for testing
def create_sample_data_files():
    """Create sample CSV files for testing"""
    # Create data directory
    os.makedirs('data/processed', exist_ok=True)
    # 1. Electricity rates by state
    electricity_rates = pd.DataFrame({
        'state': ['CA', 'TX', 'FL', 'NY', 'IL'],
        'avg_rate_cents': [22.85, 11.20, 12.65, 21.45, 13.45],
        'utility_company': ['PG&E', 'Oncor', 'FPL', 'ConEd', 'ComEd']
    })
    electricity_rates.to_csv('data/processed/electricity_rates.csv', index=False)
    # 2. Solar installation costs
    install_costs = pd.DataFrame({
        'state': ['CA', 'TX', 'FL', 'NY', 'IL'],
        'cost_per_watt': [2.95, 2.65, 2.55, 3.05, 2.75],
        'avg_system_size_kw': [6.0, 7.5, 6.5, 5.5, 5.0]
    })
    install_costs.to_csv('data/processed/install_costs.csv', index=False)
    # 3. Credit score mapping
    credit_mapping = pd.DataFrame({
        'credit_band': ['Excellent', 'Good', 'Fair', 'Poor'],
        'min_score': [750, 700, 650, 300],
        'max_score': [850, 749, 699, 649],
        'approval_rate': [0.95, 0.80, 0.60, 0.30]
    })
    credit_mapping.to_csv('data/processed/credit_mapping.csv', index=False)
    print(":white_check_mark: Sample data files created in data/processed/")
if __name__ == "__main__":
    # Create sample files
    create_sample_data_files()
    # Collect solar data (optional - requires API key)
    # collector = SolarDataCollector()
    # collector.collect_all_zip_codes()
    # collector.close()
