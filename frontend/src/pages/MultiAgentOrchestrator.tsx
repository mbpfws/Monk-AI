import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  AutoAwesome as MagicIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
  Description as DocsIcon,
  Science as ScienceIcon,
  LightbulbOutlined as IdeaIcon,
  Stop as StopIcon,
  Psychology as IdeationIcon,
  BugReport as TestIcon,
  RateReview as ReviewIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkflowResult {
  steps: Record<string, any>;
  timeline: Array<{
    step: string;
    duration: number;
    timestamp: number;
    success: boolean;
  }>;
  success: boolean;
  error_message?: string;
  total_time: number;
  summary: {
    completed_steps: number;
    total_steps: number;
    success_rate: number;
    fastest_step: string;
    slowest_step: string;
  };
}

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  expected_duration: string;
  features: string[];
}

interface LiveMetrics {
  live_stats: {
    agents_active: number;
    workflows_completed: number;
    lines_of_code_generated: number;
    security_vulnerabilities_prevented: number;
    tests_generated: number;
    documentation_pages_created: number;
    developer_time_saved_hours: number;
  };
  real_time_activity: string[];
  performance_metrics: {
    average_response_time: string;
    success_rate: string;
    agent_utilization: string;
    queue_length: number;
  };
  total_agents: number;
  active_workflows: number;
  completed_tasks: number;
  avg_response_time: number;
  uptime_hours: number;
}

interface WorkflowStep {
  agent: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  result?: any;
  error?: string;
  startTime?: string;
  endTime?: string;
}

interface WorkflowResponse {
  workflow_id: string;
  status: string;
  results: any;
  timeline: any[];
  summary: any;
}

const workflowSteps = [
  { key: 'ideation', label: 'Ideation & Planning', icon: <IdeaIcon />, color: '#FF6B6B' },
  { key: 'code_generation', label: 'Code Generation', icon: <CodeIcon />, color: '#4ECDC4' },
  { key: 'security_analysis', label: 'Security Analysis', icon: <SecurityIcon />, color: '#DDA0DD' },
  { key: 'test_generation', label: 'Test Generation', icon: <ScienceIcon />, color: '#96CEB4' },
  { key: 'documentation', label: 'Documentation', icon: <DocsIcon />, color: '#45B7D1' },
  { key: 'code_review', label: 'Code Review', icon: <CheckIcon />, color: '#FFEAA7' },
];

const workflowTypes = [
  { value: 'full_development', label: 'Full Development Cycle' },
  { value: 'code_improvement', label: 'Code Improvement' },
  { value: 'security_focused', label: 'Security Analysis' },
  { value: 'documentation_focused', label: 'Documentation Focus' }
];

const languages = [
  'python', 'javascript', 'typescript', 'java', 'csharp', 'cpp', 'go', 'rust'
];

