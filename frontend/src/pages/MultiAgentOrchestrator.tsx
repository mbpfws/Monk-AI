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
  step_id: string;
  agent_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  start_time?: number;
  end_time?: number;
  progress?: number;
}

interface WorkflowStatus {
  workflow_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  current_step: number;
  total_steps: number;
  steps: WorkflowStep[];
  results: Record<string, any>;
  start_time?: number;
  end_time?: number;
  error?: string;
  progress: number;
}

interface RealTimeUpdate {
  type: 'workflow_status' | 'step_update' | 'step_complete' | 'workflow_complete' | 'error';
  workflow_id: string;
  data: any;
  timestamp: string;
  message: string;
  event_type?: string;
  step_name?: string;
  step_result?: any;
  progress?: number;
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
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus | null>(null);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [workflowProgress, setWorkflowProgress] = useState(0);
  const [currentStepProgress, setCurrentStepProgress] = useState(0);
  const [realTimeUpdates, setRealTimeUpdates] = useState<RealTimeUpdate[]>([]);

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
    setWorkflowProgress(0);
    setCurrentStepProgress(0);
    setRealTimeUpdates([]);

    try {
      // Start the workflow
      const response = await axios.post('http://localhost:8000/api/workflow/execute', {
        project_description: description,
        programming_language: language,
        workflow_type: workflowType,
      });

      const { workflow_id, stream_url } = response.data;
      
      // Set up Server-Sent Events for real-time updates
      const eventSource = new EventSource(`http://localhost:8000/api/workflow/stream/${workflow_id}`);
      setEventSource(eventSource);

      eventSource.onmessage = (event) => {
        try {
          const update: RealTimeUpdate = JSON.parse(event.data);
          handleRealTimeUpdate(update);
        } catch (err) {
          console.error('Failed to parse SSE data:', err);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        setError('Connection to workflow stream lost');
        setIsRunning(false);
        setLoading(false);
        eventSource.close();
      };

      eventSource.onopen = () => {
        console.log('SSE connection established');
        setLoading(false);
      };
      
    } catch (err: any) {
      console.error('Workflow execution failed:', err);
      setError(err.response?.data?.detail || 'Failed to execute workflow');
      setLoading(false);
      setIsRunning(false);
    }
  };

  const handleRealTimeUpdate = (update: RealTimeUpdate) => {
    console.log('Real-time update:', update);
    
    switch (update.type) {
      case 'workflow_status':
        const status: WorkflowStatus = update.data;
        setWorkflowStatus(status);
        setSteps(status.steps);
        setActiveStep(status.current_step);
        setWorkflowProgress(status.progress);
        
        // Add real-time activity update
        const activityUpdate: RealTimeUpdate = {
          type: 'workflow_status',
          workflow_id: status.workflow_id,
          data: status,
          timestamp: new Date().toISOString(),
          message: `🔄 Workflow ${status.workflow_id.slice(0, 8)}: ${status.status} - Step ${status.current_step}/${status.total_steps}`
        };
        setRealTimeUpdates(prev => [activityUpdate, ...prev.slice(0, 4)]);
        break;
        
      case 'step_update':
        const stepUpdate = update.data;
        setCurrentStepProgress(stepUpdate.progress || 0);
        
        // Update specific step
        setSteps(prev => prev.map(step => 
          step.step_id === stepUpdate.step_id ? { ...step, ...stepUpdate } : step
        ));
        
        const stepUpdateMsg: RealTimeUpdate = {
          type: 'step_update',
          workflow_id: update.workflow_id,
          data: stepUpdate,
          timestamp: new Date().toISOString(),
          message: `⚡ ${stepUpdate.agent_name}: ${stepUpdate.status} - ${stepUpdate.progress || 0}%`
        };
        setRealTimeUpdates(prev => [stepUpdateMsg, ...prev.slice(0, 4)]);
        break;
        
      case 'step_complete':
        const completedStep = update.data;
        setSteps(prev => prev.map(step => 
          step.step_id === completedStep.step_id ? { ...step, ...completedStep } : step
        ));
        
        const completeUpdate: RealTimeUpdate = {
          type: 'step_complete',
          workflow_id: update.workflow_id,
          data: completedStep,
          timestamp: new Date().toISOString(),
          message: `✅ ${completedStep.agent_name}: Completed successfully`
        };
        setRealTimeUpdates(prev => [completeUpdate, ...prev.slice(0, 4)]);
        setCurrentStepProgress(0);
        break;
        
      case 'workflow_complete':
        const finalStatus: WorkflowStatus = update.data;
        setWorkflowStatus(finalStatus);
        setSteps(finalStatus.steps);
        setIsRunning(false);
        setWorkflowProgress(100);
        
        // Create result summary
        const workflowResult: WorkflowResult = {
          steps: finalStatus.results,
          timeline: finalStatus.steps.map(step => ({
            step: step.agent_name,
            duration: step.end_time && step.start_time ? (step.end_time - step.start_time) / 1000 : 0,
            timestamp: step.start_time || 0,
            success: step.status === 'completed'
          })),
          success: finalStatus.status === 'completed',
          total_time: finalStatus.end_time && finalStatus.start_time ? (finalStatus.end_time - finalStatus.start_time) / 1000 : 0,
          summary: {
            completed_steps: finalStatus.steps.filter(s => s.status === 'completed').length,
            total_steps: finalStatus.total_steps,
            success_rate: (finalStatus.steps.filter(s => s.status === 'completed').length / finalStatus.total_steps) * 100,
            fastest_step: 'ideation',
            slowest_step: 'documentation'
          }
        };
        setResult(workflowResult);
        
        const finalUpdate: RealTimeUpdate = {
          type: 'workflow_complete',
          workflow_id: update.workflow_id,
          data: finalStatus,
          timestamp: new Date().toISOString(),
          message: `🎉 Workflow completed successfully! Generated ${Object.keys(finalStatus.results).length} results`
        };
        setRealTimeUpdates(prev => [finalUpdate, ...prev.slice(0, 4)]);
        
        // Close the event source
        if (eventSource) {
          eventSource.close();
          setEventSource(null);
        }
        break;
        
      case 'error':
        setError(update.data.message || 'Workflow execution failed');
        setIsRunning(false);
        setLoading(false);
        
        if (eventSource) {
          eventSource.close();
          setEventSource(null);
        }
        break;
    }
  };

