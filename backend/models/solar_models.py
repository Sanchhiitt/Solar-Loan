# backend/models/solar_models.py
from dataclasses import dataclass
from typing import Optional, Dict, Any
from datetime import datetime
@dataclass
class QualificationRequest:
    """Input data model"""
    zip_code: str
    electric_bill: float
    credit_band: str
    roof_size: float
    loan_term: int = 20  # Default 20 years
    @classmethod
    def from_dict(cls, data: Dict[str, Any]):
        return cls(
            zip_code=data['zipCode'],
            electric_bill=float(data['electricBill']),
            credit_band=data['creditBand'],
            roof_size=float(data['roofSize']),
            loan_term=data.get('loanTerm', 20)
        )
@dataclass
class QualificationResult:
    """Output data model"""
    status: str  # 'approved', 'borderline', 'not_qualified'
    monthly_payment: float
    payback_years: float
    system_size_kw: float
    total_savings: float
    explanation: str
    timestamp: datetime = datetime.now()
    def to_dict(self) -> Dict[str, Any]:
        return {
            'status': self.status,
            'monthlyPayment': round(self.monthly_payment, 2),
            'paybackYears': round(self.payback_years, 1),
            'systemSizeKW': round(self.system_size_kw, 2),
            'totalSavings': round(self.total_savings, 2),
            'explanation': self.explanation,
            'timestamp': self.timestamp.isoformat()
        }
@dataclass
class SolarSystemSpecs:
    """Solar system specifications"""
    size_kw: float
    cost_per_watt: float = 2.75
    efficiency: float = 0.18
    degradation_rate: float = 0.005  # 0.5% per year
    @property
    def total_cost(self) -> float:
        return self.size_kw * 1000 * self.cost_per_watt
    @property
    def panels_needed(self) -> int:
        # Assuming 400W panels
        return int((self.size_kw * 1000) / 400) + 1