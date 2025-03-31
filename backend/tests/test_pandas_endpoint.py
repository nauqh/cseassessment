import requests
import json

test_cases = [
    {
        "description": "Test 1: Basic DataFrame.head() operation",
        "body": {
            "code": "df.head(3)",
            "language": "pandas"
        }
    },
    {
        "description": "Test 2: Column selection",
        "body": {
            "code": "df[['EmployeeName', 'JobTitle', 'TotalPay']][:5]",
            "language": "pandas"
        }
    },
    {
        "description": "Test 3: Filtering with conditions",
        "body": {
            "code": "df[df['TotalPay'] > 300000][['EmployeeName', 'JobTitle', 'TotalPay']][:5]",
            "language": "pandas"
        }
    },
    {
        "description": "Test 4: Aggregation functions",
        "body": {
            "code": "df.groupby('JobTitle')['TotalPay'].mean().nlargest(5)",
            "language": "pandas"
        }
    },
    {
        "description": "Test 5: Series operations",
        "body": {
            "code": "df['TotalPay'].describe()",
            "language": "pandas"
        }
    },
    {
        "description": "Test 6: Complex pivot table",
        "body": {
            "code": "pd.pivot_table(data=df[df['JobTitle'].isin(df['JobTitle'].value_counts().head().index)], index=['JobTitle'], columns=['Year'], values=['BasePay', 'OvertimePay', 'TotalPay'])",
            "language": "pandas"
        }
    },
    {
        "description": "Test 7: Multi-level groupby with aggregation",
        "body": {
            "code": "df.groupby(['Year', 'JobTitle']).agg({'TotalPay': ['mean', 'max'], 'OvertimePay': ['mean', 'max']}).head(5)",
            "language": "pandas"
        }
    },
    {
        "description": "Test 8: Using advanced pandas functions",
        "body": {
            "code": "pd.cut(df['TotalPay'], bins=[0, 50000, 100000, 200000, 300000, float('inf')], labels=['<50K', '50K-100K', '100K-200K', '200K-300K', '>300K']).value_counts()",
            "language": "pandas"
        }
    },
    {
        "description": "Test 9: Handling NaN values",
        "body": {
            "code": "df[['BasePay', 'OvertimePay', 'TotalPay']].isna().sum()",
            "language": "pandas"
        }
    },
    {
        "description": "Test 10: Complex data transformation",
        "body": {
            "code": """
            # Derive new columns
            result = df.copy()
            result['OTProportion'] = result['OvertimePay'] / result['TotalPay']
            result['PayCategory'] = pd.qcut(result['TotalPay'], 4, labels=['Low', 'Medium', 'High', 'Very High'])
            result.groupby('PayCategory')['OTProportion'].mean().reset_index()
            """,
            "language": "pandas"
        }
    },
    {
        "description": "Test 11: Multi-step data cleaning",
        "body": {
            "code": """
            # Clean and transform data
            clean_df = df.copy()
            # Fill missing values
            clean_df['BasePay'] = clean_df['BasePay'].fillna(clean_df['BasePay'].median())
            clean_df['OvertimePay'] = clean_df['OvertimePay'].fillna(0)
            # Create efficiency metric
            clean_df['PayEfficiency'] = clean_df['TotalPay'] / (clean_df['BasePay'] + 1)
            # Filter and sort
            result = clean_df.sort_values('PayEfficiency', ascending=False).head(10)
            result[['EmployeeName', 'JobTitle', 'BasePay', 'TotalPay', 'PayEfficiency']]
            """,
            "language": "pandas"
        }
    },
    {
        "description": "Test 12: Year-over-year analysis",
        "body": {
            "code": """
            # Analyze year-over-year changes
            yearly_data = df.groupby('Year').agg({
                'BasePay': 'mean',
                'OvertimePay': 'mean',
                'TotalPay': 'mean'
            }).reset_index()
            
            # Calculate year-over-year percentage changes
            yearly_data['BasePay_YoY'] = yearly_data['BasePay'].pct_change() * 100
            yearly_data['OvertimePay_YoY'] = yearly_data['OvertimePay'].pct_change() * 100
            yearly_data['TotalPay_YoY'] = yearly_data['TotalPay'].pct_change() * 100
            
            # Format the results
            yearly_data.round(2)
            """,
            "language": "pandas"
        }
    },
    {
        "description": "Test 13: Custom aggregation by department",
        "body": {
            "code": """
            # Extract department from JobTitle using string operations
            temp_df = df.copy()
            
            # First word of JobTitle as department (simplified)
            temp_df['Department'] = temp_df['JobTitle'].apply(lambda x: x.split()[0] if isinstance(x, str) and len(x.split()) > 0 else 'Unknown')
            
            # Aggregate by department with multiple metrics
            dept_stats = temp_df.groupby('Department').agg({
                'EmployeeName': 'count',
                'TotalPay': ['mean', 'median', 'std', 'min', 'max'],
                'OvertimePay': ['mean', 'sum']
            })
            
            # Get top 10 departments by headcount
            dept_stats.sort_values(('EmployeeName', 'count'), ascending=False).head(10)
            """,
            "language": "pandas"
        }
    },
    {
        "description": "Test 14: Cohort analysis by job level",
        "body": {
            "code": """
            # Create job level categories based on pay
            analysis_df = df.copy()
            
            # Define pay ranges for job levels
            bins = [0, 50000, 100000, 150000, 200000, float('inf')]
            labels = ['Entry', 'Junior', 'Mid', 'Senior', 'Executive']
            
            # Create job level column
            analysis_df['JobLevel'] = pd.cut(analysis_df['BasePay'], bins=bins, labels=labels)
            
            # Create experience metric (simplified example)
            analysis_df['OT_Ratio'] = analysis_df['OvertimePay'] / analysis_df['TotalPay']
            
            # Analyze pay components by job level
            level_analysis = analysis_df.groupby('JobLevel').agg({
                'BasePay': 'mean',
                'OvertimePay': 'mean',
                'TotalPay': 'mean',
                'OT_Ratio': 'mean',
                'EmployeeName': 'count'
            }).rename(columns={'EmployeeName': 'Count'})
            
            # Calculate percentage of total for each level
            level_analysis['Pct_of_Total'] = level_analysis['Count'] / level_analysis['Count'].sum() * 100
            level_analysis.fillna(0).round(2)
            """,
            "language": "pandas"
        }
    },
    {
        "description": "Test 15: Multi-condition filtering with calculation",
        "body": {
            "code": """
            # Complex filtering with multiple conditions
            filtered_df = df.copy()
            
            # Filter for high earners with low base pay
            high_earners = filtered_df[
                (filtered_df['TotalPay'] > filtered_df['TotalPay'].quantile(0.75)) & 
                (filtered_df['BasePay'] < filtered_df['BasePay'].median())
            ]
            
            # Calculate ratio of other compensation
            high_earners['OtherComp_Ratio'] = (high_earners['TotalPay'] - high_earners['BasePay']) / high_earners['TotalPay']
            
            # Group by job title and find average ratios
            job_ratios = high_earners.groupby('JobTitle').agg({
                'OtherComp_Ratio': 'mean',
                'EmployeeName': 'count'
            }).rename(columns={'EmployeeName': 'Count'})
            
            # Filter for jobs with at least 3 employees and sort
            job_ratios[job_ratios['Count'] >= 3].sort_values('OtherComp_Ratio', ascending=False).head(10)
            """,
            "language": "pandas"
        }
    }
]

