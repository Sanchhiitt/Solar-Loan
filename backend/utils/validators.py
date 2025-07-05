# backend/utils/validators.py
import re
from typing import Dict, Any, Tuple
def validate_zip_code(zip_code: str) -> bool:
    """Validate US ZIP code format"""
    # US ZIP: 5 digits or 5+4 format
    pattern = r'^\d{5}(-\d{4})?$'
    return bool(re.match(pattern, str(zip_code)))
def validate_input(data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate all input fields"""
    errors = []
    # Required fields
    required_fields = ['zipCode', 'electricBill', 'creditBand', 'roofSize']
    for field in required_fields:
        if field not in data or not data[field]:
            errors.append(f"Missing required field: {field}")
    if errors:
        return {'valid': False, 'message': '; '.join(errors)}
    # ZIP code validation
    if not validate_zip_code(data['zipCode']):
        errors.append("Invalid ZIP code format")
    # Electric bill validation
    try:
        bill = float(data['electricBill'])
        if bill < 50 or bill > 500:
            errors.append("Electric bill must be between $50 and $500")
    except ValueError:
        errors.append("Electric bill must be a number")
    # Credit band validation
    valid_credit_bands = ['Excellent', 'Good', 'Fair', 'Poor']
    if data['creditBand'] not in valid_credit_bands:
        errors.append(f"Credit band must be one of: {', '.join(valid_credit_bands)}")
    # Roof size validation
    try:
        roof_size = float(data['roofSize'])
        if roof_size < 100 or roof_size > 5000:
            errors.append("Roof size must be between 100 and 5000 sq ft")
    except ValueError:
        errors.append("Roof size must be a number")
    if errors:
        return {'valid': False, 'message': '; '.join(errors)}
    return {'valid': True}
