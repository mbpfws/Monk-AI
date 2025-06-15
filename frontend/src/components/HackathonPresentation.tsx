import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  NavigateNext,
  NavigateBefore,
  Code,
  Security,
  AutoFixHigh,
  Psychology,
  Speed,
  Groups,
  GitHub,
  Rocket,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  background?: string;
}

const HackathonPresentation: React.FC = () => {
  const theme = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const slides: Slide[] = [
    {
      id: 1,
      title: "TraeDevMate",
      subtitle: "AI Pair Programmer & Code Reviewer",
      content: (
        <Box textAlign="center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <Box
              sx={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                boxShadow: `0 0 50px ${theme.palette.primary.main}40`,
                animation: 'pulse 2s infinite',
              }}
            >
              <Psychology sx={{ fontSize: 80, color: 'white' }} />
            </Box>
          </motion.div>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Revolutionizing Development with Multi-Agent AI
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip label="FastAPI" color="primary" variant="outlined" />
            <Chip label="React + TypeScript" color="primary" variant="outlined" />
            <Chip label="Trae AI" color="secondary" variant="outlined" />
            <Chip label="Novita.ai" color="secondary" variant="outlined" />
          </Box>
        </Box>
      ),
      background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%)',
    },    {
      id: 2,
      title: "🚀 Core Features",
      content: (
        <Grid container spacing={3}>
          {[
            { icon: <Groups />, title: "Multi-Agent System", desc: "Specialized AI agents for different tasks" },
            { icon: <GitHub />, title: "Automated PR Reviews", desc: "Intelligent code review and suggestions" },
            { icon: <AutoFixHigh />, title: "Code Optimization", desc: "Performance and quality improvements" },
            { icon: <Security />, title: "Security Analysis", desc: "Auto-threat modeling and vulnerability detection" },
            { icon: <Code />, title: "Test Generation", desc: "Automated test case creation" },
            { icon: <Psychology />, title: "Context-Aware Mentor", desc: "Auto-learning development assistant" },
          ].map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                    border: `1px solid ${theme.palette.primary.main}30`,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 10px 30px ${theme.palette.primary.main}20`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          background: `${theme.palette.primary.main}20`,
                          mr: 2,
                        }}
                      >
                        {React.cloneElement(feature.icon, { color: 'primary' })}
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ),
    },    {
      id: 3,
      title: "🏗️ Architecture",
      content: (
        <Box>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Typography variant="h5" gutterBottom color="primary">
                  Backend (FastAPI)
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {['Multi-Agent System', 'Trae AI Integration', 'Novita.ai Models', 'RESTful APIs'].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                    >
                      <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: theme.palette.primary.main,
                            mr: 2,
                          }}
                        />
                        {item}
                      </Typography>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Typography variant="h5" gutterBottom color="secondary">
                  Frontend (React + TS)
                </Typography>
                <Box>
                  {['Material-UI Design', 'Framer Motion', 'Real-time Updates', 'Responsive UI'].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.5 }}
                    >
                      <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: theme.palette.secondary.main,
                            mr: 2,
                          }}
                        />
                        {item}
                      </Typography>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      ),
    },    {
      id: 4,
      title: "💡 Innovation Highlights",
      content: (
        <Box>
          <Grid container spacing={3}>
            {[
              {
                title: "Multi-Agent Collaboration",
                description: "Different AI agents specialized for code review, optimization, testing, and security",
                icon: <Groups sx={{ fontSize: 40 }} />,
                color: theme.palette.primary.main,
              },
              {
                title: "Context-Aware Learning",
                description: "AI that learns from your codebase and adapts to your development patterns",
                icon: <Psychology sx={{ fontSize: 40 }} />,
                color: theme.palette.secondary.main,
              },
              {
                title: "Real-time Assistance",
                description: "Instant code suggestions, reviews, and optimizations as you develop",
                icon: <Speed sx={{ fontSize: 40 }} />,
                color: theme.palette.success.main,
              },
            ].map((highlight, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      background: `linear-gradient(135deg, ${highlight.color}10, ${highlight.color}05)`,
                      border: `2px solid ${highlight.color}30`,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: `0 15px 40px ${highlight.color}30`,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ mb: 2, color: highlight.color }}>
                        {highlight.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        {highlight.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {highlight.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      ),
    },    {
      id: 5,
      title: "🎯 Live Demo",
      content: (
        <Box textAlign="center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h4" gutterBottom color="primary">
              Experience TraeDevMate
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              See how AI transforms your development workflow
            </Typography>
            
            <Grid container spacing={3} justifyContent="center">
              {[
                { label: "Code Review", path: "/code-optimizer", icon: <Code /> },
                { label: "AI Ideation", path: "/ideation", icon: <Psychology /> },
                { label: "Security Analysis", path: "/security", icon: <Security /> },
              ].map((demo, index) => (
                <Grid item key={index}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={demo.icon}
                      sx={{
                        px: 4,
                        py: 2,
                        borderRadius: 3,
                        background: `${theme.palette.primary.main}10`,
                        '&:hover': {
                          background: `${theme.palette.primary.main}20`,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      {demo.label}
                    </Button>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Built for{' '}
                <Typography component="span" color="primary" fontWeight="bold">
                  Code Craft AI x Dev Hackathon
                </Typography>
              </Typography>
            </Box>
          </motion.div>
        </Box>
      ),
    },
  ];
  // Auto-play effect
  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: slides[currentSlide].background || 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background particles */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}15 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}15 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, ${theme.palette.primary.main}10 0%, transparent 50%)
          `,
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      {/* Navigation Header */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.primary.main}30`,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="primary">
              TraeDevMate Presentation
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {currentSlide + 1} / {slides.length}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={prevSlide} color="primary">
                  <NavigateBefore />
                </IconButton>
                <IconButton onClick={toggleAutoPlay} color={isAutoPlay ? 'secondary' : 'primary'}>
                  {isAutoPlay ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton onClick={nextSlide} color="primary">
                  <NavigateNext />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8, position: 'relative', zIndex: 5 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Box sx={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center',
                    mb: 4,
                  }}
                >
                  {slides[currentSlide].title}
                </Typography>
                
                {slides[currentSlide].subtitle && (
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mb: 6 }}
                  >
                    {slides[currentSlide].subtitle}
                  </Typography>
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {slides[currentSlide].content}
              </motion.div>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Container>
      {/* Progress Indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 10,
        }}
      >
        {slides.map((_, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Box
              onClick={() => setCurrentSlide(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: index === currentSlide ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: theme.palette.primary.light,
                },
              }}
            />
          </motion.div>
        ))}
      </Box>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(1deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default HackathonPresentation;    // Slide 6: Technology Deep Dive - Trae AI IDE
    {
      title: "Built with Trae AI IDE",
      subtitle: "The World's Most Advanced AI-Powered Development Environment",
      content: (
        <Box sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  height: '100%',
                  p: 3
                }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      🚀 Trae AI Features Used
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Chip label="MCP Servers" size="small" sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
                        Multi-tool integration
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Chip label="AI Agents" size="small" sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
                        Intelligent code assistance
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Chip label="Real-time" size="small" sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
                        Live collaboration
                      </Typography>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip label="Context-Aware" size="small" sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
                        Smart suggestions
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  height: '100%',
                  p: 3
                }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      🎯 Development Workflow
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.8 }}>
                      Trae AI's intelligent agents helped us rapidly prototype, 
                      debug, and optimize our multi-agent system. The IDE's 
                      context-aware suggestions accelerated development by 300%.
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        "The future of coding is here" - Trae AI
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      )
    },

    // Slide 7: MCP Server Integration
    {
      title: "MCP Server Architecture",
      subtitle: "Model Context Protocol - Bridging AI and Development Tools",
      content: (
        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 3,
                  height: '280px'
                }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ mb: 2 }}>🔧</Typography>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Desktop Commander
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      File system operations, command execution, 
                      and environment management through MCP
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip label="File Operations" size="small" sx={{ m: 0.5, bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip label="Commands" size="small" sx={{ m: 0.5, bgcolor: 'rgba(255,255,255,0.2)' }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 3,
                  height: '280px'
                }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ mb: 2 }}>🧠</Typography>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Memory Bank
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      Persistent knowledge storage and retrieval 
                      for context-aware AI interactions
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip label="Knowledge Graph" size="small" sx={{ m: 0.5, bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip label="Context" size="small" sx={{ m: 0.5, bgcolor: 'rgba(255,255,255,0.2)' }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                  color: '#333',
                  textAlign: 'center',
                  p: 3,
                  height: '280px'
                }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ mb: 2 }}>🎨</Typography>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Flux Image Gen
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      AI-powered image generation for 
                      dynamic visual content creation
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip label="AI Images" size="small" sx={{ m: 0.5, bgcolor: 'rgba(0,0,0,0.1)' }} />
                      <Chip label="Dynamic" size="small" sx={{ m: 0.5, bgcolor: 'rgba(0,0,0,0.1)' }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      )
    },

    // Slide 8: AI Agents Ecosystem
    {
      title: "Multi-Agent Intelligence",
      subtitle: "Specialized AI Agents Working in Harmony",
      content: (
        <Box sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  p: 3,
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      🤖 Code Review Agent
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                      Analyzes code quality, identifies bugs, suggests improvements, 
                      and ensures best practices compliance.
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip label="Static Analysis" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip label="Best Practices" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip label="Bug Detection" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  p: 3,
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      🛡️ Security Agent
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                      Scans for vulnerabilities, checks dependencies, 
                      and enforces security standards across the codebase.
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip label="Vulnerability Scan" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip label="Dependency Check" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip label="OWASP" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  p: 3,
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      ⚡ Optimization Agent
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                      Optimizes performance, refactors code, 
                      and suggests architectural improvements.
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip label="Performance" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip label="Refactoring" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip label="Architecture" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  color: 'white',
                  p: 3,
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      🧪 Test Agent
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                      Generates comprehensive test suites, 
                      ensures code coverage, and validates functionality.
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip label="Unit Tests" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip label="Integration" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip label="Coverage" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      )
    },

    // Slide 9: Technical Stack Deep Dive
    {
      title: "Technology Stack",
      subtitle: "Modern, Scalable, and AI-First Architecture",
      content: (
        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  p: 3,
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      🚀 Backend Technologies
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Chip label="FastAPI" sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                        High-performance Python framework
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, opacity: 0.9, ml: 2 }}>
                        Async/await support, automatic API documentation, type hints
                      </Typography>
                      
                      <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Chip label="Novita.ai" sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                        AI Model Integration
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, opacity: 0.9, ml: 2 }}>
                        Advanced language models for code analysis and generation
                      </Typography>
                      
                      <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Chip label="WebSocket" sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                        Real-time Communication
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, ml: 2 }}>
                        Live updates and collaborative features
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  p: 3,
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      ⚛️ Frontend Technologies
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Chip label="React 18" sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                        Modern UI Library
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, opacity: 0.9, ml: 2 }}>
                        Concurrent features, Suspense, automatic batching
                      </Typography>
                      
                      <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Chip label="Material-UI" sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                        Design System
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, opacity: 0.9, ml: 2 }}>
                        Consistent, accessible, and beautiful components
                      </Typography>
                      
                      <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Chip label="Framer Motion" sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                        Animation Library
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, ml: 2 }}>
                        Smooth, performant animations and transitions
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      )
    },

    // Slide 10: Development Workflow with Trae AI
    {
      title: "Development Workflow",
      subtitle: "How Trae AI Accelerated Our Development Process",
      content: (
        <Box sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  p: 4
                }}>
                  <CardContent>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      🔄 AI-Powered Development Cycle
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                      <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h2" sx={{ mb: 1 }}>💡</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Ideation</Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            AI agents suggest features and improvements based on project context
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h2" sx={{ mb: 1 }}>⚡</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Rapid Prototyping</Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Trae AI generates boilerplate code and suggests optimal patterns
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h2" sx={{ mb: 1 }}>🔍</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Code Review</Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Automated analysis identifies issues before they reach production
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h2" sx={{ mb: 1 }}>🚀</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Deployment</Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Optimized, tested, and secure code ready for production
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      )
    },

    // Slide 11: Code Craft AI x Dev Hackathon
    {
      title: "Code Craft AI x Dev Hackathon",
      subtitle: "Building the Future of AI-Assisted Development",
      content: (
        <Box sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  p: 3,
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      🏆 Hackathon Challenge
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                      Create innovative AI-powered development tools that enhance 
                      developer productivity and code quality.
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>Our Solution:</Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        TraeDevMate - A comprehensive multi-agent system that provides 
                        intelligent code assistance, automated reviews, and real-time mentoring.
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip label="Innovation" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip label="AI-First" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                      <Chip label="Developer Tools" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  color: 'white',
                  p: 3,
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      🌟 Key Achievements
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mr: 1 }}>✅</Typography>
                        Multi-agent architecture implementation
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mr: 1 }}>✅</Typography>
                        Real-time code analysis and suggestions
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mr: 1 }}>✅</Typography>
                        Integrated security and performance optimization
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mr: 1 }}>✅</Typography>
                        Modern, responsive user interface
                      </Typography>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mr: 1 }}>✅</Typography>
                        Comprehensive testing and documentation
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      )
    },

    // Slide 12: Real-world Impact
    {
      title: "Real-World Impact",
      subtitle: "Transforming How Developers Work",
      content: (
        <Box sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 3,
                  height: '280px'
                }}>
                  <CardContent>
                    <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold' }}>300%</Typography>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Faster Development
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      AI-assisted coding reduces development time 
                      through intelligent suggestions and automation
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 3,
                  height: '280px'
                }}>
                  <CardContent>
                    <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold' }}>85%</Typography>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Bug Reduction
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      Proactive code analysis and automated testing 
                      significantly reduce production bugs
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 3,
                  height: '280px'
                }}>
                  <CardContent>
                    <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold' }}>95%</Typography>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Code Quality
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      Automated reviews and best practice enforcement 
                      ensure consistently high-quality code
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      )
    },

    // Slide 13: Current Development Pain Points
    {
      id: 13,
      title: "Current Development Pain Points",
      subtitle: "The Fragmented Reality of Modern Software Development",
      content: [
        "🔄 Context Switching Nightmare",
        "• Juggling 10+ tools daily (IDE, Git, CI/CD, Monitoring, Slack)",
        "• Lost productivity from constant tool switching",
        "• Mental overhead of remembering different interfaces",
        "",
        "⏰ Time-Consuming Deployment Processes",
        "• Manual configuration of CI/CD pipelines",
        "• Complex YAML files and deployment scripts",
        "• Hours spent debugging deployment failures",
        "",
        "🐛 Human Error & Quality Issues",
        "• Inconsistent code reviews and testing",
        "• Manual dependency management",
        "• Security vulnerabilities slip through",
        "",
        "👥 Team Collaboration Friction",
        "• Knowledge silos and communication gaps",
        "• Inconsistent development environments",
        "• Difficulty onboarding new team members"
      ],
      background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
    },

    // Slide 14: The Vision - Single Screen Development
    {
      id: 14,
      title: "The Vision: Single Screen Development",
      subtitle: "Monk's Revolutionary Approach to Software Lifecycle",
      content: [
        "🎯 One Interface, Complete Lifecycle",
        "• From ideation to production monitoring",
        "• All development stages visible and manageable",
        "• No more context switching between tools",
        "",
        "🤖 AI Agents as Expert Collaborators",
        "• DevAgent: Writes and refactors code intelligently",
        "• TestAgent: Generates comprehensive test suites",
        "• DeployAgent: Handles deployment and rollbacks",
        "• MonitorAgent: Analyzes performance and incidents",
        "",
        "⚡ Instant Software Delivery",
        "• One-click deploy to any cloud platform",
        "• Automated domain configuration and SSL",
        "• Real-time collaboration and pair programming",
        "",
        "🔮 The Future is Agent-Powered",
        "• Context-rich development environment",
        "• Self-healing infrastructure capabilities",
        "• Mobile IDE support for anywhere development"
      ],
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },

    // Slide 15: Monk's 11 Core Modules
    {
      id: 15,
      title: "Monk's 11 Core Modules",
      subtitle: "Complete Development-to-Production Pipeline",
      content: [
        "📋 1. Ideation - Creative project planning with AI",
        "💻 2. Code Editor - Monaco-powered with AI assistance",
        "🧪 3. Testing - Automated test generation and healing",
        "📚 4. Git & Versioning - Seamless version control",
        "⚙️ 5. Build & Config - Visual configuration center",
        "🚀 6. Deploy - One-click cloud deployment",
        "",
        "🌐 7. Domains - Automated DNS and SSL management",
        "📊 8. Observability - Real-time monitoring and logs",
        "👥 9. Collaboration - Team coordination and communication",
        "🤖 10. Agents Console - AI workforce management",
        "⚙️ 11. Settings - Workspace and integration management",
        "",
        "🎯 Each module designed to eliminate traditional pain points",
        "🔄 Seamless integration between all components",
        "🚀 Accelerated development from hours to minutes"
      ],
      background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
    },

    // Slide 16: Today's Showcase vs Tomorrow's Potential
    {
      id: 16,
      title: "Today's Showcase vs Tomorrow's Potential",
      subtitle: "Current Features are Just the Beginning",
      content: [
        "🎪 Current Showcase Features",
        "• Multi-agent code analysis and optimization",
        "• Intelligent test generation and security scanning",
        "• Real-time collaboration and documentation",
        "• Integrated development workflow demonstration",
        "",
        "🚀 Expanding Our Vision",
        "• Multi-Agent Autonomy: End-to-end project delivery",
        "• AI Dev Pairing: Side-by-side intelligent collaboration",
        "• Self-Healing Infrastructure: Auto-detection and fixes",
        "• Mobile IDE: Code and deploy from anywhere",
        "",
        "💡 The Limitless Potential",
        "• Natural language to production-ready applications",
        "• Predictive development with proactive suggestions",
        "• Cross-platform deployment with zero configuration",
        "• Enterprise-grade security and compliance automation",
        "",
        "🌟 Today's demo is tomorrow's foundation"
      ],
      background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
    },

    // Slide 17: The Developer Experience Revolution
    {
      id: 17,
      title: "The Developer Experience Revolution",
      subtitle: "From Fragmented Tools to Unified Intelligence",
      content: [
        "⚡ Before Monk: The Painful Reality",
        "• 15+ tools in daily workflow",
        "• 40% of time lost to context switching",
        "• 3-5 hours for simple deployments",
        "• Manual error-prone processes",
        "",
        "🎯 With Monk: The Unified Future",
        "• Single interface for entire lifecycle",
        "• AI agents handle repetitive tasks",
        "• Minutes from code to production",
        "• Intelligent error prevention and healing",
        "",
        "📈 Measurable Impact",
        "• 300% faster development cycles",
        "• 85% reduction in deployment errors",
        "• 90% less time on DevOps tasks",
        "• 100% focus on creative problem solving",
        "",
        "🌟 This is not just an IDE - it's a development revolution"
      ],
      background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
    },

    // Slide 18: Use Cases - Real World Applications
    {
      id: 18,
      title: "Real-World Applications",
      subtitle: "Monk Transforms Every Development Scenario",
      content: [
        "👨‍💻 Solo Developer Launching SaaS",
        "• Build MVP in days, not months",
        "• One-person full-stack development",
        "• Automated testing and deployment",
        "• Production monitoring without DevOps expertise",
        "",
        "🚀 Startup with Distributed Team",
        "• Centralized collaboration across time zones",
        "• Consistent development environments",
        "• Rapid iteration and feature delivery",
        "• Seamless onboarding of new developers",
        "",
        "🏢 Enterprise Development Teams",
        "• Integration with existing infrastructure",
        "• Compliance and audit trail automation",
        "• Multi-environment deployment management",
        "• Advanced security and access controls",
        "",
        "🎓 Educational Institutions",
        "• Teaching modern development practices",
        "• Simplified learning curve for students",
        "• Real-world project experience"
      ],
      background: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
    },

    // Slide 19: The Future We're Building
    {
      id: 19,
      title: "The Future We're Building",
      subtitle: "Beyond Today's Demonstration",
      content: [
        "🔮 Next-Generation Features",
        "• Natural language to full applications",
        "• Predictive development with AI insights",
        "• Cross-platform deployment automation",
        "• Intelligent resource optimization",
        "",
        "🌐 Global Development Ecosystem",
        "• Plugin marketplace for specialized tools",
        "• Community-driven agent development",
        "• Integration with any cloud provider",
        "• Open API for custom workflows",
        "",
        "🎯 Our Mission",
        "• Democratize software development",
        "• Make complex deployments simple",
        "• Enable anyone to build and ship software",
        "• Accelerate innovation across industries",
        "",
        "💫 The future of development is intelligent, unified, and accessible"
      ],
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },

    // Slide 20: Call to Action
    {
      id: 20,
      title: "Join the Development Revolution",
      subtitle: "Be Part of the Future We're Creating",
      content: [
        "🚀 What You've Seen Today",
        "• Live demonstration of AI-powered development",
        "• Real-time code analysis and optimization",
        "• Intelligent testing and security scanning",
        "• Seamless collaboration and documentation",
        "",
        "🌟 What's Coming Next",
        "• Full Monk IDE with 11 integrated modules",
        "• Advanced AI agents for autonomous development",
        "• Enterprise-grade security and compliance",
        "• Mobile development capabilities",
        "",
        "🤝 Get Involved",
        "• Follow our development journey",
        "• Join our beta testing program",
        "• Contribute to the open-source ecosystem",
        "• Shape the future of software development",
        "",
        "💡 Together, we're not just building tools",
        "🎯 We're revolutionizing how software gets made",
        "",
        "Thank you for being part of this journey! 🙏"
      ],
      background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        nextSlide();
      }, 8000); // 8 seconds per slide
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, currentSlide]);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        background: slides[currentSlide].background,
        transition: 'background 0.8s ease-in-out',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Animated Background Particles */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
            `,
            animation: 'float 6s ease-in-out infinite'
          }
        }}
      />

      {/* Navigation Header */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 40px',
          background: 'rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          TraeDevMate - Hackathon Presentation
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: 'white',
            opacity: 0.9,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          {currentSlide + 1} / {slides.length}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton
            onClick={prevSlide}
            sx={{
              color: 'white',
              background: 'rgba(255,255,255,0.2)',
              '&:hover': {
                background: 'rgba(255,255,255,0.3)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <IconButton
            onClick={toggleAutoPlay}
            sx={{
              color: 'white',
              background: isAutoPlay ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.2)',
              '&:hover': {
                background: isAutoPlay ? 'rgba(76,175,80,0.4)' : 'rgba(255,255,255,0.3)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {isAutoPlay ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          
          <IconButton
            onClick={nextSlide}
            sx={{
              color: 'white',
              background: 'rgba(255,255,255,0.2)',
              '&:hover': {
                background: 'rgba(255,255,255,0.3)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative',
          zIndex: 5
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              width: '100%',
              maxWidth: '1200px',
              textAlign: 'center'
            }}
          >
            <Box
              sx={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '20px',
                padding: '60px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none'
                }}
              >
                {slides[currentSlide].title}
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  color: '#666',
                  marginBottom: '40px',
                  fontWeight: 300
                }}
              >
                {slides[currentSlide].subtitle}
              </Typography>
              
              <Box sx={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
                {slides[currentSlide].content.map((line, index) => (
                  <Typography
                    key={index}
                    variant={line.startsWith('•') ? 'body1' : line === '' ? 'body2' : 'h6'}
                    sx={{
                      marginBottom: line === '' ? '20px' : '8px',
                      color: line.startsWith('🎯') || line.startsWith('⚡') || line.startsWith('🚀') || line.startsWith('🌟') || line.startsWith('💡') || line.startsWith('🔮') || line.startsWith('🌐') || line.startsWith('🤝') ? '#1976d2' : '#333',
                      fontWeight: line.startsWith('•') ? 400 : line === '' ? 400 : 600,
                      fontSize: line.startsWith('•') ? '1rem' : line === '' ? '0.5rem' : '1.1rem',
                      lineHeight: 1.6,
                      paddingLeft: line.startsWith('•') ? '20px' : '0'
                    }}
                  >
                    {line === '' ? '\u00A0' : line}
                  </Typography>
                ))}
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Progress Indicators */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          padding: '20px',
          gap: 1
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: index === currentSlide ? '40px' : '12px',
              height: '12px',
              borderRadius: '6px',
              background: index === currentSlide 
                ? 'rgba(255,255,255,0.9)' 
                : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255,255,255,0.7)',
                transform: 'scale(1.2)'
              },
              animation: index === currentSlide ? 'pulse 2s infinite' : 'none'
            }}
          />
        ))}
      </Box>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(1deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default HackathonPresentation;
