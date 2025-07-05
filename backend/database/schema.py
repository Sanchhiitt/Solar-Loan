# backend/database/schema.py
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
Base = declarative_base()
class ZipCodeData(Base):
    __tablename__ = 'zip_code_data'
    id = Column(Integer, primary_key=True)
    zip_code = Column(String(10), unique=True, index=True)
    state = Column(String(2))
    city = Column(String(100))
    latitude = Column(Float)
    longitude = Column(Float)
    electricity_rate_cents = Column(Float)
    sun_hours_daily = Column(Float)
    utility_company = Column(String(200))
    last_updated = Column(DateTime, default=datetime.utcnow)
class SolarIncentive(Base):
    __tablename__ = 'solar_incentives'
    id = Column(Integer, primary_key=True)
    state = Column(String(2), index=True)
    incentive_type = Column(String(50))  # 'tax_credit', 'rebate', 'performance'
    amount = Column(Float)
    percentage = Column(Float)
    max_amount = Column(Float)
    expires = Column(DateTime)
    requirements = Column(String(500))
class LoanRate(Base):
    __tablename__ = 'loan_rates'
    id = Column(Integer, primary_key=True)
    credit_band = Column(String(20))
    min_score = Column(Integer)
    max_score = Column(Integer)
    apr_rate = Column(Float)
    max_term_years = Column(Integer)
    down_payment_required = Column(Float)
    updated_date = Column(DateTime, default=datetime.utcnow)
class QualificationLog(Base):
    __tablename__ = 'qualification_logs'
    id = Column(Integer, primary_key=True)
    request_id = Column(String(50), unique=True)
    zip_code = Column(String(10))
    electric_bill = Column(Float)
    credit_band = Column(String(20))
    roof_size = Column(Float)
    status = Column(String(20))
    monthly_payment = Column(Float)
    payback_years = Column(Float)
    system_size_kw = Column(Float)
    total_savings = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
# Create SQLite database (NO INSTALLATION NEEDED!)
DATABASE_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'solar_loan.db')
engine = create_engine(f'sqlite:///{DATABASE_PATH}', echo=True)
# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Create all tables
def init_db():
    Base.metadata.create_all(bind=engine)
    print(":white_check_mark: Database tables created successfully!")
# Helper function to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()