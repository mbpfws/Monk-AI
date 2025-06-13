from typing import List, Dict, Any
import os
import re
import requests
from openai import OpenAI
from anthropic import Anthropic

class PRReviewer:
    def __init__(self):
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    async def review_pr(self, pr_url: str, repository: str, branch: str = "main") -> Dict[str, Any]:
        """
        Review a pull request and provide suggestions for improvements.
        """
        try:
            # TODO: Fetch PR details using GitHub API
            pr_details = await self._fetch_pr_details(pr_url)
            
            # Analyze code changes
            code_analysis = await self._analyze_code_changes(pr_details)
            
            # Generate review comments
            review_comments = await self._generate_review_comments(code_analysis)
            
            return {
                "status": "success",
                "review": {
                    "summary": review_comments["summary"],
                    "suggestions": review_comments["suggestions"],
                    "security_issues": review_comments["security_issues"],
                    "performance_issues": review_comments["performance_issues"]
                }
            }
        except Exception as e:
            raise Exception(f"Error reviewing PR: {str(e)}")

    async def _fetch_pr_details(self, pr_url: str) -> Dict[str, Any]:
        """
        Fetch PR details from GitHub API.
        """
        # Parse PR URL to extract owner, repo, and PR number
        # Expected format: https://github.com/{owner}/{repo}/pull/{number}
        pattern = r"https://github\.com/([^/]+)/([^/]+)/pull/(\d+)"
        match = re.match(pattern, pr_url)
        
        if not match:
            raise ValueError(f"Invalid GitHub PR URL: {pr_url}")
            
        owner, repo, pr_number = match.groups()
        
        # GitHub API endpoints
        api_base = "https://api.github.com"
        pr_endpoint = f"{api_base}/repos/{owner}/{repo}/pulls/{pr_number}"
        files_endpoint = f"{api_base}/repos/{owner}/{repo}/pulls/{pr_number}/files"
        
        # Set up headers with GitHub token if available
        headers = {}
        github_token = os.getenv("GITHUB_TOKEN")
        if github_token:
            headers["Authorization"] = f"token {github_token}"
        
        # Fetch PR details
        pr_response = requests.get(pr_endpoint, headers=headers)
        if pr_response.status_code != 200:
            raise Exception(f"Failed to fetch PR details: {pr_response.status_code} {pr_response.text}")
            
        pr_data = pr_response.json()
        
        # Fetch PR files
        files_response = requests.get(files_endpoint, headers=headers)
        if files_response.status_code != 200:
            raise Exception(f"Failed to fetch PR files: {files_response.status_code} {files_response.text}")
            
        files_data = files_response.json()
        
        # Construct diff content
        diff_content = ""
        for file in files_data:
            diff_content += f"File: {file['filename']}\n"
            diff_content += f"Status: {file['status']}\n"
            diff_content += f"Changes: +{file['additions']} -{file['deletions']}\n"
            diff_content += f"Patch:\n{file.get('patch', 'No patch available')}\n\n"
        
        return {
            "title": pr_data["title"],
            "description": pr_data["body"] or "",
            "author": pr_data["user"]["login"],
            "branch": pr_data["head"]["ref"],
            "base_branch": pr_data["base"]["ref"],
            "diff": diff_content,
            "files_changed": [file["filename"] for file in files_data],
            "url": pr_url
        }

    async def _analyze_code_changes(self, pr_details: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze code changes using AI models.
        """
        # Use Claude for code analysis
        analysis_prompt = f"""
        Analyze the following code changes and provide detailed feedback:
        {pr_details.get('diff', '')}
        
        Focus on:
        1. Code quality and best practices
        2. Potential bugs or issues
        3. Security concerns
        4. Performance implications
        5. Documentation needs
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
            "raw_changes": pr_details.get('diff', '')
        }

    async def _generate_review_comments(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate review comments based on code analysis.
        """
        # Use GPT-4 for generating review comments
        review_prompt = f"""
        Based on the following code analysis, generate a structured PR review:
        {analysis['analysis']}
        
        Format the review as:
        1. Summary of changes
        2. Specific suggestions for improvement
        3. Security concerns
        4. Performance considerations
        """
        
        response = await self.openai_client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{
                "role": "user",
                "content": review_prompt
            }],
            temperature=0.7
        )
        
        # Parse the response content
        content = response.choices[0].message.content
        
        # Extract different sections from the response
        suggestions = self._extract_suggestions(content)
        security_issues = self._extract_security_issues(content)
        performance_issues = self._extract_performance_issues(content)
        
        return {
            "summary": content,
            "suggestions": suggestions,
            "security_issues": security_issues,
            "performance_issues": performance_issues
        }
    
    def _extract_suggestions(self, content: str) -> List[Dict[str, str]]:
        """Extract suggestions for improvement from the review content."""
        suggestions = []
        
        # Look for sections that might contain suggestions
        suggestion_patterns = [
            r"(?:Specific suggestions for improvement|Suggestions|Improvements):[\s\S]*?(?=\n\d+\.|$)",
            r"\d+\.\s+([^\n]+)(?:[\s\S]*?)(?=\d+\.|$)"
        ]
        
        for pattern in suggestion_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                # Clean up the suggestion text
                suggestion_text = match.strip()
                if suggestion_text and len(suggestion_text) > 10:  # Avoid empty or very short matches
                    # Try to identify the file it relates to
                    file_match = re.search(r"(?:in|file|path)\s+['\"]?([\w\./]+\.[\w]+)['\"]?", suggestion_text)
                    file_path = file_match.group(1) if file_match else ""
                    
                    suggestions.append({
                        "text": suggestion_text,
                        "file": file_path,
                        "type": "improvement"
                    })
        
        return suggestions
    
    def _extract_security_issues(self, content: str) -> List[Dict[str, str]]:
        """Extract security issues from the review content."""
        security_issues = []
        
        # Look for sections that might contain security issues
        security_patterns = [
            r"(?:Security concerns|Security issues|Security vulnerabilities):[\s\S]*?(?=\n\d+\.|$)",
            r"(?:security|vulnerability|exploit|injection|XSS|CSRF|authentication|authorization|encryption)([^\n.]+\.[^\n]+)"
        ]
        
        for pattern in security_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                # Clean up the issue text
                issue_text = match.strip()
                if issue_text and len(issue_text) > 10:  # Avoid empty or very short matches
                    # Try to identify the file it relates to
                    file_match = re.search(r"(?:in|file|path)\s+['\"]?([\w\./]+\.[\w]+)['\"]?", issue_text)
                    file_path = file_match.group(1) if file_match else ""
                    
                    security_issues.append({
                        "text": issue_text,
                        "file": file_path,
                        "severity": self._determine_severity(issue_text)
                    })
        
        return security_issues
    
    def _extract_performance_issues(self, content: str) -> List[Dict[str, str]]:
        """Extract performance issues from the review content."""
        performance_issues = []
        
        # Look for sections that might contain performance issues
        performance_patterns = [
            r"(?:Performance considerations|Performance issues|Performance optimizations):[\s\S]*?(?=\n\d+\.|$)",
            r"(?:performance|slow|optimization|efficient|complexity|O\([^)]+\)|memory|CPU|resource)([^\n.]+\.[^\n]+)"
        ]
        
        for pattern in performance_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                # Clean up the issue text
                issue_text = match.strip()
                if issue_text and len(issue_text) > 10:  # Avoid empty or very short matches
                    # Try to identify the file it relates to
                    file_match = re.search(r"(?:in|file|path)\s+['\"](\w\./]+\.[\w]+)['\"]?", issue_text)
                    file_path = file_match.group(1) if file_match else ""
                    
                    performance_issues.append({
                        "text": issue_text,
                        "file": file_path,
                        "impact": self._determine_impact(issue_text)
                    })
        
        return performance_issues
    
    def _determine_severity(self, text: str) -> str:
        """Determine the severity of a security issue based on its description."""
        high_keywords = ["critical", "severe", "high", "major", "important", "vulnerability", "exploit", "injection", "authentication"]
        medium_keywords = ["moderate", "medium", "warning", "potential", "possible"]
        
        text_lower = text.lower()
        
        for keyword in high_keywords:
            if keyword in text_lower:
                return "high"
                
        for keyword in medium_keywords:
            if keyword in text_lower:
                return "medium"
                
        return "low"
    
    def _determine_impact(self, text: str) -> str:
        """Determine the impact of a performance issue based on its description."""
        high_keywords = ["significant", "severe", "high", "major", "critical", "O(n²)", "O(n³)", "exponential"]
        medium_keywords = ["moderate", "medium", "noticeable", "O(n log n)", "could be improved"]
        
        text_lower = text.lower()
        
        for keyword in high_keywords:
            if keyword in text_lower:
                return "high"
                
        for keyword in medium_keywords:
            if keyword in text_lower:
                return "medium"
                
        return "low"