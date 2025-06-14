from typing import Dict, Any, List
import os
from openai import OpenAI
from anthropic import Anthropic
import re

class TestGenerator:
    def __init__(self):
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    async def generate_tests(self, code: str, language: str, test_framework: str) -> Dict[str, Any]:
        """
        Generate test cases for the provided code.
        """
        try:
            # Analyze code for test generation
            code_analysis = await self._analyze_code_for_tests(code, language)
            
            # Generate test cases
            test_cases = await self._generate_test_cases(code_analysis, test_framework)
            
            return {
                "status": "success",
                "tests": {
                    "unit_tests": test_cases["unit_tests"],
                    "integration_tests": test_cases["integration_tests"],
                    "edge_cases": test_cases["edge_cases"],
                    "setup_code": test_cases["setup_code"]
                }
            }
        except Exception as e:
            raise Exception(f"Error generating tests: {str(e)}")

    async def _analyze_code_for_tests(self, code: str, language: str) -> Dict[str, Any]:
        """
        Analyze code to identify testable components and scenarios.
        """
        # Use Claude for code analysis
        analysis_prompt = f"""
        Analyze the following {language} code to identify:
        1. Functions and methods that need testing
        2. Input parameters and their types
        3. Expected outputs and edge cases
        4. Dependencies and mocking requirements
        5. Integration points
        
        Code:
        {code}
        """
        
        response = await self.anthropic_client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=1000,
            messages=[{
                "role": "user",
                "content": analysis_prompt
            }]
        )
        
        return {
            "analysis": response.content,
            "raw_code": code
        }

    async def _generate_test_cases(self, analysis: Dict[str, Any], test_framework: str) -> Dict[str, Any]:
        """
        Generate test cases based on code analysis.
        """
        # Use GPT-4 for test generation
        test_prompt = f"""
        Generate comprehensive test cases using {test_framework} based on the following code analysis:
        {analysis['analysis']}
        
        Include:
        1. Unit tests for each function/method
        2. Integration tests for component interactions
        3. Edge cases and error conditions
        4. Test setup and teardown code
        5. Mocking instructions for dependencies
        """
        
        response = await self.openai_client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{
                "role": "user",
                "content": test_prompt
            }],
            temperature=0.7
        )
        
        # Parse the response into structured test cases
        test_content = response.choices[0].message.content
        
        # Parse the response content
        content = response.choices[0].message.content
        
        # Extract different sections from the response
        unit_tests = self._extract_unit_tests(content)
        integration_tests = self._extract_integration_tests(content)
        edge_cases = self._extract_edge_cases(content)
        setup_code = self._extract_setup_code(content)
        
        return {
            "unit_tests": unit_tests,
            "integration_tests": integration_tests,
            "edge_cases": edge_cases,
            "setup_code": setup_code
        }
    
    def _extract_unit_tests(self, content: str) -> List[Dict[str, str]]:
        """Extract unit tests from the generated content."""
        unit_tests = []
        
        # Look for unit test sections
        unit_test_patterns = [
            r"###\s*(?:Unit Tests|Unit Test)\s*([\s\S]*?)(?=###|##|$)",
            r"(?:Unit Tests|Unit Test):\s*([\s\S]*?)(?=Integration Tests|Edge Cases|Setup|$)"
        ]
        
        unit_test_content = ""
        for pattern in unit_test_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                unit_test_content = match.group(1).strip()
                break
        
        if unit_test_content:
            # Extract individual test functions
            test_function_pattern = r"```\w*\s*def\s+(test_[\w_]+)\s*\(([^)]*)\):[\s\S]*?```"
            test_matches = re.finditer(test_function_pattern, unit_test_content)
            
            for match in test_matches:
                test_name = match.group(1).strip()
                test_params = match.group(2).strip()
                test_code = match.group(0).strip()
                
                # Try to extract the test description from comments
                description_match = re.search(r'"""([\s\S]*?)"""|\'\'\'([\s\S]*?)\'\'\'|#\s*(.*)', test_code)
                description = ""
                if description_match:
                    if description_match.group(1):
                        description = description_match.group(1).strip()
                    elif description_match.group(2):
                        description = description_match.group(2).strip()
                    elif description_match.group(3):
                        description = description_match.group(3).strip()
                
                unit_tests.append({
                    "name": test_name,
                    "code": test_code,
                    "description": description,
                    "function_under_test": self._extract_function_under_test(test_name, test_code)
                })
        
        return unit_tests
    
    def _extract_integration_tests(self, content: str) -> List[Dict[str, str]]:
        """Extract integration tests from the generated content."""
        integration_tests = []
        
        # Look for integration test sections
        integration_test_patterns = [
            r"###\s*(?:Integration Tests|Integration Test)\s*([\s\S]*?)(?=###|##|$)",
            r"(?:Integration Tests|Integration Test):\s*([\s\S]*?)(?=Unit Tests|Edge Cases|Setup|$)"
        ]
        
        integration_test_content = ""
        for pattern in integration_test_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                integration_test_content = match.group(1).strip()
                break
        
        if integration_test_content:
            # Extract individual test functions
            test_function_pattern = r"```\w*\s*def\s+(test_[\w_]+)\s*\(([^)]*)\):[\s\S]*?```"
            test_matches = re.finditer(test_function_pattern, integration_test_content)
            
            for match in test_matches:
                test_name = match.group(1).strip()
                test_params = match.group(2).strip()
                test_code = match.group(0).strip()
                
                # Try to extract the test description from comments
                description_match = re.search(r'"""([\s\S]*?)"""|\'\'\'([\s\S]*?)\'\'\'|#\s*(.*)', test_code)
                description = ""
                if description_match:
                    if description_match.group(1):
                        description = description_match.group(1).strip()
                    elif description_match.group(2):
                        description = description_match.group(2).strip()
                    elif description_match.group(3):
                        description = description_match.group(3).strip()
                
                integration_tests.append({
                    "name": test_name,
                    "code": test_code,
                    "description": description,
                    "components_tested": self._extract_components_tested(test_code)
                })
        
        return integration_tests
    
    def _extract_edge_cases(self, content: str) -> List[Dict[str, str]]:
        """Extract edge case tests from the generated content."""
        edge_cases = []
        
        # Look for edge case sections
        edge_case_patterns = [
            r"###\s*(?:Edge Cases|Edge Case Tests)\s*([\s\S]*?)(?=###|##|$)",
            r"(?:Edge Cases|Edge Case Tests):\s*([\s\S]*?)(?=Unit Tests|Integration Tests|Setup|$)"
        ]
        
        edge_case_content = ""
        for pattern in edge_case_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                edge_case_content = match.group(1).strip()
                break
        
        if edge_case_content:
            # Extract individual test functions
            test_function_pattern = r"```\w*\s*def\s+(test_[\w_]+)\s*\(([^)]*)\):[\s\S]*?```"
            test_matches = re.finditer(test_function_pattern, edge_case_content)
            
            for match in test_matches:
                test_name = match.group(1).strip()
                test_params = match.group(2).strip()
                test_code = match.group(0).strip()
                
                # Try to extract the test description from comments
                description_match = re.search(r'"""([\s\S]*?)"""|\'\'\'([\s\S]*?)\'\'\'|#\s*(.*)', test_code)
                description = ""
                if description_match:
                    if description_match.group(1):
                        description = description_match.group(1).strip()
                    elif description_match.group(2):
                        description = description_match.group(2).strip()
                    elif description_match.group(3):
                        description = description_match.group(3).strip()
                
                # Try to identify the edge case being tested
                edge_case_type = ""
                if "null" in test_name.lower() or "none" in test_name.lower():
                    edge_case_type = "null_input"
                elif "empty" in test_name.lower():
                    edge_case_type = "empty_input"
                elif "invalid" in test_name.lower():
                    edge_case_type = "invalid_input"
                elif "boundary" in test_name.lower() or "limit" in test_name.lower():
                    edge_case_type = "boundary_value"
                elif "exception" in test_name.lower() or "error" in test_name.lower():
                    edge_case_type = "exception_handling"
                else:
                    edge_case_type = "other"
                
                edge_cases.append({
                    "name": test_name,
                    "code": test_code,
                    "description": description,
                    "edge_case_type": edge_case_type
                })
        
        return edge_cases
    
    def _extract_setup_code(self, content: str) -> str:
        """Extract setup code from the generated content."""
        # Look for setup code sections
        setup_patterns = [
            r"###\s*(?:Setup|Test Setup|Setup Code)\s*([\s\S]*?)(?=###|##|$)",
            r"(?:Setup|Test Setup|Setup Code):\s*([\s\S]*?)(?=Unit Tests|Integration Tests|Edge Cases|$)",
            r"```\w*\s*(?:import|from|class\s+[\w_]+TestCase|@pytest\.fixture)([\s\S]*?)```"
        ]
        
        for pattern in setup_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                setup_code = match.group(1).strip()
                if setup_code:
                    # Clean up the setup code if it's wrapped in a code block
                    if setup_code.startswith('```') and setup_code.endswith('```'):
                        setup_code = re.sub(r'^```\w*\s*|```$', '', setup_code).strip()
                    return setup_code
        
        # If no specific setup section found, look for imports and fixtures at the beginning
        first_code_block = re.search(r"```\w*\s*([\s\S]*?)```", content)
        if first_code_block:
            code = first_code_block.group(1).strip()
            # Check if it contains imports or fixtures
            if re.search(r"^(?:import|from|@pytest\.fixture|class\s+[\w_]+TestCase)", code, re.MULTILINE):
                return code
        
        return ""
    
    def _extract_function_under_test(self, test_name: str, test_code: str) -> str:
        """Extract the name of the function being tested."""
        # Try to extract from the test name (common naming convention: test_function_name)
        if test_name.startswith('test_'):
            function_name = test_name[5:]  # Remove 'test_'
            # Remove any additional test descriptors
            function_name = re.sub(r'_when_.*$|_with_.*$|_should_.*$', '', function_name)
            return function_name
        
        # Try to find function calls in the test code
        function_calls = re.findall(r'\b([a-z][\w_]*)\(', test_code)
        if function_calls:
            # Filter out common test assertion functions
            test_functions = ['assertEqual', 'assertTrue', 'assertFalse', 'assertRaises', 'assert_', 'setup', 'teardown']
            for func in function_calls:
                if func not in test_functions and not func.startswith('assert') and not func.startswith('test_'):
                    return func
        
        return ""
    
    def _extract_components_tested(self, test_code: str) -> List[str]:
        """Extract the components being tested in an integration test."""
        components = []
        
        # Look for class instantiations
        class_pattern = r'([A-Z][\w_]*)\('
        class_matches = re.findall(class_pattern, test_code)
        if class_matches:
            components.extend(class_matches)
        
        # Look for import statements to identify modules
        import_pattern = r'(?:from|import)\s+([\w_.]+)'
        import_matches = re.findall(import_pattern, test_code)
        if import_matches:
            for module in import_matches:
                if module not in ['unittest', 'pytest', 'mock', 'patch', 'assert', 'test']:
                    components.append(module)
        
        return list(set(components))  # Remove duplicates

    def _parse_test_cases(self, test_content: str) -> Dict[str, Any]:
        """
        Parse the generated test content into structured test cases.
        """
        # TODO: Implement test case parsing logic
        return {
            "unit_tests": [],
            "integration_tests": [],
            "edge_cases": [],
            "setup_code": ""
        }