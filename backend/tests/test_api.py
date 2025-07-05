# backend/tests/test_api.py
import pytest
import json
from backend.app import app
class TestAPI:
    """Test API endpoints"""
    @pytest.fixture
    def client(self):
        """Create test client"""
        app.config['TESTING'] = True
        with app.test_client() as client:
            yield client
    def test_health_check(self, client):
        """Test health endpoint"""
        response = client.get('/')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'healthy'
    def test_qualification_valid(self, client):
        """Test valid qualification request"""
        payload = {
            'zipCode': '10001',
            'electricBill': '150',
            'creditBand': 'Good',
            'roofSize': '1500'
        }
        response = client.post(
            '/api/check-qualification',
            data=json.dumps(payload),
            content_type='application/json'
        )
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'status' in data
        assert 'monthlyPayment' in data
        assert 'explanation' in data
    def test_qualification_invalid_zip(self, client):
        """Test invalid ZIP code"""
        payload = {
            'zipCode': 'INVALID',
            'electricBill': '150',
            'creditBand': 'Good',
            'roofSize': '1500'
        }
        response = client.post(
            '/api/check-qualification',
            data=json.dumps(payload),
            content_type='application/json'
        )
        assert response.status_code == 400