Write-Host "Starting Solar Loan Fit Checker..."

# Check if virtual environment exists
if (-Not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..."
& .\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing dependencies..."
pip install -r requirements.txt

# Initialize database if needed
if (-Not (Test-Path "solar_loan.db")) {
    Write-Host "Initializing database..."
    Set-Location backend
    python .\database\init_db.py
    Set-Location ..
}

# Start the Flask server
Write-Host "Starting Flask server..."
Set-Location backend
python app.py
