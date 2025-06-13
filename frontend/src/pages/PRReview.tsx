import React from 'react';
import { Typography, Box } from '@mui/material';

const PRReview: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4">PR Review</Typography>
      <Typography variant="body1" paragraph>
        Automatically review pull requests and get AI-powered improvement suggestions.
      </Typography>
    </Box>
  );
};

export default PRReview; 