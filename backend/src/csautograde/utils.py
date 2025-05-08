import pandas as pd
from functools import partial
import numpy as np
import textwrap
import ast
import io
import sys
import sqlite3
import requests
import traceback
import datetime
import math


class Utils:
    # Function to compare numbers or arrays if values are "equal" (or closely equal)
    is_close = partial(np.isclose, atol=1e-6, equal_nan=True)
    DEBUG = True

    @classmethod
    def printt(cls, msg):
        if cls.DEBUG:
            print(msg)

    @classmethod
    def is_1darray_equal(
        cls, a_val: np.ndarray | pd.Series, b_val: np.ndarray | pd.Series
    ) -> bool:
        """
        Check whether two 1D arrays (or Series) are equal (or closely equal).
        Handles numeric and string arrays, and replaces NaNs with 'NAN_VALUE' for strings.
        """
        # Convert pandas Series to numpy array if needed
        a_val = a_val.values if hasattr(a_val, "values") else a_val
        b_val = b_val.values if hasattr(b_val, "values") else b_val

        # Handle numeric arrays
        if np.issubdtype(a_val.dtype, np.number) and np.issubdtype(
            b_val.dtype, np.number
        ):
            return np.all(cls.is_close(a_val, b_val))

        # Handle string arrays
        if a_val.dtype.kind in {"U", "S", "O"} and b_val.dtype.kind in {"U", "S", "O"}:
            # Replace NaN values in string arrays with 'NAN_VALUE'
            a_val = pd.Series(a_val).fillna("NAN_VALUE").values
            b_val = pd.Series(b_val).fillna("NAN_VALUE").values

        return np.array_equal(a_val, b_val)

    @classmethod
    def is_df_equal(cls, a_val: pd.DataFrame, b_val: pd.DataFrame, **kwargs) -> bool:
        """
        Check whether two DataFrames are equal in terms of values and optionally column names.
        **kwargs:
            - same_col_name (bool): Whether to require identical column names (default: True)
        """
        # Check shape
        if a_val.shape != b_val.shape:
            return False

        # Check column names if required
        same_col_name = kwargs.get("same_col_name", True)
        if same_col_name and not a_val.columns.equals(b_val.columns):
            return False

        # Check each column (1D array) for equality
        for col_a, col_b in zip(a_val.columns, b_val.columns):
            if not cls.is_1darray_equal(a_val[col_a], b_val[col_b]):
                return False

        return True

    @classmethod
    def is_equal(cls, a_val, b_val, **kwargs) -> bool:
        """
        Check whether two values (or data) are closely equal. Handles:
        - int, float
        - list, tuple
        - np.ndarray, pd.Series
        - pd.DataFrame
        """
        if (a_val is None) or (b_val is None):
            return False
        if isinstance(a_val, (int, float)) and isinstance(b_val, (int, float)):
            return cls.is_close(a_val, b_val)
        if isinstance(a_val, (list, tuple)) and isinstance(b_val, (list, tuple)):
            return cls.is_1darray_equal(np.array(a_val), np.array(b_val))
        if isinstance(a_val, (np.ndarray, pd.Series)) and isinstance(
            b_val, (np.ndarray, pd.Series)
        ):
            return cls.is_1darray_equal(a_val, b_val)
        if isinstance(a_val, pd.DataFrame) and isinstance(b_val, pd.DataFrame):
            return cls.is_df_equal(a_val, b_val, **kwargs)
        if type(a_val) is not type(b_val):
            return False
        return a_val == b_val

    @classmethod
    def check_expression(cls, submission, solution, q_index, global_dict):
        if not isinstance(submission, str):
            cls.printt("Your expression answer must be a string")
            return "INVALID"

        try:

            def is_assignment(code):
                try:
                    tree = ast.parse(code)
                    return isinstance(tree.body[0], ast.Assign)
                except Exception:
                    return False

            # If it's an assignment, extract the right-hand side of the assignment (the expression)
            if is_assignment(submission):
                submission_expr = submission.split("=", 1)[1].strip()
            else:
                submission_expr = submission.strip()

            # Evaluate both the submission and the solution expressions in the provided global context
            result_sol = eval(textwrap.dedent(solution), global_dict)
            result_sub = eval(textwrap.dedent(submission_expr), global_dict)

            # Check if the results are closely equal using the existing equality checks
            if cls.is_equal(result_sol, result_sub):
                if is_assignment(submission):
                    return "Partial", f"Q{q_index}: Submission is in wrong format"
                return True, None
            else:
                return False, None
        except Exception as e:
            # cls.printt(f'Something went wrong for question {q_index}: {e}')
            issue = f"Q{q_index}: {e}"
            return False, issue

    @classmethod
    def check_function(cls, submission, solution, q_index, global_dict, tests=None):
        try:
            solution = textwrap.dedent(solution)
            exec(submission, global_dict)
            exec(solution, global_dict)

            have_other_code = submission[:submission.find('def')].strip() != ""
            submission = submission[submission.find("def"):]
            func_name_sub = submission.split("(")[0][4:]
            func_name_sol = solution.split("(")[0][4:].strip()

            test_passed = 0

            for test in tests:
                result_sub = global_dict[func_name_sub](*test)
                result_sol = global_dict[func_name_sol](*test)

                if not cls.is_equal(result_sub, result_sol):
                    issue = f"Q{q_index}: {test} \nExpected output: {result_sol} \nYour output: {result_sub}"
                    return False, issue

                test_passed += 1

            if test_passed == len(tests):
                if have_other_code:
                    return "Partial", f"Q{q_index}: Submission is in wrong format"
                else:
                    return True, None
            else:
                return False, None

        except Exception as e:
            issue = f"Q{q_index}: {e}"
            return False, issue

    @classmethod
    def check_sql(cls, answer, solution, q_index, connection=None):
        if not connection:
            cls.printt("No database connection input")
            return "INVALID"

        if not isinstance(solution, str):
            cls.printt("Your SQL answer must be a string")
            return "INVALID"

        try:
            df_sub = pd.read_sql_query(answer, connection)
            df_sol = pd.read_sql_query(solution, connection)
            if not cls.is_df_equal(df_sub, df_sol, same_col_name=False):
                issue = f"Q{q_index}:\nExpected output:\n {df_sol} \nYour output:\n {df_sub}\n"
                return False, issue
            return True, None
        except Exception as e:
            error_str = str(e)
            if "near" in error_str:
                if ":" in error_str:
                    parts = error_str.split(":", 1)
                    if len(parts) > 1 and "near" in parts[1]:
                        error_msg = parts[1].strip()
                    else:
                        near_index = error_str.find("near")
                        error_msg = error_str[near_index:].strip()
                else:
                    error_msg = error_str
            else:
                error_msg = error_str
            
            issue = f"Q{q_index}: {error_msg}"
            return False, issue

    @classmethod
    def check_multichoice(cls, answer, solution, q_index):
        if isinstance(solution, list):
            # answer = answer.split(",")
            if set(answer) == set(solution):
                return True
            elif set(answer) & set(solution):
                return "Partial"
            else:
                return False
        else:
            return answer == solution

    @classmethod
    def execute_code(cls, code: str, global_dict):
        """
        Execute Python code and capture its output and potential errors
        """
        try:
            output_buffer = io.StringIO()
            sys.stdout = output_buffer

            exec(textwrap.dedent(code), global_dict)

            sys.stdout = sys.__stdout__
            output = output_buffer.getvalue()

            return {"success": True, "output": output, "error": None}

        except Exception:
            error_msg = traceback.format_exc()

            start_idx = error_msg.find(
                'exec(textwrap.dedent(code), global_dict)')
            error_msg = error_msg[start_idx + len(
                'exec(textwrap.dedent(code), global_dict)'):] if start_idx != -1 else error_msg
            error_msg = error_msg.replace('<string>', 'submission.py')

            return {"success": False, "output": None, "error": error_msg}

    @classmethod
    def execute_expression(cls, expression: str, global_dict):
        """
        Execute pandas expression and return the result with appropriate metadata

        Args:
            expression: Pandas expression to evaluate
            global_dict: Global dictionary containing the dataframe and other variables

        Returns:
            Dict containing execution results or error message
        """
        # Capture output in case the expression prints something
        output_buffer = io.StringIO()
        sys.stdout = output_buffer
        
        try:
            # Enhanced handling for multi-line or complex pandas expressions
            # This approach supports pivot_table, groupby, and other multi-line operations
            if '\n' in expression or any(pattern in expression for pattern in [
                "pivot_table", "groupby", "merge", "apply", "pivot", "crosstab"
            ]):
                # Create a new namespace for execution
                local_vars = global_dict.copy()
                
                # Define a variable to hold the result and evaluate the expression fully
                wrap_code = f"__result = {expression}"
                
                try:
                    # Execute the code
                    exec(wrap_code, global_dict, local_vars)
                    
                    # If we've captured the result, use it
                    if "__result" in local_vars:
                        result = local_vars["__result"]
                        
                        # Skip to result serialization
                        sys.stdout = sys.__stdout__
                        
                        # Return the result and exit early
                        return cls._handle_pandas_result(result)
                except Exception as e:
                    # If our special handling fails, continue with normal processing
                    # Reset stdout for normal processing path
                    sys.stdout = output_buffer
                    # Log the error for debugging
                    cls.printt(f"Special handling for multi-line expression failed: {str(e)}")
            
            # Clean expression and remove leading/trailing whitespace
            expression = textwrap.dedent(expression).strip()
            
            # Check if it's a multi-line code block
            is_multi_statement = '\n' in expression
            
            # Create a local namespace for execution
            local_vars = {}
            
            # Make sure pandas and numpy are available
            if 'pd' not in global_dict:
                global_dict['pd'] = pd
            if 'np' not in global_dict:
                global_dict['np'] = np
            
            if is_multi_statement:
                # For multi-line code, use exec to run the entire block
                exec(expression, global_dict, local_vars)
                
                # Try to find the final result from the last line
                last_line = expression.strip().split('\n')[-1].strip()
                
                # Check if the last line is a simple expression (not assignment, conditional, etc.)
                if (not any(last_line.startswith(keyword) for keyword in ['if', 'for', 'while', 'def', 'class', 'try', 'with']) and 
                    '=' not in last_line and 
                    not last_line.startswith('#')):
                    try:
                        # Evaluate the last line as an expression
                        result = eval(last_line, global_dict, local_vars)
                    except Exception:
                        # If we can't evaluate directly, look for a result variable in local_vars
                        # Common pandas pattern: result = df.something()
                        if 'result' in local_vars:
                            result = local_vars['result']
                        else:
                            # Look for any pandas DataFrame or Series in the local variables
                            pd_vars = [(name, var) for name, var in local_vars.items() 
                                    if isinstance(var, (pd.DataFrame, pd.Series)) and name != '__builtins__']
                            
                            if pd_vars:
                                # If we found pandas objects, use the last one
                                result = pd_vars[-1][1]
                            else:
                                # Default to None if we can't determine a result
                                result = None
                else:
                    # For assignments or control structures, look for a result variable
                    if 'result' in local_vars:
                        result = local_vars['result']
                    else:
                        # Look for any pandas DataFrame or Series in the local variables
                        pd_vars = [(name, var) for name, var in local_vars.items() 
                                if isinstance(var, (pd.DataFrame, pd.Series)) and name != '__builtins__']
                        
                        if pd_vars:
                            # If we found pandas objects, use the last one
                            result = pd_vars[-1][1]
                        else:
                            # Default to None if we can't determine a result
                            result = None
            else:
                # For single expressions, use eval
                try:
                    result = eval(expression, global_dict, local_vars)
                except Exception as e:
                    # If direct evaluation fails, try to see if this is a chained operation
                    # that wasn't fully evaluated
                    if "groupby" in expression.lower():
                        # Handle expressions with groupby and aggregation in a special way
                        # Wrap it in an immediate execution context
                        try:
                            # Use exec with a result variable to capture the complete evaluation
                            exec_code = f"result = {expression}"
                            exec(exec_code, global_dict, local_vars)
                            if 'result' in local_vars:
                                result = local_vars['result']
                            else:
                                raise Exception(f"Failed to evaluate groupby expression: {str(e)}")
                        except Exception as groupby_err:
                            # If that still fails, give up and return the error
                            sys.stdout = sys.__stdout__
                            error_msg = f"Error evaluating groupby expression: {str(groupby_err)}\n{traceback.format_exc()}"
                            return {
                                "success": False,
                                "output": None,
                                "error": error_msg
                            }
                    else:
                        # For other types of errors, return the error directly
                        sys.stdout = sys.__stdout__
                        error_msg = f"Error evaluating expression: {str(e)}\n{traceback.format_exc()}"
                        return {
                            "success": False,
                            "output": None,
                            "error": error_msg
                        }
            
            # Handle pandas GroupBy objects directly to finalize the evaluation
            if str(type(result)).startswith("<class 'pandas.core.groupby"):
                try:
                    # Try to evaluate the complete operation by constructing a statement
                    # that forces execution of groupby + aggregation
                    if ".agg(" in expression or ".mean(" in expression or ".sum(" in expression or ".reset_index(" in expression:
                        # For expressions that already include aggregation, try to re-evaluate
                        # by wrapping in a result assignment
                        exec_code = f"result = {expression}"
                        try:
                            # Execute the code
                            exec(exec_code, global_dict, local_vars)
                            if 'result' in local_vars:
                                # Replace the groupby object with the evaluated result
                                result = local_vars['result']
                            else:
                                # Keep original result if no replacement found
                                pass
                        except Exception:
                            # If aggregation evaluation fails, keep the original result
                            pass
                    
                    # If we still have a GroupBy object, return a message 
                    if str(type(result)).startswith("<class 'pandas.core.groupby"):
                        return {
                            "success": True,
                            "output": {
                                "type": "groupby_object",
                                "message": "GroupBy object returned - use an aggregation function like .count(), .mean(), etc. to get results",
                                "data": str(result)
                            },
                            "error": None
                        }
                except Exception as e:
                    # If we encounter an error handling the GroupBy object, return the error
                    return {
                        "success": False,
                        "output": None,
                        "error": f"Error handling GroupBy object: {str(e)}\n{traceback.format_exc()}"
                    }
                
            # Reset stdout before handling serialization
            sys.stdout = sys.__stdout__
            
            # Define function for serializing values to ensure JSON compatibility
            def serialize_value(val):
                # Handle various data types for JSON serialization
                if isinstance(val, (np.integer, np.int64)):
                    return int(val)
                elif isinstance(val, (np.floating, np.float64)):
                    # Handle infinity and NaN values properly
                    if np.isnan(val) or np.isinf(val):
                        return None
                    return float(val)
                elif isinstance(val, (np.bool_)):
                    return bool(val)
                elif pd.isna(val):
                    return None
                elif isinstance(val, np.ndarray):
                    return [serialize_value(x) for x in val.tolist()]
                elif isinstance(val, (pd.Period, pd.Timestamp)):
                    return str(val)
                elif isinstance(val, (pd.Interval)):
                    return str(val)
                elif isinstance(val, (datetime.date, datetime.datetime)):
                    return str(val)
                elif isinstance(val, (tuple, list)):
                    return [serialize_value(x) for x in val]
                elif isinstance(val, dict):
                    return {str(k): serialize_value(v) for k, v in val.items()}
                elif isinstance(val, set):
                    return [serialize_value(x) for x in list(val)]
                elif isinstance(val, float):
                    # Handle Python native float infinity and NaN
                    if math.isnan(val) or math.isinf(val):
                        return None
                    return val
                # Handle any other complex types by converting to string
                elif hasattr(val, '__dict__') or not isinstance(val, (str, int, bool, type(None))):
                    return str(val)
                return val
            
            # Handle different result types
            if isinstance(result, pd.DataFrame):
                if result.empty:
                    return {
                        "success": True,
                        "output": {
                            "type": "dataframe",
                            "data": []
                        },
                        "error": None
                    }
                
                # Handle MultiIndex columns or index
                if isinstance(result.index, pd.MultiIndex) or isinstance(result.columns, pd.MultiIndex):
                    # Create a more structured representation for pivot tables
                    # This format will be easier to render in frontend tables
                    
                    # Get column hierarchy information
                    column_hierarchy = []
                    if isinstance(result.columns, pd.MultiIndex):
                        # Extract the levels from MultiIndex columns
                        for level_idx in range(result.columns.nlevels):
                            level_values = result.columns.get_level_values(level_idx).unique()
                            column_hierarchy.append({
                                "level": level_idx,
                                "name": str(result.columns.names[level_idx] or f"level_{level_idx}"),
                                "values": [str(val) for val in level_values]
                            })
                    else:
                        # Single level columns
                        column_hierarchy.append({
                            "level": 0,
                            "name": str(result.columns.name or "columns"),
                            "values": [str(col) for col in result.columns]
                        })
                    
                    # Get index hierarchy information
                    index_hierarchy = []
                    if isinstance(result.index, pd.MultiIndex):
                        # Extract the levels from MultiIndex index
                        for level_idx in range(result.index.nlevels):
                            level_values = result.index.get_level_values(level_idx).unique()
                            index_hierarchy.append({
                                "level": level_idx,
                                "name": str(result.index.names[level_idx] or f"level_{level_idx}"),
                                "values": [str(val) for val in level_values]
                            })
                    else:
                        # Single level index
                        index_hierarchy.append({
                            "level": 0,
                            "name": str(result.index.name or "index"),
                            "values": [str(idx) for idx in result.index]
                        })
                    
                    # Format 1: Convert to dictionary for JSON serialization (flattened version)
                    flat_df_dict = []
                    result_copy = result.copy()
                    
                    # Convert MultiIndex columns to strings
                    if isinstance(result.columns, pd.MultiIndex):
                        result_copy.columns = ['_'.join([str(col) for col in col_tuple]) 
                                          if isinstance(col_tuple, tuple) else str(col_tuple) 
                                          for col_tuple in result.columns]
                    
                    # Reset index to convert MultiIndex to columns
                    if isinstance(result.index, pd.MultiIndex):
                        result_copy = result_copy.reset_index()
                    else:
                        # For regular index, make it a column
                        result_copy = result_copy.reset_index()
                    
                    # Create the flattened records
                    for i in range(len(result_copy)):
                        row_dict = {}
                        for col in result_copy.columns:
                            try:
                                val = result_copy.iloc[i][col]
                                if isinstance(val, float) and (math.isnan(val) or math.isinf(val)):
                                    row_dict[str(col)] = None
                                else:
                                    row_dict[str(col)] = serialize_value(val)
                            except Exception:
                                row_dict[str(col)] = None
                        flat_df_dict.append(row_dict)
                    
                    # Format 2: Create a structured format that preserves the pivot table hierarchy
                    # First, reset the index to get all data as regular columns
                    structured_data_frame = result.reset_index()
                    
                    # Handle potential multi-level columns in the result
                    if isinstance(structured_data_frame.columns, pd.MultiIndex):
                        structured_data_frame.columns = [
                            '_'.join([str(col) for col in col_tuple]) 
                            if isinstance(col_tuple, tuple) else str(col_tuple) 
                            for col_tuple in structured_data_frame.columns
                        ]
                    
                    # Convert to records safely
                    structured_data = []
                    for _, row in structured_data_frame.iterrows():
                        row_dict = {}
                        for col in structured_data_frame.columns:
                            val = row[col]
                            # Ensure all keys are strings
                            row_dict[str(col)] = serialize_value(val)
                        structured_data.append(row_dict)
                    
                    # Format 3: Create a nested data structure
                    # Convert to a more complex but hierarchical structure
                    nested_data = {}
                    
                    if isinstance(result.index, pd.MultiIndex):
                        # For MultiIndex index, create a nested structure
                        for idx, row in result.iterrows():
                            current_level = nested_data
                            
                            # Navigate through the index levels
                            for i, idx_val in enumerate(idx[:-1] if isinstance(idx, tuple) else [idx]):
                                str_idx_val = str(idx_val)
                                if str_idx_val not in current_level:
                                    current_level[str_idx_val] = {}
                                current_level = current_level[str_idx_val]
                            
                            # Set the innermost level with the row data
                            last_idx = idx[-1] if isinstance(idx, tuple) else idx
                            current_level[str(last_idx)] = {
                                str(col): serialize_value(val) 
                                for col, val in row.items()
                            }
                    else:
                        # For regular index, create a simple structure
                        for idx, row in result.iterrows():
                            nested_data[str(idx)] = {
                                str(col): serialize_value(val) 
                                for col, val in row.items()
                            }
                    
                    # Return structured formats for flexibility in frontend rendering
                    return {
                        "success": True,
                        "output": {
                            "type": "pivot_table",
                            "data": {
                                "flat": flat_df_dict,             # Format 1: Flattened records
                                "structured": structured_data,    # Format 2: Structured records
                                "nested": nested_data,            # Format 3: Nested hierarchy
                            },
                            "metadata": {
                                "index_hierarchy": index_hierarchy,
                                "column_hierarchy": column_hierarchy,
                                "shape": list(result.shape),
                                "columns": [str(col) for col in result.columns],
                                "index": [str(idx) for idx in result.index]
                            }
                        },
                        "error": None
                    }
                else:
                    # Regular DataFrame
                    df_dict = []
                    for i in range(len(result)):
                        row_dict = {}
                        for col in result.columns:
                            try:
                                val = result.iloc[i][col]
                                # Additional check for NaN/inf values at the DataFrame level
                                if isinstance(val, float) and (math.isnan(val) or math.isinf(val)):
                                    row_dict[str(col)] = None
                                else:
                                    row_dict[str(col)] = serialize_value(val)
                            except Exception:
                                # If serialization fails, set to None
                                row_dict[str(col)] = None
                        df_dict.append(row_dict)
                    
                    return {
                        "success": True,
                        "output": {
                            "type": "dataframe",
                            "data": df_dict
                        },
                        "error": None
                    }
        
            elif isinstance(result, pd.Series):
                # Handle Series with proper serialization
                if result.empty:
                    return {
                        "success": True,
                        "output": {
                            "type": "series",
                            "data": {}
                        },
                        "error": None
                    }
                
                # Handle Series with MultiIndex
                if isinstance(result.index, pd.MultiIndex):
                    # Convert index to strings
                    result_dict = {}
                    for idx, val in result.items():
                        # Convert MultiIndex tuple to string
                        if isinstance(idx, tuple):
                            str_idx = '_'.join([str(i) for i in idx])
                        else:
                            str_idx = str(idx)
                        result_dict[str_idx] = serialize_value(val)
                
                    return {
                        "success": True,
                        "output": {
                            "type": "series",
                            "data": result_dict,
                            "note": "MultiIndex was flattened for JSON serialization"
                        },
                        "error": None
                    }
                else:
                    # Regular Series
                    series_dict = {}
                    for idx, val in result.items():
                        try:
                            # Additional check for NaN/inf values
                            if isinstance(val, float) and (math.isnan(val) or math.isinf(val)):
                                series_dict[str(idx)] = None
                            else:
                                series_dict[str(idx)] = serialize_value(val)
                        except Exception:
                            # If serialization fails, set to None
                            series_dict[str(idx)] = None
                    
                    return {
                        "success": True,
                        "output": {
                            "type": "series",
                            "data": series_dict
                        },
                        "error": None
                    }
        
            # Handle pandas Index objects
            elif isinstance(result, pd.Index):
                index_dict = {str(i): serialize_value(val) for i, val in enumerate(result)}
                
                return {
                    "success": True,
                    "output": {
                        "type": "index",
                        "data": index_dict
                    },
                    "error": None
                }
            
            # Handle pandas GroupBy objects by evaluating the full expression directly
            elif str(type(result)).startswith("<class 'pandas.core.groupby"):
                try:
                    # Try evaluating the full expression directly
                    full_result = eval(expression, global_dict, local_vars)
                    
                    # Return the serialized full result
                    if isinstance(full_result, pd.DataFrame):
                        # Use the DataFrame handling branch that's already defined below
                        if full_result.empty:
                            return {
                                "success": True,
                                "output": {
                                    "type": "dataframe",
                                    "data": []
                                },
                                "error": None
                            }
                        
                        # Create serialized data
                        df_dict = []
                        for i in range(len(full_result)):
                            row_dict = {}
                            for col in full_result.columns:
                                try:
                                    val = full_result.iloc[i][col]
                                    # Additional check for NaN/inf values at the DataFrame level
                                    if isinstance(val, float) and (math.isnan(val) or math.isinf(val)):
                                        row_dict[str(col)] = None
                                    else:
                                        row_dict[str(col)] = serialize_value(val)
                                except Exception:
                                    # If serialization fails, set to None
                                    row_dict[str(col)] = None
                        df_dict.append(row_dict)
                        
                        return {
                            "success": True,
                            "output": {
                                "type": "dataframe",
                                "data": df_dict
                            },
                            "error": None
                        }
                    elif isinstance(full_result, pd.Series):
                        # Use the Series handling branch
                        if full_result.empty:
                            return {
                                "success": True,
                                "output": {
                                    "type": "series",
                                    "data": {}
                                },
                                "error": None
                            }
                        
                        # Regular Series
                        series_dict = {}
                        for idx, val in full_result.items():
                            try:
                                # Additional check for NaN/inf values
                                if isinstance(val, float) and (math.isnan(val) or math.isinf(val)):
                                    series_dict[str(idx)] = None
                                else:
                                    series_dict[str(idx)] = serialize_value(val)
                            except Exception:
                                # If serialization fails, set to None
                                series_dict[str(idx)] = None
                        
                        return {
                            "success": True,
                            "output": {
                                "type": "series",
                                "data": series_dict
                            },
                            "error": None
                        }
                    else:
                        # Handle any other type
                        return {
                            "success": True,
                            "output": {
                                "type": "value",
                                "data": serialize_value(full_result)
                            },
                            "error": None
                        }
                except Exception as e:
                    return {
                        "success": False,
                        "output": None,
                        "error": f"Error evaluating GroupBy expression: {str(e)}\n{traceback.format_exc()}"
                    }
                
            # Handle other pandas objects or any other Python values
            else:
                return {
                    "success": True,
                    "output": {
                        "type": "value",
                        "data": serialize_value(result)
                    },
                    "error": None
                }

        except Exception:
            # Reset stdout
            sys.stdout = sys.__stdout__
            
            # Return detailed error message
            error_msg = traceback.format_exc()
            return {
                "success": False, 
                "output": None, 
                "error": error_msg
            }

    @classmethod
    def _handle_pandas_result(cls, result):
        # Define function for serializing values to ensure JSON compatibility
        def serialize_value(val):
            # Handle various data types for JSON serialization
            if isinstance(val, (np.integer, np.int64)):
                return int(val)
            elif isinstance(val, (np.floating, np.float64)):
                # Handle infinity and NaN values properly
                if np.isnan(val) or np.isinf(val):
                    return None
                return float(val)
            elif isinstance(val, (np.bool_)):
                return bool(val)
            elif pd.isna(val):
                return None
            elif isinstance(val, np.ndarray):
                return [serialize_value(x) for x in val.tolist()]
            elif isinstance(val, (pd.Period, pd.Timestamp)):
                return str(val)
            elif isinstance(val, (pd.Interval)):
                return str(val)
            elif isinstance(val, (datetime.date, datetime.datetime)):
                return str(val)
            elif isinstance(val, (tuple, list)):
                return [serialize_value(x) for x in val]
            elif isinstance(val, dict):
                return {str(k): serialize_value(v) for k, v in val.items()}
            elif isinstance(val, set):
                return [serialize_value(x) for x in list(val)]
            elif isinstance(val, float):
                # Handle Python native float infinity and NaN
                if math.isnan(val) or math.isinf(val):
                    return None
                return val
            # Handle any other complex types by converting to string
            elif hasattr(val, '__dict__') or not isinstance(val, (str, int, bool, type(None))):
                return str(val)
            return val
        
        # Handle different result types
        if isinstance(result, pd.DataFrame):
            if result.empty:
                return {
                    "success": True,
                    "output": {
                        "type": "dataframe",
                        "data": []
                    },
                    "error": None
                }
            
            # Handle MultiIndex columns or index
            if isinstance(result.index, pd.MultiIndex) or isinstance(result.columns, pd.MultiIndex):
                # Create a more structured representation for pivot tables
                # This format will be easier to render in frontend tables
                
                # Get column hierarchy information
                column_hierarchy = []
                if isinstance(result.columns, pd.MultiIndex):
                    # Extract the levels from MultiIndex columns
                    for level_idx in range(result.columns.nlevels):
                        level_values = result.columns.get_level_values(level_idx).unique()
                        column_hierarchy.append({
                            "level": level_idx,
                            "name": str(result.columns.names[level_idx] or f"level_{level_idx}"),
                            "values": [str(val) for val in level_values]
                        })
                else:
                    # Single level columns
                    column_hierarchy.append({
                        "level": 0,
                        "name": str(result.columns.name or "columns"),
                        "values": [str(col) for col in result.columns]
                    })
                
                # Get index hierarchy information
                index_hierarchy = []
                if isinstance(result.index, pd.MultiIndex):
                    # Extract the levels from MultiIndex index
                    for level_idx in range(result.index.nlevels):
                        level_values = result.index.get_level_values(level_idx).unique()
                        index_hierarchy.append({
                            "level": level_idx,
                            "name": str(result.index.names[level_idx] or f"level_{level_idx}"),
                            "values": [str(val) for val in level_values]
                        })
                else:
                    # Single level index
                    index_hierarchy.append({
                        "level": 0,
                        "name": str(result.index.name or "index"),
                        "values": [str(idx) for idx in result.index]
                    })
                
                # Format 1: Convert to dictionary for JSON serialization (flattened version)
                flat_df_dict = []
                result_copy = result.copy()
                
                # Convert MultiIndex columns to strings
                if isinstance(result.columns, pd.MultiIndex):
                    result_copy.columns = ['_'.join([str(col) for col in col_tuple]) 
                                      if isinstance(col_tuple, tuple) else str(col_tuple) 
                                      for col_tuple in result.columns]
                
                # Reset index to convert MultiIndex to columns
                if isinstance(result.index, pd.MultiIndex):
                    result_copy = result_copy.reset_index()
                else:
                    # For regular index, make it a column
                    result_copy = result_copy.reset_index()
                
                # Create the flattened records
                for i in range(len(result_copy)):
                    row_dict = {}
                    for col in result_copy.columns:
                        try:
                            val = result_copy.iloc[i][col]
                            if isinstance(val, float) and (math.isnan(val) or math.isinf(val)):
                                row_dict[str(col)] = None
                            else:
                                row_dict[str(col)] = serialize_value(val)
                        except Exception:
                            row_dict[str(col)] = None
                    flat_df_dict.append(row_dict)
                
                # Format 2: Create a structured format that preserves the pivot table hierarchy
                # First, reset the index to get all data as regular columns
                structured_data_frame = result.reset_index()
                
                # Handle potential multi-level columns in the result
                if isinstance(structured_data_frame.columns, pd.MultiIndex):
                    structured_data_frame.columns = [
                        '_'.join([str(col) for col in col_tuple]) 
                        if isinstance(col_tuple, tuple) else str(col_tuple) 
                        for col_tuple in structured_data_frame.columns
                    ]
                
                # Convert to records safely
                structured_data = []
                for _, row in structured_data_frame.iterrows():
                    row_dict = {}
                    for col in structured_data_frame.columns:
                        val = row[col]
                        # Ensure all keys are strings
                        row_dict[str(col)] = serialize_value(val)
                    structured_data.append(row_dict)
                
                # Format 3: Create a nested data structure
                # Convert to a more complex but hierarchical structure
                nested_data = {}
                
                if isinstance(result.index, pd.MultiIndex):
                    # For MultiIndex index, create a nested structure
                    for idx, row in result.iterrows():
                        current_level = nested_data
                        
                        # Navigate through the index levels
                        for i, idx_val in enumerate(idx[:-1] if isinstance(idx, tuple) else [idx]):
                            str_idx_val = str(idx_val)
                            if str_idx_val not in current_level:
                                current_level[str_idx_val] = {}
                            current_level = current_level[str_idx_val]
                        
                        # Set the innermost level with the row data
                        last_idx = idx[-1] if isinstance(idx, tuple) else idx
                        current_level[str(last_idx)] = {
                            str(col): serialize_value(val) 
                            for col, val in row.items()
                        }
                else:
                    # For regular index, create a simple structure
                    for idx, row in result.iterrows():
                        nested_data[str(idx)] = {
                            str(col): serialize_value(val) 
                            for col, val in row.items()
                        }
                
                # Return structured formats for flexibility in frontend rendering
                return {
                    "success": True,
                    "output": {
                        "type": "pivot_table",
                        "data": {
                            "flat": flat_df_dict,             # Format 1: Flattened records
                            "structured": structured_data,    # Format 2: Structured records
                            "nested": nested_data,            # Format 3: Nested hierarchy
                        },
                        "metadata": {
                            "index_hierarchy": index_hierarchy,
                            "column_hierarchy": column_hierarchy,
                            "shape": list(result.shape),
                            "columns": [str(col) for col in result.columns],
                            "index": [str(idx) for idx in result.index]
                        }
                    },
                    "error": None
                }
            else:
                # Regular DataFrame
                df_dict = []
                for i in range(len(result)):
                    row_dict = {}
                    for col in result.columns:
                        try:
                            val = result.iloc[i][col]
                            # Additional check for NaN/inf values at the DataFrame level
                            if isinstance(val, float) and (math.isnan(val) or math.isinf(val)):
                                row_dict[str(col)] = None
                            else:
                                row_dict[str(col)] = serialize_value(val)
                        except Exception:
                            # If serialization fails, set to None
                            row_dict[str(col)] = None
                    df_dict.append(row_dict)
                
                return {
                    "success": True,
                    "output": {
                        "type": "dataframe",
                        "data": df_dict
                    },
                    "error": None
                }
        
        elif isinstance(result, pd.Series):
            # Handle Series with proper serialization
            if result.empty:
                return {
                    "success": True,
                    "output": {
                        "type": "series",
                        "data": {}
                    },
                    "error": None
                }
            
            # Handle Series with MultiIndex
            if isinstance(result.index, pd.MultiIndex):
                # Convert index to strings
                result_dict = {}
                for idx, val in result.items():
                    # Convert MultiIndex tuple to string
                    if isinstance(idx, tuple):
                        str_idx = '_'.join([str(i) for i in idx])
                    else:
                        str_idx = str(idx)
                    result_dict[str_idx] = serialize_value(val)
                
                return {
                    "success": True,
                    "output": {
                        "type": "series",
                        "data": result_dict,
                        "note": "MultiIndex was flattened for JSON serialization"
                    },
                    "error": None
                }
            else:
                # Regular Series
                series_dict = {}
                for idx, val in result.items():
                    try:
                        # Additional check for NaN/inf values
                        if isinstance(val, float) and (math.isnan(val) or math.isinf(val)):
                            series_dict[str(idx)] = None
                        else:
                            series_dict[str(idx)] = serialize_value(val)
                    except Exception:
                        # If serialization fails, set to None
                        series_dict[str(idx)] = None
                
                return {
                    "success": True,
                    "output": {
                        "type": "series",
                        "data": series_dict
                    },
                    "error": None
                }
        
        # Handle pandas Index objects
        elif isinstance(result, pd.Index):
            index_dict = {str(i): serialize_value(val) for i, val in enumerate(result)}
            
            return {
                "success": True,
                "output": {
                    "type": "index",
                    "data": index_dict
                },
                "error": None
            }
        
        # Handle other pandas objects or any other Python values
        else:
            return {
                "success": True,
                "output": {
                    "type": "value",
                    "data": serialize_value(result)
                },
                "error": None
            }

    @classmethod
    def execute_query(cls, query: str, database: str, connection=None):
        """
        Execute SQL query and return the result

        Args:
            query: SQL query string
            database: Database name to connect to
            connection: Database connection object (optional)

        Returns:
            Dict containing execution results or error message
        """
        try:
            conn = connection or cls._connect_to_db(database)
            if not conn:
                return {
                    "success": False,
                    "output": None,
                    "error": "Could not establish database connection"
                }

            # Configure pandas to not decode binary data by using object dtype
            # This prevents the UnicodeDecodeError when dealing with binary data like photos
            df = pd.read_sql_query(
                query, 
                conn,
                dtype=object  # Use object dtype to prevent automatic decoding
            )

            if not connection:
                conn.close()

            return {
                "success": True,
                "output": df.to_dict(orient='records'),
                "error": None
            }

        except Exception:
            error_msg = traceback.format_exc()

            lines = error_msg.split('\n')
            error_msg = (
                "Traceback (most recent call last):\n"
                '  File "pandas/io/sql.py", in execute\n'
                "    cur.execute(sql, *args)\n"
            )
            error_msg += next(line for line in lines if 'sqlite3.OperationalError' in line)

            return {
                "success": False,
                "output": None,
                "error": error_msg
            }

    @classmethod
    def _connect_to_db(cls, database: str):
        """Create database connection to northwind.db"""
        try:
            db_urls = {
                "northwind": "https://github.com/nauqh/csautograde/blob/master/northwind.db?raw=true",
                "chinook": "https://github.com/nauqh/cspyclient/blob/master/db/chinook.db?raw=true"
            }

            if database in db_urls:
                response = requests.get(db_urls[database])
                with open(database, "wb") as file:
                    file.write(response.content)
                return sqlite3.connect(database)
            return None
        except Exception:
            cls.printt("Database connection error")
            return None

    @classmethod
    def serialize_value(cls, val):
        if isinstance(val, (np.integer, np.int64)):
            return int(val)
        elif isinstance(val, (np.floating, np.float64)):
            # Handle infinity and NaN values properly
            if np.isnan(val) or np.isinf(val):
                return None
            return float(val)
        elif isinstance(val, (np.bool_)):
            return bool(val)
        elif pd.isna(val):
            return None
        elif isinstance(val, np.ndarray):
            return [cls.serialize_value(x) for x in val.tolist()]
        elif isinstance(val, (pd.Period, pd.Timestamp)):
            return str(val)
        elif isinstance(val, (pd.Interval)):
            return str(val)
        elif isinstance(val, (datetime.date, datetime.datetime)):
            return str(val)
        elif isinstance(val, (tuple, list)):
            return [cls.serialize_value(x) for x in val]
        elif isinstance(val, dict):
            return {str(k): cls.serialize_value(v) for k, v in val.items()}
        elif isinstance(val, set):
            return [cls.serialize_value(x) for x in list(val)]
        elif isinstance(val, float):
            # Handle Python native float infinity and NaN
            if math.isnan(val) or math.isinf(val):
                return None
            return val
        return val
