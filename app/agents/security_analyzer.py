import re
import os
import json
import asyncio
from typing import Dict, List, Any, Optional, Tuple

class SecurityAnalyzer:
    """Agent for analyzing code for security vulnerabilities and providing remediation suggestions."""
    
    def __init__(self):
        """Initialize the SecurityAnalyzer agent."""
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
        self.novita_api_key = os.getenv("NOVITA_API_KEY")
        
        # Security vulnerability categories
        self.categories = [
            "injection",
            "authentication",
            "data_exposure",
            "xxe",
            "access_control",
            "security_misconfig",
            "xss",
            "insecure_deserialization",
            "vulnerable_components",
            "insufficient_logging"
        ]
        
        # Severity levels
        self.severity_levels = ["critical", "high", "medium", "low", "info"]
    
    async def analyze_security(self, code: str, language: str, focus_areas: Optional[List[str]] = None) -> Dict[str, Any]:
        """Analyze code for security vulnerabilities.
        
        Args:
            code: The source code to analyze
            language: The programming language of the code
            focus_areas: Optional list of specific security areas to focus on
            
        Returns:
            Dictionary containing security analysis results
        """
        # If no specific focus areas provided, analyze all categories
        if not focus_areas:
            focus_areas = self.categories
            
        # Generate the prompt for the AI
        prompt = self._generate_security_prompt(code, language, focus_areas)
        
        # Get security analysis from AI
        security_content = await self._get_ai_analysis(prompt, language)
        
        # Parse the AI response
        result = self._parse_security_response(security_content)
        
        return {
            "status": "success",
            "message": "Security analysis completed",
            "security_analysis": result
        }
    
    def _generate_security_prompt(self, code: str, language: str, focus_areas: List[str]) -> str:
        """Generate a prompt for the AI to analyze code for security vulnerabilities.
        
        Args:
            code: The source code to analyze
            language: The programming language of the code
            focus_areas: List of security areas to focus on
            
        Returns:
            A formatted prompt string
        """
        focus_areas_str = ", ".join(focus_areas)
        
        prompt = f"""Analyze the following {language} code for security vulnerabilities. 
        Focus on these security areas: {focus_areas_str}.
        
        For each vulnerability found:
        1. Identify the specific code section that is vulnerable
        2. Explain the vulnerability and its potential impact
        3. Assign a severity level (critical, high, medium, low, info)
        4. Provide specific remediation steps
        5. Include a code example showing the fix
        
        Format your response with clear sections for each vulnerability category.
        Include line numbers where possible to help locate the issues.
        
        CODE TO ANALYZE:
        ```{language}
        {code}
        ```
        """
        
        return prompt
    
    async def _get_ai_analysis(self, prompt: str, language: str) -> str:
        """Get security analysis from AI model.
        
        Args:
            prompt: The prompt to send to the AI
            language: The programming language (used to determine best model)
            
        Returns:
            The AI-generated security analysis
        """
        # TODO: Implement actual API calls to OpenAI/Anthropic/Novita
        # For now, return a mock response for testing
        
        # Mock response for testing
        mock_response = f"""# Security Analysis Report

## Summary
The code was analyzed for security vulnerabilities. Several issues were identified with varying severity levels. The most critical issues involve SQL injection, improper authentication, and sensitive data exposure.

## Injection Vulnerabilities

### 1. SQL Injection in User Input

**Vulnerable Code (Lines 45-47):**
```{language}
# User input is directly concatenated into SQL query
query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'"
results = database.execute(query)
```

**Severity:** Critical

**Impact:** An attacker could inject malicious SQL code to bypass authentication, extract sensitive data, or delete database contents.

**Remediation:**
- Use parameterized queries or prepared statements
- Never concatenate user input directly into queries

**Secure Code Example:**
```{language}
# Using parameterized query
query = "SELECT * FROM users WHERE username = ? AND password = ?"
results = database.execute(query, (username, password))
```

## Authentication Issues

### 1. Weak Password Storage

**Vulnerable Code (Lines 78-80):**
```{language}
# Password is stored in plaintext
new_user = {
    "username": username,
    "password": password
}
database.users.insert(new_user)
```

**Severity:** High

**Impact:** If the database is compromised, all user passwords would be exposed in plaintext, potentially affecting users' accounts on other services if they reuse passwords.

**Remediation:**
- Use strong, salted password hashing (bcrypt, Argon2, etc.)
- Never store plaintext passwords

**Secure Code Example:**
```{language}
# Using bcrypt for password hashing
import bcrypt

# Generate salt and hash password
salt = bcrypt.gensalt()
hashed_password = bcrypt.hashpw(password.encode(), salt)

new_user = {
    "username": username,
    "password": hashed_password
}
database.users.insert(new_user)
```

## Data Exposure

### 1. Sensitive Information in Logs

**Vulnerable Code (Line 112):**
```{language}
logger.info(f"User {username} authenticated with password {password}")
```

**Severity:** High

**Impact:** Passwords and other sensitive information are written to log files, which might be accessible to unauthorized personnel or exposed in case of a breach.

**Remediation:**
- Never log sensitive information like passwords, tokens, or personal data
- Implement proper log sanitization

**Secure Code Example:**
```{language}
logger.info(f"User {username} authenticated successfully")
```
"""
        
        return mock_response
    
    def _parse_security_response(self, content: str) -> Dict[str, Any]:
        """Parse the AI-generated security analysis into structured data.
        
        Args:
            content: The AI-generated security content
            
        Returns:
            Structured security analysis
        """
        result = {
            "summary": "",
            "vulnerabilities": [],
            "total_issues": 0,
            "severity_counts": {
                "critical": 0,
                "high": 0,
                "medium": 0,
                "low": 0,
                "info": 0
            }
        }
        
        # Extract summary
        summary_match = re.search(r'## Summary\n(.+?)\n\n', content, re.DOTALL)
        if summary_match:
            result["summary"] = summary_match.group(1).strip()
        
        # Extract vulnerability categories
        category_sections = re.findall(r'## ([\w\s]+)\n\n(.+?)(?=\n## |$)', content, re.DOTALL)
        
        for category_name, category_content in category_sections:
            # Skip the summary section as we've already processed it
            if category_name.lower() == "summary":
                continue
                
            # Extract individual vulnerabilities
            vulnerabilities = re.split(r'### \d+\.\s+', category_content)
            if vulnerabilities and not vulnerabilities[0].strip():
                vulnerabilities = vulnerabilities[1:]
                
            for vuln in vulnerabilities:
                if not vuln.strip():
                    continue
                    
                vulnerability = {
                    "title": "",
                    "category": category_name.strip(),
                    "vulnerable_code": "",
                    "severity": "",
                    "impact": "",
                    "remediation": "",
                    "secure_code": "",
                    "line_numbers": []
                }
                
                # Extract title
                title_match = re.match(r'^([^\n]+)', vuln)
                if title_match:
                    vulnerability["title"] = title_match.group(1).strip()
                
                # Extract vulnerable code
                code_match = re.search(r'\*\*Vulnerable Code(?:\s*\(Lines\s+([\d\-,\s]+)\))?:\*\*\s*```[^\n]*\n(.+?)```', vuln, re.DOTALL)
                if code_match:
                    line_info = code_match.group(1)
                    vulnerability["vulnerable_code"] = code_match.group(2).strip()
                    
                    # Extract line numbers if available
                    if line_info:
                        # Parse line numbers (e.g., "45-47" or "112" or "45, 47, 50")
                        line_numbers = []
                        for part in line_info.split(','):
                            part = part.strip()
                            if '-' in part:
                                start, end = map(int, part.split('-'))
                                line_numbers.extend(range(start, end + 1))
                            else:
                                line_numbers.append(int(part))
                        vulnerability["line_numbers"] = line_numbers
                
                # Extract severity
                severity_match = re.search(r'\*\*Severity:\*\*\s*([^\n]+)', vuln)
                if severity_match:
                    severity = severity_match.group(1).strip().lower()
                    vulnerability["severity"] = severity
                    # Increment severity count
                    if severity in result["severity_counts"]:
                        result["severity_counts"][severity] += 1
                
                # Extract impact
                impact_match = re.search(r'\*\*Impact:\*\*\s*([^\n]+(?:\n[^\n*]+)*)', vuln)
                if impact_match:
                    vulnerability["impact"] = impact_match.group(1).strip()
                
                # Extract remediation
                remediation_match = re.search(r'\*\*Remediation:\*\*\s*(.+?)(?=\*\*Secure Code Example:|$)', vuln, re.DOTALL)
                if remediation_match:
                    # Extract bullet points if present
                    remediation_text = remediation_match.group(1).strip()
                    remediation_items = re.findall(r'^-\s*(.+)$', remediation_text, re.MULTILINE)
                    
                    if remediation_items:
                        vulnerability["remediation"] = remediation_items
                    else:
                        vulnerability["remediation"] = [remediation_text]
                
                # Extract secure code example
                secure_code_match = re.search(r'\*\*Secure Code Example:\*\*\s*```[^\n]*\n(.+?)```', vuln, re.DOTALL)
                if secure_code_match:
                    vulnerability["secure_code"] = secure_code_match.group(1).strip()
                
                result["vulnerabilities"].append(vulnerability)
        
        # Update total issues count
        result["total_issues"] = len(result["vulnerabilities"])
        
        return result
    
    def _determine_cwe_category(self, vulnerability_title: str, category: str) -> str:
        """Map the vulnerability to a CWE (Common Weakness Enumeration) category.
        
        Args:
            vulnerability_title: The title of the vulnerability
            category: The general category of the vulnerability
            
        Returns:
            The CWE identifier and name
        """
        # This is a simplified mapping - in a real implementation, this would be more comprehensive
        cwe_mapping = {
            "sql injection": "CWE-89: SQL Injection",
            "command injection": "CWE-77: Command Injection",
            "xss": "CWE-79: Cross-site Scripting",
            "csrf": "CWE-352: Cross-Site Request Forgery",
            "open redirect": "CWE-601: URL Redirection to Untrusted Site",
            "path traversal": "CWE-22: Path Traversal",
            "file inclusion": "CWE-98: File Inclusion",
            "weak password": "CWE-521: Weak Password Requirements",
            "plaintext password": "CWE-256: Plaintext Storage of Password",
            "hardcoded credential": "CWE-798: Hardcoded Credentials",
            "sensitive data exposure": "CWE-200: Information Exposure",
            "missing encryption": "CWE-311: Missing Encryption",
            "insecure deserialization": "CWE-502: Deserialization of Untrusted Data",
            "xxe": "CWE-611: XML External Entity Reference",
            "security misconfiguration": "CWE-1004: Security Misconfiguration",
            "missing authentication": "CWE-306: Missing Authentication",
            "broken authentication": "CWE-287: Improper Authentication",
            "broken access control": "CWE-284: Improper Access Control",
            "insufficient logging": "CWE-778: Insufficient Logging"
        }
        
        # Try to match based on the title (case insensitive)
        title_lower = vulnerability_title.lower()
        for key, cwe in cwe_mapping.items():
            if key in title_lower:
                return cwe
        
        # If no match in title, try to match based on category
        category_lower = category.lower()
        if "injection" in category_lower:
            return "CWE-74: Injection"
        elif "authentication" in category_lower:
            return "CWE-287: Improper Authentication"
        elif "data exposure" in category_lower:
            return "CWE-200: Information Exposure"
        elif "xxe" in category_lower:
            return "CWE-611: XML External Entity Reference"
        elif "access control" in category_lower:
            return "CWE-284: Improper Access Control"
        elif "security misconfig" in category_lower:
            return "CWE-1004: Security Misconfiguration"
        elif "xss" in category_lower:
            return "CWE-79: Cross-site Scripting"
        elif "insecure deserialization" in category_lower:
            return "CWE-502: Deserialization of Untrusted Data"
        elif "vulnerable component" in category_lower:
            return "CWE-1104: Use of Unmaintained Third Party Components"
        elif "logging" in category_lower:
            return "CWE-778: Insufficient Logging"
        
        # Default if no match found
        return "CWE-0: Unknown"