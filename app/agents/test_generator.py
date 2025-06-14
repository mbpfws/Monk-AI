from typing import Dict, Any, List
import os
import re
import time
from datetime import datetime
from openai import OpenAI
from anthropic import Anthropic

class TestGenerator:
    """Advanced Test Generator with coverage estimation and quality metrics."""
    
    def __init__(self):
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        
        # Test coverage analysis weights
        self.coverage_weights = {
            "function_coverage": 0.3,
            "branch_coverage": 0.25,
            "line_coverage": 0.2,
            "edge_case_coverage": 0.15,
            "integration_coverage": 0.1
        }
        
        # Test quality metrics for demo
        self.test_stats = {
            "total_tests_generated": 15847,
            "code_coverage_achieved": "89.4%",
            "bugs_caught_in_testing": 3247,
            "avg_test_generation_time": "4.2 minutes",
            "test_suite_reliability": "94.7%"
        }
        
        # Test framework configurations
        self.test_frameworks = {
            "python": {
                "unittest": {"imports": ["unittest"], "test_pattern": "test_*.py"},
                "pytest": {"imports": ["pytest"], "test_pattern": "test_*.py"},
                "nose2": {"imports": ["nose2"], "test_pattern": "*_test.py"}
            },
            "javascript": {
                "jest": {"imports": ["jest"], "test_pattern": "*.test.js"},
                "mocha": {"imports": ["mocha", "chai"], "test_pattern": "*.spec.js"},
                "vitest": {"imports": ["vitest"], "test_pattern": "*.test.ts"}
            },
            "java": {
                "junit": {"imports": ["org.junit.jupiter.api.*"], "test_pattern": "*Test.java"},
                "testng": {"imports": ["org.testng.*"], "test_pattern": "*Test.java"}
            }
        }

    async def generate_tests(self, code: str, language: str, test_framework: str) -> Dict[str, Any]:
        """
        Generate comprehensive test cases with coverage estimation and quality metrics.
        """
        start_time = time.time()
        
        try:
            # Analyze code for test generation with coverage estimation
            code_analysis = await self._analyze_code_for_tests(code, language)
            
            # Estimate current and potential coverage
            coverage_analysis = self._estimate_test_coverage(code, language, code_analysis)
            
            # Generate comprehensive test cases
            test_cases = await self._generate_test_cases(code_analysis, test_framework, coverage_analysis)
            
            # Calculate test quality metrics
            quality_metrics = self._calculate_test_quality(test_cases, coverage_analysis)
            
            # Generate test strategy recommendations
            test_strategy = self._generate_test_strategy(code_analysis, coverage_analysis, language)
            
            generation_time = time.time() - start_time
            
            return {
                "status": "success",
                "message": "Comprehensive test suite generated with coverage analysis",
                "generation_timestamp": datetime.now().isoformat(),
                "generation_time_mins": round(generation_time / 60, 2),
                "code_analysis": code_analysis,
                "coverage_analysis": coverage_analysis,
                "quality_metrics": quality_metrics,
                "test_strategy": test_strategy,
                "tests": {
                    "unit_tests": test_cases["unit_tests"],
                    "integration_tests": test_cases["integration_tests"],
                    "edge_cases": test_cases["edge_cases"],
                    "performance_tests": test_cases.get("performance_tests", []),
                    "security_tests": test_cases.get("security_tests", []),
                    "setup_code": test_cases["setup_code"],
                    "teardown_code": test_cases.get("teardown_code", ""),
                    "mock_configurations": test_cases.get("mock_configurations", [])
                },
                "recommendations": {
                    "priority_tests": quality_metrics["priority_tests"],
                    "coverage_gaps": coverage_analysis["coverage_gaps"],
                    "test_framework_config": self._get_framework_config(language, test_framework),
                    "estimated_execution_time": f"{coverage_analysis['estimated_test_count'] * 0.5:.1f} seconds"
                }
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Error generating tests: {str(e)}",
                "generation_timestamp": datetime.now().isoformat()
            }
    
    def _estimate_test_coverage(self, code: str, language: str, code_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Estimate test coverage metrics and potential improvements."""
        functions = code_analysis.get("functions", [])
        classes = code_analysis.get("classes", [])
        branches = code_analysis.get("conditional_statements", 0)
        lines_of_code = len([line for line in code.splitlines() if line.strip() and not line.strip().startswith('#')])
        
        # Calculate theoretical maximum coverage
        function_coverage_potential = len(functions) * 3  # Unit + integration + edge case tests
        branch_coverage_potential = branches * 2  # True/false paths
        line_coverage_potential = lines_of_code
        
        # Estimate current coverage (if tests exist)
        existing_test_coverage = self._analyze_existing_tests(code)
        
        # Calculate coverage scores
        estimated_function_coverage = min(95, (function_coverage_potential * 0.8))
        estimated_branch_coverage = min(90, (branch_coverage_potential * 0.75))
        estimated_line_coverage = min(92, (line_coverage_potential * 0.85))
        
        # Overall coverage estimation
        overall_coverage = (
            estimated_function_coverage * self.coverage_weights["function_coverage"] +
            estimated_branch_coverage * self.coverage_weights["branch_coverage"] +
            estimated_line_coverage * self.coverage_weights["line_coverage"]
        )
        
        # Identify coverage gaps
        coverage_gaps = []
        if estimated_function_coverage < 80:
            coverage_gaps.append("Insufficient function coverage")
        if estimated_branch_coverage < 75:
            coverage_gaps.append("Missing branch coverage")
        if branches > 0 and estimated_branch_coverage < 70:
            coverage_gaps.append("Complex conditional logic needs testing")
        if not any("test" in func.lower() for func in [f.get("name", "") for f in functions]):
            coverage_gaps.append("No existing test functions detected")
        
        return {
            "estimated_overall_coverage": round(overall_coverage, 1),
            "coverage_breakdown": {
                "function_coverage": round(estimated_function_coverage, 1),
                "branch_coverage": round(estimated_branch_coverage, 1),
                "line_coverage": round(estimated_line_coverage, 1),
                "edge_case_coverage": 65.0,  # Conservative estimate
                "integration_coverage": 45.0   # Often lower
            },
            "coverage_gaps": coverage_gaps,
            "improvement_potential": {
                "max_achievable_coverage": 95.0,
                "effort_required": "Medium" if overall_coverage > 70 else "High",
                "estimated_test_count": len(functions) * 4 + branches * 2 + max(5, len(classes) * 3)
            },
            "existing_test_analysis": existing_test_coverage,
            "recommendations": [
                "Focus on testing critical business logic functions",
                "Add edge case testing for input validation",
                "Implement integration tests for external dependencies",
                "Consider property-based testing for complex algorithms"
            ]
        }
    
    def _analyze_existing_tests(self, code: str) -> Dict[str, Any]:
        """Analyze existing test code to understand current coverage."""
        test_patterns = [
            r'def test_\w+', r'function test\w+', r'it\([\'"].*[\'"]',
            r'@Test', r'@pytest\.mark', r'describe\([\'"].*[\'"]'
        ]
        
        existing_tests = 0
        for pattern in test_patterns:
            existing_tests += len(re.findall(pattern, code, re.IGNORECASE))
        
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
        has_mocks = bool(re.search(r'mock|stub|fake|spy', code, re.IGNORECASE))
        has_fixtures = bool(re.search(r'fixture|setup|teardown', code, re.IGNORECASE))
        has_assertions = bool(re.search(r'assert|expect|should', code, re.IGNORECASE))
        
        return {
            "existing_test_count": existing_tests,
            "has_mocking": has_mocks,
            "has_fixtures": has_fixtures,
            "has_assertions": has_assertions,
            "test_sophistication": "High" if has_mocks and has_fixtures else "Medium" if has_assertions else "Low"
        }
    
    def _calculate_test_quality(self, test_cases: Dict[str, Any], coverage_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate test quality metrics and recommendations."""
        unit_test_count = len(test_cases.get("unit_tests", []))
        integration_test_count = len(test_cases.get("integration_tests", []))
        edge_case_count = len(test_cases.get("edge_cases", []))
        
        total_tests = unit_test_count + integration_test_count + edge_case_count
        
        # Calculate quality score
        coverage_score = coverage_analysis["estimated_overall_coverage"]
        test_diversity_score = min(100, (unit_test_count * 2 + integration_test_count * 3 + edge_case_count * 4))
        
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
        quality_score = (coverage_score * 0.6 + test_diversity_score * 0.4)
        
        # Determine quality grade
        if quality_score >= 90:
            grade, level = "A", "Excellent"
        elif quality_score >= 80:
            grade, level = "B", "Good"
        elif quality_score >= 70:
            grade, level = "C", "Adequate"
        elif quality_score >= 60:
            grade, level = "D", "Needs Improvement"
        else:
            grade, level = "F", "Poor"
        
        # Identify priority tests
        priority_tests = []
        if unit_test_count < 5:
            priority_tests.append("Add more unit tests for core functions")
        if integration_test_count < 2:
            priority_tests.append("Create integration tests for external dependencies")
        if edge_case_count < 3:
            priority_tests.append("Implement edge case testing for input validation")
        
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
        return {
            "overall_quality_score": round(quality_score, 1),
            "quality_grade": grade,
            "quality_level": level,
            "test_distribution": {
                "unit_tests": unit_test_count,
                "integration_tests": integration_test_count,
                "edge_cases": edge_case_count,
                "total_tests": total_tests
            },
            "priority_tests": priority_tests,
            "strengths": [
                "Comprehensive unit test coverage" if unit_test_count > 5 else None,
                "Good integration testing" if integration_test_count > 2 else None,
                "Thorough edge case coverage" if edge_case_count > 3 else None
            ],
            "areas_for_improvement": [
                "Increase unit test coverage" if unit_test_count < 5 else None,
                "Add integration tests" if integration_test_count < 2 else None,
                "Improve edge case testing" if edge_case_count < 3 else None
            ]
        }
    
    def _generate_test_strategy(self, code_analysis: Dict[str, Any], coverage_analysis: Dict[str, Any], language: str) -> Dict[str, Any]:
        """Generate comprehensive test strategy recommendations."""
        functions = code_analysis.get("functions", [])
        classes = code_analysis.get("classes", [])
        complexity = code_analysis.get("complexity_score", 50)
        
        # Determine testing approach based on code characteristics
        if complexity > 80:
            approach = "Risk-based testing with focus on critical paths"
            priority = "High"
        elif complexity > 50:
            approach = "Balanced testing with good coverage"
            priority = "Medium"
        else:
            approach = "Standard testing practices"
            priority = "Low"
        
        # Generate specific recommendations
        recommendations = []
        if len(functions) > 10:
            recommendations.append("Use parameterized tests to reduce duplication")
        if len(classes) > 5:
            recommendations.append("Implement test fixtures for class instantiation")
        if "api" in str(code_analysis).lower() or "request" in str(code_analysis).lower():
            recommendations.append("Add API contract testing")
        if "database" in str(code_analysis).lower() or "db" in str(code_analysis).lower():
            recommendations.append("Use database transactions for test isolation")
        
        return {
            "approach": approach,
            "priority": priority,
            "testing_pyramid": {
                "unit_tests": "70%",
                "integration_tests": "20%",
                "e2e_tests": "10%"
            },
            "recommended_tools": self._get_recommended_tools(language),
            "test_execution_strategy": {
                "parallel_execution": len(functions) > 15,
                "test_grouping": "By feature" if len(classes) > 3 else "By type",
                "ci_cd_integration": True,
                "performance_testing": complexity > 60
            },
            "specific_recommendations": recommendations,
            "estimated_timeline": {
                "setup_time": "2-4 hours",
                "test_writing": f"{max(8, len(functions) * 1.5)} hours",
                "maintenance_overhead": "15% of development time"
            }
        }
    
    def _get_recommended_tools(self, language: str) -> List[str]:
        """Get recommended testing tools for the language."""
        tool_recommendations = {
            "python": ["pytest", "coverage.py", "factory_boy", "responses", "freezegun"],
            "javascript": ["jest", "testing-library", "cypress", "nock", "sinon"],
            "java": ["junit5", "mockito", "testcontainers", "wiremock", "jacoco"],
            "csharp": ["nunit", "moq", "autofixture", "fluentassertions"],
            "go": ["testify", "ginkgo", "gomega", "httptest"],
            "ruby": ["rspec", "factory_bot", "vcr", "capybara"]
        }
        
        return tool_recommendations.get(language.lower(), ["language-specific testing framework"])
    
    def _get_framework_config(self, language: str, framework: str) -> Dict[str, Any]:
        """Get configuration for the specified test framework."""
        return self.test_frameworks.get(language.lower(), {}).get(framework.lower(), {
            "imports": [f"{framework} testing framework"],
            "test_pattern": "test_*.{ext}".format(ext=self._get_file_extension(language))
        })
    
    def _get_file_extension(self, language: str) -> str:
        """Get file extension for the language."""
        extensions = {
            "python": "py",
            "javascript": "js",
            "typescript": "ts",
            "java": "java",
            "csharp": "cs",
            "go": "go",
            "ruby": "rb"
        }
        return extensions.get(language.lower(), "txt")

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