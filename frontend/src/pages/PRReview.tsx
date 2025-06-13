import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

interface ReviewResult {
  summary: string;
  suggestions: string[];
  security_issues: string[];
  performance_issues: string[];
}

const PRReview = () => {
  const [prUrl, setPrUrl] = useState('');
  const [repository, setRepository] = useState('');
  const [branch, setBranch] = useState('main');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReviewResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/api/review-pr', {
        pr_url: prUrl,
        repository,
        branch,
      });

      setResult(response.data.review);
    } catch (err) {
      setError('Failed to review PR. Please try again.');
      console.error('Error reviewing PR:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          PR Review
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Enter the details of the pull request you want to review.
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="PR URL"
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              margin="normal"
              required
              placeholder="https://github.com/username/repo/pull/123"
            />
            <TextField
              fullWidth
              label="Repository"
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              margin="normal"
              required
              placeholder="username/repo"
            />
            <TextField
              fullWidth
              label="Branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              margin="normal"
              placeholder="main"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Review PR'}
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
              Review Summary
            </Typography>
            <Typography paragraph>{result.summary}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Suggestions
            </Typography>
            <ul>
              {result.suggestions.map((suggestion, index) => (
                <li key={index}>
                  <Typography>{suggestion}</Typography>
                </li>
              ))}
            </ul>

            {result.security_issues.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom color="error">
                  Security Issues
                </Typography>
                <ul>
                  {result.security_issues.map((issue, index) => (
                    <li key={index}>
                      <Typography color="error">{issue}</Typography>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {result.performance_issues.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom color="warning.main">
                  Performance Issues
                </Typography>
                <ul>
                  {result.performance_issues.map((issue, index) => (
                    <li key={index}>
                      <Typography color="warning.main">{issue}</Typography>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default PRReview; 