# backend/database/init_db.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.schema import SessionLocal, init_db, ZipCodeData, LoanRate, SolarIncentive
from datetime import datetime, timedelta
def populate_initial_data():
    """Add initial data to database"""
    db = SessionLocal()
    try:
        print(":bar_chart: Adding ZIP code data...")
        # Add sample ZIP codes with solar data
        zip_codes = [
            {
                'zip_code': '10001',
                'state': 'NY',
                'city': 'New York',
                'latitude': 40.7506,
                'longitude': -73.9972,
                'electricity_rate_cents': 21.45,
                'sun_hours_daily': 4.2,
                'utility_company': 'Con Edison'
            },
            {
                'zip_code': '90210',
                'state': 'CA',
                'city': 'Beverly Hills',
                'latitude': 34.0901,
                'longitude': -118.4065,
                'electricity_rate_cents': 22.85,
                'sun_hours_daily': 5.8,
                'utility_company': 'Southern California Edison'
            },
            {
                'zip_code': '33139',
                'state': 'FL',
                'city': 'Miami Beach',
                'latitude': 25.7907,
                'longitude': -80.1300,
                'electricity_rate_cents': 12.65,
                'sun_hours_daily': 5.2,
                'utility_company': 'Florida Power & Light'
            },
            {
                'zip_code': '78701',
                'state': 'TX',
                'city': 'Austin',
                'latitude': 30.2672,
                'longitude': -97.7431,
                'electricity_rate_cents': 11.20,
                'sun_hours_daily': 5.3,
                'utility_company': 'Austin Energy'
            },
            {
                'zip_code': '60601',
                'state': 'IL',
                'city': 'Chicago',
                'latitude': 41.8781,
                'longitude': -87.6298,
                'electricity_rate_cents': 13.45,
                'sun_hours_daily': 4.0,
                'utility_company': 'ComEd'
            }
        ]
        for zip_data in zip_codes:
            # Check if already exists
            existing = db.query(ZipCodeData).filter_by(zip_code=zip_data['zip_code']).first()
            if not existing:
                db.add(ZipCodeData(**zip_data))
        print(":moneybag: Adding loan rates...")
        # Add loan rates by credit score
        loan_rates = [
            {
                'credit_band': 'Excellent',
                'min_score': 750,
                'max_score': 850,
                'apr_rate': 3.99,
                'max_term_years': 25,
                'down_payment_required': 0
            },
            {
                'credit_band': 'Good',
                'min_score': 700,
                'max_score': 749,
                'apr_rate': 5.99,
                'max_term_years': 20,
                'down_payment_required': 0
            },
            {
                'credit_band': 'Fair',
                'min_score': 650,
                'max_score': 699,
                'apr_rate': 8.99,
                'max_term_years': 15,
                'down_payment_required': 10
            },
            {
                'credit_band': 'Poor',
                'min_score': 300,
                'max_score': 649,
                'apr_rate': 12.99,
                'max_term_years': 10,
                'down_payment_required': 20
            }
        ]
        for rate_data in loan_rates:
            existing = db.query(LoanRate).filter_by(credit_band=rate_data['credit_band']).first()
            if not existing:
                db.add(LoanRate(**rate_data))
        print(":gift: Adding solar incentives...")
        # Add incentives
        incentives = [
            {
                'state': 'US',  # Federal incentive
                'incentive_type': 'tax_credit',
                'percentage': 30.0,
                'expires': datetime(2032, 12, 31),
                'requirements': 'Must own the system (not lease)'
            },
            {
                'state': 'CA',
                'incentive_type': 'rebate',
                'amount': 500,
                'max_amount': 3000,
                'expires': datetime(2024, 12, 31),
                'requirements': 'Must use certified installer'
            },
            {
                'state': 'NY',
                'incentive_type': 'tax_credit',
                'percentage': 25.0,
                'max_amount': 5000,
                'expires': datetime(2025, 12, 31),
                'requirements': 'Primary residence only'
            }
        ]
        for incentive_data in incentives:
            existing = db.query(SolarIncentive).filter_by(
                state=incentive_data['state'],
                incentive_type=incentive_data['incentive_type']
            ).first()
            if not existing:
                db.add(SolarIncentive(**incentive_data))
        db.commit()
        print(":white_check_mark: Initial data added successfully!")
    except Exception as e:
        print(f":x: Error: {str(e)}")
        db.rollback()
    finally:
        db.close()
if __name__ == "__main__":
    print(":arrows_counterclockwise: Initializing database...")
    init_db()
    print(":arrows_counterclockwise: Adding initial data...")
    populate_initial_data()