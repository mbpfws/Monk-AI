import re
import os
import json
import asyncio
from typing import Dict, List, Any, Optional, Tuple

class CodeOptimizer:
    """Agent for analyzing code and providing optimization suggestions."""
    
    def __init__(self):
        """Initialize the CodeOptimizer agent."""
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
        self.novita_api_key = os.getenv("NOVITA_API_KEY")
        
        # Optimization categories
        self.categories = [
            "performance",
            "memory_usage",
            "code_quality",
            "algorithm_complexity",
            "resource_utilization"
        ]
    
    async def optimize_code(self, code: str, language: str, focus_areas: Optional[List[str]] = None) -> Dict[str, Any]:
        """Analyze code and provide optimization suggestions.
        
        Args:
            code: The source code to analyze
            language: The programming language of the code
            focus_areas: Optional list of specific optimization areas to focus on
            
        Returns:
            Dictionary containing optimization suggestions
        """
        # If no specific focus areas provided, analyze all categories
        if not focus_areas:
            focus_areas = self.categories
            
        # Generate the prompt for the AI
        prompt = self._generate_optimization_prompt(code, language, focus_areas)
        
        # Get optimization suggestions from AI
        optimization_content = await self._get_ai_suggestions(prompt, language)
        
        # Parse the AI response
        result = self._parse_optimization_response(optimization_content)
        
        return {
            "status": "success",
            "message": "Code optimization analysis completed",
            "optimizations": result
        }
    
    def _generate_optimization_prompt(self, code: str, language: str, focus_areas: List[str]) -> str:
        """Generate a prompt for the AI to analyze code for optimization opportunities.
        
        Args:
            code: The source code to analyze
            language: The programming language of the code
            focus_areas: List of optimization areas to focus on
            
        Returns:
            A formatted prompt string
        """
        focus_areas_str = ", ".join(focus_areas)
        
        prompt = f"""Analyze the following {language} code and provide detailed optimization suggestions. 
        Focus on these areas: {focus_areas_str}.
        
        For each suggestion:
        1. Identify the specific code section that can be optimized
        2. Explain why it's suboptimal
        3. Provide a specific, implementable improvement
        4. Quantify the expected benefit where possible
        
        Format your response with clear sections for each optimization category.
        Include code examples for before and after implementation.
        
        CODE TO ANALYZE:
        ```{language}
        {code}
        ```
        """
        
        return prompt
    
    async def _get_ai_suggestions(self, prompt: str, language: str) -> str:
        """Get optimization suggestions from AI model.
        
        Args:
            prompt: The prompt to send to the AI
            language: The programming language (used to determine best model)
            
        Returns:
            The AI-generated optimization suggestions
        """
        # TODO: Implement actual API calls to OpenAI/Anthropic/Novita
        # For now, return a mock response for testing
        
        # Mock response for testing
        mock_response = f"""# Code Optimization Analysis

## Performance Optimizations

### 1. Inefficient Loop Structure

**Original Code:**
```{language}
# Example inefficient code section
result = []
for i in range(len(data)):
    result.append(data[i] * 2)
```

**Suggested Optimization:**
```{language}
# Use list comprehension instead
result = [item * 2 for item in data]
```

**Benefit:** Approximately 30% faster execution time for large datasets. List comprehensions are optimized at the C level in Python.

## Memory Usage Optimizations

### 1. Unnecessary Data Duplication

**Original Code:**
```{language}
# Creating duplicate data
full_data = original_data.copy()
processed = process_data(full_data)
```

**Suggested Optimization:**
```{language}
# Process data in-place when possible
processed = process_data(original_data)
```

**Benefit:** Reduces memory usage by avoiding duplicate data structures, especially important for large datasets.

## Code Quality Improvements

### 1. Complex Conditional Logic

**Original Code:**
```{language}
if condition1 and condition2 and (condition3 or (condition4 and condition5)):
    # Complex nested logic
```

**Suggested Optimization:**
```{language}
# Break down complex conditions
if condition1 and condition2:
    if condition3 or (condition4 and condition5):
        # Clearer logic flow
```

**Benefit:** Improved readability and maintainability, easier debugging and testing.
"""
        
        return mock_response
    
    def _parse_optimization_response(self, content: str) -> Dict[str, Any]:
        """Parse the AI-generated optimization response into structured data.
        
        Args:
            content: The AI-generated optimization content
            
        Returns:
            Structured optimization suggestions
        """
        result = {
            "summary": "",
            "performance_optimizations": [],
            "memory_optimizations": [],
            "code_quality_improvements": [],
            "algorithm_improvements": [],
            "resource_optimizations": []
        }
        
        # Extract summary (first paragraph)
        summary_match = re.search(r'^(.*?)\n\n', content, re.DOTALL)
        if summary_match:
            result["summary"] = summary_match.group(1).strip()
        
        # Extract performance optimizations
        result["performance_optimizations"] = self._extract_optimizations(
            content, r'## Performance Optimizations\n\n(.*?)(?:\n##|$)', 'performance'
        )
        
        # Extract memory optimizations
        result["memory_optimizations"] = self._extract_optimizations(
            content, r'## Memory Usage Optimizations\n\n(.*?)(?:\n##|$)', 'memory'
        )
        
        # Extract code quality improvements
        result["code_quality_improvements"] = self._extract_optimizations(
            content, r'## Code Quality Improvements\n\n(.*?)(?:\n##|$)', 'quality'
        )
        
        # Extract algorithm improvements
        result["algorithm_improvements"] = self._extract_optimizations(
            content, r'## Algorithm Complexity\n\n(.*?)(?:\n##|$)', 'algorithm'
        )
        
        # Extract resource optimizations
        result["resource_optimizations"] = self._extract_optimizations(
            content, r'## Resource Utilization\n\n(.*?)(?:\n##|$)', 'resource'
        )
        
        return result
    
    def _extract_optimizations(self, content: str, pattern: str, category: str) -> List[Dict[str, str]]:
        """Extract optimization suggestions for a specific category.
        
        Args:
            content: The AI-generated content
            pattern: Regex pattern to extract the category section
            category: The optimization category name
            
        Returns:
            List of optimization suggestions for the category
        """
        optimizations = []
        
        # Extract the section for this category
        section_match = re.search(pattern, content, re.DOTALL)
        if not section_match:
            return optimizations
            
        section_content = section_match.group(1)
        
        # Extract individual optimization items
        optimization_items = re.split(r'### \d+\.\s+', section_content)
        if optimization_items and not optimization_items[0].strip():
            optimization_items = optimization_items[1:]
            
        for item in optimization_items:
            if not item.strip():
                continue
                
            optimization = {
                "title": "",
                "description": "",
                "original_code": "",
                "optimized_code": "",
                "benefit": "",
                "category": category
            }
            
            # Extract title
            title_match = re.match(r'^([^\n]+)', item)
            if title_match:
                optimization["title"] = title_match.group(1).strip()
                
            # Extract original code
            original_code_match = re.search(r'\*\*Original Code:\*\*\s*```[^\n]*\n(.+?)```', item, re.DOTALL)
            if original_code_match:
                optimization["original_code"] = original_code_match.group(1).strip()
                
            # Extract optimized code
            optimized_code_match = re.search(r'\*\*Suggested Optimization:\*\*\s*```[^\n]*\n(.+?)```', item, re.DOTALL)
            if optimized_code_match:
                optimization["optimized_code"] = optimized_code_match.group(1).strip()
                
            # Extract benefit
            benefit_match = re.search(r'\*\*Benefit:\*\*\s*([^\n]+)', item)
            if benefit_match:
                optimization["benefit"] = benefit_match.group(1).strip()
                
            # Extract description (everything between title and Original Code)
            description_match = re.search(r'^[^\n]+\n\n(.*?)\n\n\*\*Original Code:', item, re.DOTALL)
            if description_match:
                optimization["description"] = description_match.group(1).strip()
            else:
                # If no description found between title and Original Code, use everything before Original Code
                description_match = re.search(r'^[^\n]+\n\n(.*?)\*\*Original Code:', item, re.DOTALL)
                if description_match:
                    optimization["description"] = description_match.group(1).strip()
            
            optimizations.append(optimization)
            
        return optimizations