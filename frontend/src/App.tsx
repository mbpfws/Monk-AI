import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';

// Import all agent pages
import PRReviewer from './pages/PRReview';
import DocGenerator from './pages/DocGenerator';
import TestGenerator from './pages/TestGenerator';
import CodeOptimizer from './pages/CodeOptimizer';
import SecurityAnalyzer from './pages/SecurityAnalyzer';
import IdeationAgent from './pages/Ideation';
import MultiAgentOrchestrator from './pages/MultiAgentOrchestrator';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  return (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                🔥 Monk-AI - Hackathon Edition
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Navigation />
          
          <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/orchestrator" replace />} />
              <Route path="/orchestrator" element={<MultiAgentOrchestrator />} />
              <Route path="/pr-reviewer" element={<PRReviewer />} />
              <Route path="/doc-generator" element={<DocGenerator />} />
              <Route path="/test-generator" element={<TestGenerator />} />
              <Route path="/code-optimizer" element={<CodeOptimizer />} />
              <Route path="/security-analyzer" element={<SecurityAnalyzer />} />
              <Route path="/ideation" element={<IdeationAgent />} />
            </Routes>
          </Container>
        </Box>
  );
};

export default App; 