const MultiAgentOrchestrator = () => {
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('python');
  const [workflowType, setWorkflowType] = useState('full_development');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WorkflowResult | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [scenarios, setScenarios] = useState<DemoScenario[]>([]);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics | null>(null);
  const [currentActivity, setCurrentActivity] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [workflow, setWorkflow] = useState<WorkflowResponse | null>(null);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);

  // Load demo scenarios and live metrics on component mount
  useEffect(() => {
    loadDemoScenarios();
    loadLiveMetrics();
  }, []); // Only run once on mount, no dependencies

  // Set up activity simulation only after metrics are loaded
  useEffect(() => {
    if (!liveMetrics) return;
    
    // Set initial activity
    setCurrentActivity(liveMetrics.real_time_activity.slice(0, 5));
    
    // Optional: Very slow updates (30 seconds) - can be removed entirely
    const activityInterval = setInterval(() => {
      const activities = liveMetrics.real_time_activity;
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setCurrentActivity(prev => [randomActivity, ...prev.slice(0, 4)]);
    }, 30000); // 30 seconds

    return () => clearInterval(activityInterval);
  }, [liveMetrics]);

  const loadDemoScenarios = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/demo/scenarios');
      setScenarios(response.data.scenarios);
    } catch (err) {
      console.error('Failed to load demo scenarios:', err);
      // Set mock data for demo purposes
      setScenarios([
        {
          id: '1',
          title: '🎯 Task Management App',
          description: 'Build a complete task management application with user authentication, CRUD operations, and real-time updates',
          expected_duration: '3 minutes',
          features: ['Authentication', 'CRUD Operations', 'Real-time Updates']
        },
        {
          id: '2',
          title: '🛒 E-commerce Platform',
          description: 'Create a full-featured e-commerce platform with product catalog, shopping cart, and payment integration',
          expected_duration: '4 minutes',
          features: ['Product Catalog', 'Shopping Cart', 'Payment Integration']
        },
        {
          id: '3',
          title: '💬 Real-time Chat Application',
          description: 'Develop a real-time chat application with WebSocket support, user presence, and message history',
          expected_duration: '3.5 minutes',
          features: ['WebSocket Support', 'User Presence', 'Message History']
        },
        {
          id: '4',
          title: '🔧 REST API Service',
          description: 'Build a robust REST API service with authentication, rate limiting, and comprehensive documentation',
          expected_duration: '2.5 minutes',
          features: ['Authentication', 'Rate Limiting', 'API Documentation']
        }
      ]);
    }
  };

  const loadLiveMetrics = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/demo/live-metrics');
      setLiveMetrics(response.data);
    } catch (err) {
      console.error('Failed to load live metrics:', err);
      // Set mock data for demo purposes
      setLiveMetrics({
        live_stats: {
          agents_active: 6,
          workflows_completed: 193,
          lines_of_code_generated: 68651,
          security_vulnerabilities_prevented: 346,
          tests_generated: 1247,
          documentation_pages_created: 89,
          developer_time_saved_hours: 1027
        },
        real_time_activity: [
          '✅ TestGenerator: Created 47 unit tests with 96% coverage',
          '🔒 SecurityAnalyzer: Detected and fixed SQL injection vulnerability',
          '📝 DocGenerator: Generated user guide for e-commerce module - Quality Score: A+',
          '⚡ CodeOptimizer: Improved database query performance by 340%',
          '🤖 IdeationAgent: Proposed microservices architecture for scalability'
        ],
        performance_metrics: {
          average_response_time: '1.2s',
          success_rate: '99.7%',
          agent_utilization: '87%',
          queue_length: 3
        },
        total_agents: 6,
        active_workflows: 12,
        completed_tasks: 193,
        avg_response_time: 1.2,
        uptime_hours: 1027
      });
    }
  };

  const handleScenarioSelect = (scenario: DemoScenario) => {
    setDescription(scenario.description);
    setWorkflowType('full_development');
  };

  const executeWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setActiveStep(0);
    setSteps([]);
    setIsRunning(true);

    try {
      const response = await axios.post('http://localhost:8000/api/execute-workflow', {
        description,
        language,
        workflow_type: workflowType,
      });

      const data: WorkflowResponse = response.data;
      setWorkflow(data);
      
      // Convert timeline to steps
      const workflowSteps: WorkflowStep[] = data.timeline.map((item: any) => ({
        agent: item.agent,
        status: 'completed',
        result: item.result,
        startTime: item.start_time,
        endTime: item.end_time
      }));
      
      setSteps(workflowSteps);
      setActiveStep(workflowSteps.length);
      
    } catch (err: any) {
      console.error('Workflow execution failed:', err);
      setError(err.response?.data?.detail || 'Failed to execute workflow');
    } finally {
      setLoading(false);
      setIsRunning(false);
    }
  };

  const stopWorkflow = () => {
    setIsRunning(false);
    setError('Workflow stopped by user');
  };

  const getStepIcon = (status: string, agent: string) => {
    const iconProps = { fontSize: 'small' as const };
    
    switch (agent) {
      case 'ideation': return <IdeationIcon {...iconProps} />;
      case 'code_generation': return <CodeIcon {...iconProps} />;
      case 'security_analysis': return <SecurityIcon {...iconProps} />;
      case 'test_generation': return <TestIcon {...iconProps} />;
      case 'documentation': return <DocsIcon {...iconProps} />;
      case 'code_review': return <ReviewIcon {...iconProps} />;
      default: return <CodeIcon {...iconProps} />;
    }
  };

  const formatDuration = (start: string, end: string) => {
    const duration = new Date(end).getTime() - new Date(start).getTime();
    return `${(duration / 1000).toFixed(1)}s`;
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6, position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: -1,
                animation: 'pulse 4s ease-in-out infinite',
              }}
            />
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #00ff88 0%, #66ffaa 50%, #ff6b35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                textShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
                letterSpacing: '-0.02em',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
              }}
            >
              🚀 Multi-Agent Orchestrator
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4,
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 400,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              Execute complete workflows with all AI agents working together seamlessly
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              {['⚡ Real-time', '🤖 6 AI Agents', '🔄 Auto-orchestrated', '📊 Live Analytics'].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Chip
                    label={feature}
                    sx={{
                      background: 'rgba(0, 255, 136, 0.2)',
                      color: '#ffffff',
                      border: '1px solid rgba(0, 255, 136, 0.5)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      px: 2,
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Live Metrics Dashboard */}
        {liveMetrics && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Paper sx={{ p: 3, mb: 4, bgcolor: 'rgba(0,0,0,0.02)' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MagicIcon color="primary" />
                Live Platform Statistics
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6} md={3}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0 * 0.1 }}
                  >
                    <Card sx={{ 
                      textAlign: 'center', 
                      height: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #FF6B6B 0%, #ff8c61 100%)',
                      },
                    }}>
                      <CardContent sx={{ py: 3 }}>
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            fontWeight: 800, 
                            background: 'linear-gradient(135deg, #FF6B6B 0%, #ff8c61 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                            textShadow: '0 0 20px rgba(255, 107, 107, 0.3)',
                          }}
                        >
                          {liveMetrics.live_stats.workflows_completed.toLocaleString()}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)' }}>
                          Workflows Completed
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card sx={{ 
                      textAlign: 'center', 
                      height: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #4ECDC4 0%, #6ee8e0 100%)',
                      },
                    }}>
                      <CardContent sx={{ py: 3 }}>
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            fontWeight: 800, 
                            background: 'linear-gradient(135deg, #4ECDC4 0%, #6ee8e0 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                            textShadow: '0 0 20px rgba(78, 205, 196, 0.3)',
                          }}
                        >
                        {liveMetrics.live_stats.lines_of_code_generated.toLocaleString()}
                      </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)' }}>
                          Lines of Code Generated
                        </Typography>
                    </CardContent>
                  </Card>
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card sx={{ 
                      textAlign: 'center', 
                      height: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #DDA0DD 0%, #e8b3e8 100%)',
                      },
                    }}>
                      <CardContent sx={{ py: 3 }}>
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            fontWeight: 800, 
                            background: 'linear-gradient(135deg, #DDA0DD 0%, #e8b3e8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                            textShadow: '0 0 20px rgba(221, 160, 221, 0.3)',
                          }}
                        >
                        {liveMetrics.live_stats.security_vulnerabilities_prevented.toLocaleString()}
                      </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)' }}>
                          Security Issues Prevented
                        </Typography>
                    </CardContent>
                  </Card>
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card sx={{ 
                      textAlign: 'center', 
                      height: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #FFEAA7 0%, #fff4c7 100%)',
                      },
                    }}>
                      <CardContent sx={{ py: 3 }}>
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            fontWeight: 800, 
                            background: 'linear-gradient(135deg, #FFEAA7 0%, #fff4c7 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                            textShadow: '0 0 20px rgba(255, 234, 167, 0.3)',
                          }}
                        >
                        {liveMetrics.live_stats.developer_time_saved_hours.toLocaleString()}h
                      </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)' }}>
                          Developer Time Saved
                        </Typography>
                    </CardContent>
                  </Card>
                  </motion.div>
                </Grid>
              </Grid>

              {/* Real-time Activity Feed */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Real-time Activity:</Typography>
                <Box sx={{ maxHeight: 100, overflow: 'hidden' }}>
                  <AnimatePresence>
                    {currentActivity.map((activity, index) => (
                      <motion.div
                        key={`${activity}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1 - (index * 0.2), x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block', 
                            opacity: 1 - (index * 0.2),
                            fontSize: index === 0 ? '0.875rem' : '0.75rem'
                          }}
                        >
                          {activity}
                        </Typography>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        )}

        <Grid container spacing={4}>
          {/* Left Column - Input Form */}
          <Grid item xs={12} md={6}>
            {/* Demo Scenarios */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  🎯 Demo Scenarios
                </Typography>
                <Grid container spacing={2}>
                  {scenarios.map((scenario) => (
                    <Grid item xs={12} sm={6} key={scenario.id}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': { 
                            transform: 'translateY(-2px)',
                            boxShadow: 3 
                          }
                        }}
                        onClick={() => handleScenarioSelect(scenario)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            {scenario.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {scenario.expected_duration}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>

            {/* Workflow Configuration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  ⚙️ Configure Workflow
                </Typography>
                
                <form onSubmit={executeWorkflow}>
                  <TextField
                    fullWidth
                    label="Project Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    required
                    multiline
                    rows={4}
                    placeholder="Describe your project in detail..."
                  />

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

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Workflow Type</InputLabel>
                    <Select
                      value={workflowType}
                      label="Workflow Type"
                      onChange={(e) => setWorkflowType(e.target.value)}
                    >
                      {workflowTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      sx={{ mt: 3 }}
                      disabled={loading || !description.trim()}
                      startIcon={loading ? <CircularProgress size={20} /> : <PlayIcon />}
                    >
                      {loading ? 'Executing Workflow...' : 'Execute Multi-Agent Workflow'}
                    </Button>
                    
                    {isRunning && (
                      <Button
                        variant="outlined"
                        startIcon={<StopIcon />}
                        onClick={stopWorkflow}
                        color="error"
                      >
                        Stop
                      </Button>
                    )}
                  </Box>
                </form>
              </Paper>
            </motion.div>
          </Grid>

          {/* Right Column - Workflow Progress & Results */}
          <Grid item xs={12} md={6}>
            {/* Workflow Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  🔄 Workflow Progress
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                {workflow && (
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={`Workflow ID: ${workflow.workflow_id}`} 
                      size="small" 
                      sx={{ mr: 2 }}
                    />
                    <Chip 
                      label={workflow.status} 
                      color={workflow.status === 'completed' ? 'success' : 'primary'} 
                      size="small" 
                    />
                  </Box>
                )}

                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((step, index) => (
                    <Step key={index}>
                      <StepLabel
                        icon={getStepIcon(step.status, step.agent)}
                        error={step.status === 'error'}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">
                            {step.agent.replace('_', ' ').toUpperCase()}
                          </Typography>
                          {step.startTime && step.endTime && (
                            <Chip 
                              label={formatDuration(step.startTime, step.endTime)} 
                              size="small" 
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </StepLabel>
                      <StepContent>
                        {step.error && (
                          <Alert severity="error" sx={{ mb: 1 }}>
                            {step.error}
                          </Alert>
                        )}
                        {step.result && (
                          <Paper sx={{ p: 2, backgroundColor: '#2d2d2d' }}>
                            <pre style={{ 
                              fontSize: '0.8rem', 
                              margin: 0, 
                              whiteSpace: 'pre-wrap',
                              maxHeight: '200px',
                              overflow: 'auto'
                            }}>
                              {typeof step.result === 'string' 
                                ? step.result 
                                : JSON.stringify(step.result, null, 2)}
                            </pre>
                          </Paper>
                        )}
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
            </motion.div>

            {/* Results */}
            {(result || error) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    📊 Workflow Results
                  </Typography>

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {result && (
                    <>
                      {/* Summary Cards */}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6}>
                          <Card>
                            <CardContent sx={{ textAlign: 'center', py: 2 }}>
                              <SpeedIcon color="primary" sx={{ mb: 1 }} />
                              <Typography variant="h6">
                                {result.total_time.toFixed(1)}s
                              </Typography>
                              <Typography variant="caption">Total Time</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={6}>
                          <Card>
                            <CardContent sx={{ textAlign: 'center', py: 2 }}>
                              <CheckIcon color="success" sx={{ mb: 1 }} />
                              <Typography variant="h6">
                                {result.summary.success_rate * 100}%
                              </Typography>
                              <Typography variant="caption">Success Rate</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>

                      {/* Detailed Results */}
                      {Object.entries(result.steps).map(([stepKey, stepResult]) => (
                        <Accordion key={stepKey} sx={{ mb: 1 }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              {getStepIcon(stepResult.status, stepKey)}
                              <Typography>
                                {stepKey.replace('_', ' ').toUpperCase()}
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                              {formatDuration(stepResult.startTime, stepResult.endTime) + ' - ' + (stepResult.error ? ErrorIcon : CheckIcon)}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </>
                  )}
                </Paper>
              </motion.div>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default MultiAgentOrchestrator; 