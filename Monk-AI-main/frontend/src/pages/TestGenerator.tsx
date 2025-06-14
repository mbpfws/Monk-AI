import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

interface TestResult {
  unit_tests: Array<{
    name: string;
    description: string;
    code: string;
  }>;
  integration_tests: Array<{
    name: string;
    description: string;
    code: string;
  }>;
  edge_cases: Array<{
    name: string;
    description: string;
    code: string;
  }>;
  setup_code: string;
}

const languages = [
  'python',
  'javascript',
  'typescript',
  'java',
  'csharp',
  'go',
  'rust',
];

const testFrameworks = {
  python: ['pytest', 'unittest'],
  javascript: ['jest', 'mocha', 'jasmine'],
  typescript: ['jest', 'mocha', 'jasmine'],
  java: ['junit', 'testng'],
  csharp: ['nunit', 'xunit', 'mstest'],
  go: ['testing'],
  rust: ['rust-test'],
};

const TestGenerator = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [testFramework, setTestFramework] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/api/generate-tests', {
        code,
        language,
        test_framework: testFramework,
      });

      setResult(response.data.tests);
    } catch (err) {
      setError('Failed to generate tests. Please try again.');
      console.error('Error generating tests:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Test Generator
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Generate comprehensive test cases for your code.
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Programming Language</InputLabel>
              <Select
                value={language}
                label="Programming Language"
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setTestFramework(testFrameworks[e.target.value as keyof typeof testFrameworks][0]);
                }}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Test Framework</InputLabel>
              <Select
                value={testFramework}
                label="Test Framework"
                onChange={(e) => setTestFramework(e.target.value)}
              >
                {testFrameworks[language as keyof typeof testFrameworks].map((framework) => (
                  <MenuItem key={framework} value={framework}>
                    {framework}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              margin="normal"
              required
              multiline
              rows={10}
              placeholder="Paste your code here..."
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Tests'}
            </Button>
          </form>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Paper sx={{ p: 3 }}>
            {result.setup_code && (
              <>
                <Typography variant="h6" gutterBottom>
                  Test Setup
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    my: 1,
                    bgcolor: 'grey.900',
                    fontFamily: 'monospace',
                  }}
                >
                  <Typography component="pre" sx={{ m: 0 }}>
                    {result.setup_code}
                  </Typography>
                </Paper>
              </>
            )}

            {result.unit_tests.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Unit Tests
                </Typography>
                {result.unit_tests.map((test, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {test.name}
                    </Typography>
                    <Typography paragraph>{test.description}</Typography>
                    <Paper
                      sx={{
                        p: 2,
                        my: 1,
                        bgcolor: 'grey.900',
                        fontFamily: 'monospace',
                      }}
                    >
                      <Typography component="pre" sx={{ m: 0 }}>
                        {test.code}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </>
            )}

            {result.integration_tests.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Integration Tests
                </Typography>
                {result.integration_tests.map((test, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {test.name}
                    </Typography>
                    <Typography paragraph>{test.description}</Typography>
                    <Paper
                      sx={{
                        p: 2,
                        my: 1,
                        bgcolor: 'grey.900',
                        fontFamily: 'monospace',
                      }}
                    >
                      <Typography component="pre" sx={{ m: 0 }}>
                        {test.code}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </>
            )}

            {result.edge_cases.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Edge Cases
                </Typography>
                {result.edge_cases.map((test, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {test.name}
                    </Typography>
                    <Typography paragraph>{test.description}</Typography>
                    <Paper
                      sx={{
                        p: 2,
                        my: 1,
                        bgcolor: 'grey.900',
                        fontFamily: 'monospace',
                      }}
                    >
                      <Typography component="pre" sx={{ m: 0 }}>
                        {test.code}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </>
            )}
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default TestGenerator; 