  const stopWorkflow = () => {
    setIsRunning(false);
    setError('Workflow stopped by user');
    
    // Close the event source if it exists
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
  };

  // Cleanup effect for EventSource
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const getStepIcon = (status: string, agent: string) => {
    const iconProps = { fontSize: 'small' as const };
    
    // Map agent names to icons
    const agentIconMap: Record<string, JSX.Element> = {
      'IdeationAgent': <IdeationIcon {...iconProps} />,
      'CodeOptimizer': <CodeIcon {...iconProps} />,
      'SecurityAnalyzer': <SecurityIcon {...iconProps} />,
      'TestGenerator': <TestIcon {...iconProps} />,
      'DocGenerator': <DocsIcon {...iconProps} />,
      'CodeReviewer': <ReviewIcon {...iconProps} />,
      // Legacy mappings
      'ideation': <IdeationIcon {...iconProps} />,
      'code_generation': <CodeIcon {...iconProps} />,
      'security_analysis': <SecurityIcon {...iconProps} />,
      'test_generation': <TestIcon {...iconProps} />,
      'documentation': <DocsIcon {...iconProps} />,
      'code_review': <ReviewIcon {...iconProps} />,
    };
    
    return agentIconMap[agent] || <CodeIcon {...iconProps} />;
  };

  const formatDuration = (start?: number, end?: number) => {
    if (!start || !end) return '0.0s';
    const duration = (end - start) / 1000;
    return `${duration.toFixed(1)}s`;
  };

  const getStepStatus = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed': return { color: '#4caf50', icon: <CheckIcon /> };
      case 'running': return { color: '#ff9800', icon: <CircularProgress size={16} /> };
      case 'failed': return { color: '#f44336', icon: <ErrorIcon /> };
      default: return { color: '#9e9e9e', icon: <PendingIcon /> };
    }
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

                {workflowStatus && (
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={`Workflow ID: ${workflowStatus.workflow_id}`} 
                      size="small" 
                      sx={{ mr: 2 }}
                    />
                    <Chip 
                      label={workflowStatus.status} 
                      color={workflowStatus.status === 'completed' ? 'success' : 
                             workflowStatus.status === 'failed' ? 'error' : 'primary'} 
                      size="small" 
                    />
                    {workflowProgress > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Overall Progress: {Math.round(workflowProgress)}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={workflowProgress} 
                          sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    )}
                  </Box>
                )}

                <Stepper activeStep={activeStep} orientation="vertical">
                  {workflowStatus?.steps?.map((step, index) => {
                    const stepStatus = getStepStatus(step);
                    return (
                      <Step key={step.step_id || index}>
                        <StepLabel
                          icon={stepStatus.icon}
                          error={step.status === 'failed'}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="subtitle2">
                              {step.agent_name || 'Unknown Agent'}
                            </Typography>
                            {step.start_time && step.end_time && (
                              <Chip 
                                label={formatDuration(step.start_time, step.end_time)} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                            {step.status === 'running' && step.progress !== undefined && (
                              <Chip 
                                label={`${Math.round(step.progress)}%`}
                                size="small" 
                                color="primary"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </StepLabel>
                        <StepContent>
                          {step.status === 'running' && step.progress !== undefined && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                Step Progress: {Math.round(step.progress)}%
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={step.progress} 
                                sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                              />
                            </Box>
                          )}
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
                    );
                  }) || []}
                </Stepper>
              </Paper>
            </motion.div>

            {/* Real-time Activity Feed */}
            {realTimeUpdates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    📡 Real-time Activity
                  </Typography>
                  <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
                    {realTimeUpdates.slice(-10).reverse().map((update, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert 
                          severity={update.type === 'error' ? 'error' : 'info'} 
                          sx={{ mb: 1, fontSize: '0.875rem' }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">
                              {update.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(update.timestamp).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        </Alert>
                      </motion.div>
                    ))}
                  </Box>
                </Paper>
              </motion.div>
            )}

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