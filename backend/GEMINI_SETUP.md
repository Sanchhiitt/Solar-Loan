# Gemini AI Integration Setup

## Getting Your Gemini API Key

1. **Visit Google AI Studio**: https://aistudio.google.com/
2. **Sign in** with your Google account
3. **Click "Get API Key"** in the left sidebar
4. **Create a new API key** or use an existing one
5. **Copy the API key**

## Setting Up the API Key

### Option 1: Environment Variable (Recommended)
```bash
# Windows
set GEMINI_API_KEY=your_actual_api_key_here

# Linux/Mac
export GEMINI_API_KEY=your_actual_api_key_here
```

### Option 2: Direct in Code
Edit `backend/app.py` line 96:
```python
GEMINI_API_KEY = "your_actual_api_key_here"
```

## Testing Gemini Integration

1. **Set your API key** using one of the methods above
2. **Restart the backend server**:
   ```bash
   python backend/app.py
   ```
3. **Test the qualification endpoint**:
   ```bash
   curl -X POST "http://localhost:5500/api/check-qualification" \
     -H "Content-Type: application/json" \
     -d '{"zipCode":"90210","electricBill":150,"creditBand":"Good","roofSize":1500}'
   ```

## What Gemini AI Does

### Instead of Formula-Based Calculations:
- **Old Way**: Fixed formulas for system size, costs, payments
- **New Way**: Gemini AI analyzes all data contextually

### Gemini Considers:
1. **Location Data**: ZIP code, city, state, county
2. **Electricity Data**: Local rates, usage patterns, utility info
3. **Demographics**: Population, income, regional factors
4. **User Profile**: Bill amount, credit score, roof size
5. **Solar Industry Standards**: Current costs, incentives, technology
6. **Economic Factors**: Local market conditions, financing options

### Gemini Calculates:
- Optimal system size for your specific situation
- Accurate cost estimates with local incentives
- Realistic monthly payments based on credit
- Payback period considering all factors
- 25-year lifetime savings projections
- Qualification status with detailed reasoning

## Fallback System

If Gemini API fails or is unavailable:
- **Automatic fallback** to formula-based calculations
- **No service interruption** for users
- **Logged for debugging** in `logs/errors.jsonl`

## Monitoring Gemini Usage

### Log Files Created:
- `logs/gemini_calculations.jsonl` - All Gemini AI calculations
- `logs/check_qualification_extra_data.jsonl` - Request metadata
- `logs/api_requests.jsonl` - Complete request/response data

### View Gemini Logs:
```bash
python backend/view_logs.py
```

## Benefits of Gemini Integration

1. **Contextual Analysis**: Considers local market conditions
2. **Dynamic Calculations**: Adapts to changing solar industry
3. **Intelligent Reasoning**: Explains decisions clearly
4. **Comprehensive Data**: Uses all available information
5. **Continuous Learning**: Improves with industry updates

## API Costs

- **Gemini 1.5 Flash**: Very cost-effective
- **Typical cost**: ~$0.01-0.02 per qualification
- **Free tier**: 15 requests per minute
- **Paid tier**: Higher limits available

## Troubleshooting

### Common Issues:
1. **"API key not valid"**: Check your API key is correct
2. **"Quota exceeded"**: You've hit rate limits
3. **"Service unavailable"**: Temporary Google AI issue

### Solutions:
- Verify API key at https://aistudio.google.com/
- Check rate limits in Google AI Studio
- Monitor logs for specific error messages
- Fallback system ensures service continues

## Security Notes

- **Never commit API keys** to version control
- **Use environment variables** in production
- **Rotate keys regularly** for security
- **Monitor usage** to detect unauthorized access
