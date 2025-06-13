import React from 'react';
import { Typography, Box, Card, CardContent, Grid } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, pt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Monk AI
      </Typography>
      <Typography variant="body1" paragraph>
        Your intelligent assistant for development workflows.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">PR Review</Typography>
              <Typography variant="body2">
                Automatically review pull requests and get improvement suggestions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Documentation Generator</Typography>
              <Typography variant="body2">
                Generate documentation for your code automatically.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Test Generator</Typography>
              <Typography variant="body2">
                Create test cases for your code with AI assistance.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;