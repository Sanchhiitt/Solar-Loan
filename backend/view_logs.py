#!/usr/bin/env python3
"""
Simple script to view and analyze the API logs in a readable format.
"""

import json
import os
from datetime import datetime
from collections import defaultdict

def load_jsonl(filename):
    """Load JSON Lines file"""
    logs = []
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    logs.append(json.loads(line.strip()))
                except json.JSONDecodeError:
                    continue
    return logs

def print_summary():
    """Print a summary of all logs"""
    print("=" * 60)
    print("API LOGS SUMMARY")
    print("=" * 60)
    
    # Load main logs
    api_logs = load_jsonl('logs/api_requests.jsonl')
    error_logs = load_jsonl('logs/errors.jsonl')
    
    print(f"Total API Requests: {len(api_logs)}")
    print(f"Total Errors: {len(error_logs)}")
    
    if api_logs:
        # Analyze endpoints
        endpoints = defaultdict(int)
        zip_codes = set()
        data_sources = defaultdict(int)
        
        for log in api_logs:
            endpoints[log['endpoint']] += 1
            zip_codes.add(log['zip_code'])
            if 'data_source' in log['response_data']:
                data_sources[log['response_data']['data_source']] += 1
        
        print(f"Unique ZIP Codes: {len(zip_codes)}")
        print("\nEndpoints Used:")
        for endpoint, count in endpoints.items():
            print(f"  {endpoint}: {count} requests")
        
        print("\nData Sources Used:")
        for source, count in data_sources.items():
            print(f"  {source}: {count} times")
        
        print(f"\nFirst Request: {api_logs[0]['timestamp']}")
        print(f"Last Request: {api_logs[-1]['timestamp']}")

def print_recent_requests(limit=10):
    """Print recent API requests"""
    print("\n" + "=" * 60)
    print(f"RECENT {limit} REQUESTS")
    print("=" * 60)
    
    api_logs = load_jsonl('logs/api_requests.jsonl')
    
    for log in api_logs[-limit:]:
        timestamp = datetime.fromisoformat(log['timestamp']).strftime('%Y-%m-%d %H:%M:%S')
        endpoint = log['endpoint']
        zip_code = log['zip_code']
        
        print(f"\n[{timestamp}] {endpoint.upper()} - ZIP: {zip_code}")
        
        if 'data_source' in log['response_data']:
            print(f"  Data Source: {log['response_data']['data_source']}")
        
        if endpoint == 'electricity-data':
            data = log['response_data']
            print(f"  City: {data.get('city', 'N/A')}, State: {data.get('state', 'N/A')}")
            print(f"  Avg Bill: ${data.get('average_monthly_bill', 'N/A')}")
            print(f"  Rate: {data.get('utility_rate_per_kwh', 'N/A')} $/kWh")
        
        elif endpoint == 'demographic-data':
            data = log['response_data']
            print(f"  City: {data.get('city', 'N/A')}, State: {data.get('state', 'N/A')}")
            print(f"  Population: {data.get('total_population', 'N/A'):,}")
            print(f"  Median Income: ${data.get('median_household_income', 'N/A'):,}")
            
            if 'race_percentages' in data:
                race_data = data['race_percentages']
                print(f"  Demographics: White {race_data.get('white', 0)}%, Black {race_data.get('black', 0)}%, Asian {race_data.get('asian', 0)}%")

def print_errors():
    """Print error logs"""
    print("\n" + "=" * 60)
    print("ERROR LOGS")
    print("=" * 60)
    
    error_logs = load_jsonl('logs/errors.jsonl')
    
    if not error_logs:
        print("No errors logged yet!")
        return
    
    for log in error_logs:
        timestamp = datetime.fromisoformat(log['timestamp']).strftime('%Y-%m-%d %H:%M:%S')
        print(f"\n[{timestamp}] {log['endpoint'].upper()} - ZIP: {log['zip_code']}")
        print(f"  Error: {log['error']}")
        if log.get('error_details'):
            print(f"  Details: {log['error_details']}")

def print_data_sources():
    """Print data source analysis"""
    print("\n" + "=" * 60)
    print("DATA SOURCE ANALYSIS")
    print("=" * 60)
    
    source_logs = load_jsonl('logs/data_sources.jsonl')
    
    for log in source_logs:
        timestamp = datetime.fromisoformat(log['timestamp']).strftime('%Y-%m-%d %H:%M:%S')
        print(f"\n[{timestamp}] ZIP: {log['zip_code']}")
        print(f"  Source: {log['data_source']}")
        
        if 'raw' in log['raw_data'] and log['raw_data']['raw']:
            raw = log['raw_data']['raw']
            print(f"  Raw Data: {raw}")

if __name__ == "__main__":
    print_summary()
    print_recent_requests()
    print_errors()
    print_data_sources()
