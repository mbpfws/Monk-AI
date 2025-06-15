import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  CloudUpload as CloudUploadIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import axios from 'axios';

// Mock data - replace with actual API calls in production
const environments = [
  { id: 'dev', name: 'Development', status: 'running', lastDeployed: '2023-05-15 14:30:00' },
  { id: 'staging', name: 'Staging', status: 'stopped', lastDeployed: '2023-05-10 09:15:00' },
  { id: 'prod', name: 'Production', status: 'running', lastDeployed: '2023-05-01 12:00:00' },
];

const deploymentHistory = [
  { id: 1, environment: 'prod', version: 'v1.2.0', timestamp: '2023-05-01 12:00:00', status: 'success', user: 'admin@example.com' },
  { id: 2, environment: 'staging', version: 'v1.2.1', timestamp: '2023-05-10 09:15:00', status: 'success', user: 'developer@example.com' },
  { id: 3, environment: 'dev', version: 'v1.2.2', timestamp: '2023-05-15 14:30:00', status: 'success', user: 'developer@example.com' },
];

const deploySteps = ['Build', 'Test', 'Deploy', 'Verify'];

interface DeploymentConfig {
  environment: string;
  version: string;
  autoRestart: boolean;
  notifyOnComplete: boolean;
  forceRebuild: boolean;
}

