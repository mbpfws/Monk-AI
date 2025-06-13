import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';

interface DocumentationResult {
  overview: string;
  functions: Array<{
    name: string;
    description: string;
    parameters: Array<{
      name: string;
      type: string;
      description: string;
    }>;
    returns: string;
    examples: string[];
  }>;
  classes: Array<{
    name: string;
    description: string;
    methods: Array<{
      name: string;
      description: string;
      parameters: Array<{
        name: string;
        type: string;
        description: string;
      }>;
      returns: string;
    }>;
  }>;
  examples: string[];
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

const DocGenerator: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DocumentationResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/api/generate-docs', {
        code,
        language,
        context: context || undefined,
      });

      setResult(response.data.documentation);
    } catch (err) {
      setError('Failed to generate documentation. Please try again.');
      console.error('Error generating documentation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Documentation Generator
        </Typography>
        <Typography variant="body1" paragraph>
          Generate comprehensive documentation for your code.
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Programming Language</InputLabel>
              <Select
                value={language}
                label="Programming Language"
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
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

            <TextField
              fullWidth
              label="Additional Context (Optional)"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              margin="normal"
              multiline
              rows={3}
              placeholder="Provide any additional context about the code..."
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Documentation'}
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
            <Typography variant="h6" gutterBottom>
              Overview
            </Typography>
            <Typography paragraph>{result.overview}</Typography>

            {result.functions.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Functions
                </Typography>
                {result.functions.map((func, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {func.name}
                    </Typography>
                    <Typography paragraph>{func.description}</Typography>

                    {func.parameters.length > 0 && (
                      <>
                        <Typography variant="subtitle2">Parameters:</Typography>
                        <ul>
                          {func.parameters.map((param, pIndex) => (
                            <li key={pIndex}>
                              <Typography>
                                <strong>{param.name}</strong> ({param.type}): {param.description}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    <Typography variant="subtitle2">Returns:</Typography>
                    <Typography paragraph>{func.returns}</Typography>

                    {func.examples.length > 0 && (
                      <>
                        <Typography variant="subtitle2">Examples:</Typography>
                        {func.examples.map((example, eIndex) => (
                          <Paper
                            key={eIndex}
                            sx={{
                              p: 2,
                              my: 1,
                              bgcolor: 'grey.900',
                              fontFamily: 'monospace',
                            }}
                          >
                            <Typography component="pre" sx={{ m: 0 }}>
                              {example}
                            </Typography>
                          </Paper>
                        ))}
                      </>
                    )}
                  </Box>
                ))}
              </>
            )}

            {result.classes.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Classes
                </Typography>
                {result.classes.map((cls, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {cls.name}
                    </Typography>
                    <Typography paragraph>{cls.description}</Typography>

                    {cls.methods.length > 0 && (
                      <>
                        <Typography variant="subtitle2">Methods:</Typography>
                        {cls.methods.map((method, mIndex) => (
                          <Box key={mIndex} sx={{ ml: 2, mb: 2 }}>
                            <Typography variant="subtitle2">
                              {method.name}
                            </Typography>
                            <Typography paragraph>{method.description}</Typography>

                            {method.parameters.length > 0 && (
                              <>
                                <Typography variant="subtitle2">Parameters:</Typography>
                                <ul>
                                  {method.parameters.map((param, pIndex) => (
                                    <li key={pIndex}>
                                      <Typography>
                                        <strong>{param.name}</strong> ({param.type}): {param.description}
                                      </Typography>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}

                            <Typography variant="subtitle2">Returns:</Typography>
                            <Typography paragraph>{method.returns}</Typography>
                          </Box>
                        ))}
                      </>
                    )}
                  </Box>
                ))}
              </>
            )}

            {result.examples.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Usage Examples
                </Typography>
                {result.examples.map((example, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      my: 1,
                      bgcolor: 'grey.900',
                      fontFamily: 'monospace',
                    }}
                  >
                    <Typography component="pre" sx={{ m: 0 }}>
                      {example}
                    </Typography>
                  </Paper>
                ))}
              </>
            )}
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default DocGenerator; 