def run_tests():
    for i, test in enumerate(test_cases, 1):
        print(f"\n{'-'*50}")
        print(f"{test['description']}")
        print(f"{'-'*50}")
        
        try:
            response = requests.post("http://127.0.0.1:8000/execute", json=test["body"])
            
            if response.status_code == 200:
                print(f"✅ Test {i} successful (Status: {response.status_code})")
                
                data = response.json()
                result_type = data["output"]["type"] if "type" in data["output"] else "unknown"
                
                print(f"DataType: {result_type}")
                
                # For DataFrames and Series, just show a sample of the data
                if result_type in ["dataframe", "series", "index"]:
                    if isinstance(data["output"]["data"], list) and data["output"]["data"]:
                        # For DataFrames (list of dicts)
                        print(f"Sample data: {json.dumps(data['output']['data'][0] if data['output']['data'] else {}, indent=2)}")
                    elif isinstance(data["output"]["data"], dict):
                        # For Series (dict)
                        items = list(data["output"]["data"].items())
                        sample = dict(items[:3]) if items else {}
                        print(f"Sample data: {json.dumps(sample, indent=2)}")
                else:
                    # For other types, just show the data directly
                    print(f"Data: {json.dumps(data['output']['data'], indent=2)}")
            else:
                print(f"❌ Test {i} failed with status: {response.status_code}")
                print(f"Error: {response.text}")
        
        except Exception as e:
            print(f"❌ Test {i} failed with exception: {str(e)}")

if __name__ == "__main__":
    run_tests()