const Deploy: React.FC = () => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('dev');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(-1); // -1 means no deployment in progress
  const [deploymentStatus, setDeploymentStatus] = useState<string>('');
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const [showConfigDialog, setShowConfigDialog] = useState<boolean>(false);
  const [deployConfig, setDeployConfig] = useState<DeploymentConfig>({
    environment: 'dev',
    version: 'v1.0.0',
    autoRestart: true,
    notifyOnComplete: true,
    forceRebuild: false,
  });

  // Fetch environment status
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // Example: axios.get('/api/environments').then(response => { ... })
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleEnvironmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedEnvironment(event.target.value as string);
    setDeployConfig({
      ...deployConfig,
      environment: event.target.value as string,
    });
  };

  const handleConfigChange = (field: keyof DeploymentConfig, value: any) => {
    setDeployConfig({
      ...deployConfig,
      [field]: value,
    });
  };

  const startDeployment = () => {
    setShowConfigDialog(false);
    setActiveStep(0);
    setDeploymentStatus('in_progress');
    setDeploymentLogs(['Starting deployment process...']);

    // Simulate deployment process
    const simulateDeployment = (step: number) => {
      if (step >= deploySteps.length) {
        setDeploymentStatus('success');
        setActiveStep(-1); // Deployment complete
        return;
      }

      setActiveStep(step);
      
      // Add logs based on current step
      const stepLogs = [
        [`Building application for ${deployConfig.environment}...`, 'Build completed successfully.'],
        ['Running tests...', 'All tests passed.'],
        [`Deploying to ${deployConfig.environment}...`, 'Deployment successful.'],
        ['Verifying deployment...', 'Verification complete. All services are running.'],
      ];

      // Add first log entry for this step
      setDeploymentLogs(prev => [...prev, stepLogs[step][0]]);
      
      // After a delay, add the completion log and move to next step
      setTimeout(() => {
        setDeploymentLogs(prev => [...prev, stepLogs[step][1]]);
        setTimeout(() => simulateDeployment(step + 1), 1000);
      }, 2000);
    };

    simulateDeployment(0);
  };

  const cancelDeployment = () => {
    setActiveStep(-1);
    setDeploymentStatus('cancelled');
    setDeploymentLogs(prev => [...prev, 'Deployment cancelled by user.']);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'running':
        return <Chip icon={<CheckCircleIcon />} label="Running" color="success" size="small" />;
      case 'stopped':
        return <Chip icon={<StopIcon />} label="Stopped" color="error" size="small" />;
      case 'deploying':
        return <Chip icon={<CloudUploadIcon />} label="Deploying" color="info" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getEnvironmentCard = (env: typeof environments[0]) => {
    const isSelected = selectedEnvironment === env.id;
    const isDeploying = isSelected && activeStep !== -1;
    
    return (
      <Card 
        key={env.id} 
        sx={{
          border: isSelected ? '2px solid #1976d2' : 'none',
          opacity: isDeploying ? 0.8 : 1,
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{env.name}</Typography>
            {getStatusChip(isDeploying ? 'deploying' : env.status)}
          </Box>
          <Typography variant="body2" color="text.secondary">
            Last deployed: {env.lastDeployed}
          </Typography>
        </CardContent>
        <CardActions>
          <Button 
            size="small" 
            variant={isSelected ? "contained" : "outlined"}
            onClick={() => setSelectedEnvironment(env.id)}
            disabled={isDeploying}
          >
            Select
          </Button>
          <Button 
            size="small" 
            startIcon={env.status === 'running' ? <StopIcon /> : <PlayArrowIcon />}
            color={env.status === 'running' ? "error" : "success"}
            disabled={isDeploying}
          >
            {env.status === 'running' ? 'Stop' : 'Start'}
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Deployment Management
      </Typography>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Environments</Typography>
        <Button 
          startIcon={<RefreshIcon />} 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Refresh'}
        </Button>
      </Box>
      
      <Grid container spacing={3} mb={4}>
        {environments.map(env => (
          <Grid item xs={12} sm={6} md={4} key={env.id}>
            {getEnvironmentCard(env)}
          </Grid>
        ))}
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h6" gutterBottom>
        Deployment Control
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box mb={3}>
          <Stepper activeStep={activeStep === -1 ? -1 : activeStep}>
            {deploySteps.map((label, index) => (
              <Step key={label} completed={activeStep > index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        
        {deploymentStatus === 'in_progress' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Deployment in progress. Please wait...
          </Alert>
        )}
        
        {deploymentStatus === 'success' && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Deployment completed successfully!
          </Alert>
        )}
        
        {deploymentStatus === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Deployment failed. Please check the logs for details.
          </Alert>
        )}
        
        {deploymentStatus === 'cancelled' && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Deployment was cancelled.
          </Alert>
        )}
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="subtitle1">
              Selected Environment: <strong>{environments.find(e => e.id === selectedEnvironment)?.name}</strong>
            </Typography>
          </Box>
          
          <Box>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => setShowConfigDialog(true)}
              sx={{ mr: 1 }}
              disabled={activeStep !== -1}
            >
              Configure
            </Button>
            
            {activeStep === -1 ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<CloudUploadIcon />}
                onClick={startDeployment}
                disabled={!selectedEnvironment}
              >
                Deploy
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                startIcon={<StopIcon />}
                onClick={cancelDeployment}
              >
                Cancel Deployment
              </Button>
            )}
          </Box>
        </Box>
        
        {deploymentLogs.length > 0 && (
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              mt: 2, 
              maxHeight: '300px', 
              overflow: 'auto',
              bgcolor: '#f5f5f5',
              fontFamily: 'monospace',
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Deployment Logs:
            </Typography>
            {deploymentLogs.map((log, index) => (
              <Typography key={index} variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {`[${new Date().toLocaleTimeString()}] ${log}`}
              </Typography>
            ))}
          </Paper>
        )}
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Deployment History
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Environment</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Version</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Timestamp</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>User</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deploymentHistory.map((deployment) => (
                <tr key={deployment.id}>
                  <td style={{ padding: '8px' }}>{deployment.id}</td>
                  <td style={{ padding: '8px' }}>
                    {environments.find(e => e.id === deployment.environment)?.name}
                  </td>
                  <td style={{ padding: '8px' }}>{deployment.version}</td>
                  <td style={{ padding: '8px' }}>{deployment.timestamp}</td>
                  <td style={{ padding: '8px' }}>
                    {deployment.status === 'success' ? (
                      <Chip icon={<CheckCircleIcon />} label="Success" color="success" size="small" />
                    ) : deployment.status === 'error' ? (
                      <Chip icon={<ErrorIcon />} label="Failed" color="error" size="small" />
                    ) : (
                      <Chip label={deployment.status} size="small" />
                    )}
                  </td>
                  <td style={{ padding: '8px' }}>{deployment.user}</td>
                  <td style={{ padding: '8px' }}>
                    <Tooltip title="View Logs">
                      <IconButton size="small">
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Rollback">
                      <IconButton size="small">
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>
      
      {/* Deployment Configuration Dialog */}
      <Dialog open={showConfigDialog} onClose={() => setShowConfigDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Deployment Configuration</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Environment</InputLabel>
              <Select
                value={deployConfig.environment}
                label="Environment"
                onChange={(e) => handleConfigChange('environment', e.target.value)}
              >
                {environments.map(env => (
                  <MenuItem key={env.id} value={env.id}>{env.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              margin="normal"
              label="Version"
              value={deployConfig.version}
              onChange={(e) => handleConfigChange('version', e.target.value)}
              helperText="Specify the version to deploy"
            />
            
            <Box mt={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={deployConfig.autoRestart}
                    onChange={(e) => handleConfigChange('autoRestart', e.target.checked)}
                  />
                }
                label="Auto-restart services after deployment"
              />
            </Box>
            
            <Box mt={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={deployConfig.notifyOnComplete}
                    onChange={(e) => handleConfigChange('notifyOnComplete', e.target.checked)}
                  />
                }
                label="Send notification when deployment completes"
              />
            </Box>
            
            <Box mt={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={deployConfig.forceRebuild}
                    onChange={(e) => handleConfigChange('forceRebuild', e.target.checked)}
                  />
                }
                label="Force rebuild (ignore cache)"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfigDialog(false)}>Cancel</Button>
          <Button onClick={startDeployment} variant="contained" color="primary">
            Deploy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Deploy;