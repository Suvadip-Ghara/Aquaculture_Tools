import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Paper,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import {
  WaterDrop,
  Restaurant,
  ShowChart,
  Calculate,
  Science,
  Inventory,
  Assessment,
  Event,
  TrendingUp,
  MonitorHeart,
  Air,
  Recycling,
  WaterOutlined,
  Layers,
  BoltOutlined,
  WbSunny,
  Construction,
  Timeline,
  Pets,
  LocalDining,
  BarChart,
  MonitorWeight,
  Agriculture,
  Timer,
  AttachMoney,
  Speed,
  Analytics,
  WaterfallChart,
} from '@mui/icons-material';

const toolCategories = [
  {
    category: '💧 Water Management',
    tools: [
      {
        name: '💧 Water Quality',
        description: 'Monitor basic water parameters',
        icon: <WaterDrop />,
        path: '/water-quality',
        color: '#2196f3'
      },
      {
        name: '🌊 Water Quality Monitor',
        description: 'Advanced water quality monitoring',
        icon: <WaterDrop />,
        path: '/water-quality-monitor',
        color: '#1976d2'
      },
      {
        name: '📊 Water Quality Predictor',
        description: 'Predict water quality issues',
        icon: <WaterfallChart />,
        path: '/water-quality-predictor',
        color: '#1565c0'
      },
      {
        name: '💨 Pond Evaporation',
        description: 'Calculate water loss',
        icon: <WaterOutlined />,
        path: '/pond-evaporation',
        color: '#0288d1'
      },
      {
        name: '🏊 Pond Sediment',
        description: 'Manage sediment buildup',
        icon: <Layers />,
        path: '/pond-sediment',
        color: '#0277bd'
      },
      {
        name: '🧪 Pond Liming',
        description: 'Calculate lime requirements',
        icon: <Science />,
        path: '/pond-liming',
        color: '#01579b'
      },
      {
        name: '🏗️ Pond Lining',
        description: 'Calculate lining costs',
        icon: <Construction />,
        path: '/pond-lining',
        color: '#827717'
      },
    ]
  },
  {
    category: '🐟 Fish Management',
    tools: [
      {
        name: '📈 Growth Tracker',
        description: 'Monitor fish growth rates',
        icon: <ShowChart />,
        path: '/growth-tracker',
        color: '#43a047'
      },
      {
        name: '📊 Growth Benchmark',
        description: 'Compare growth rates',
        icon: <TrendingUp />,
        path: '/growth-benchmark',
        color: '#ef6c00'
      },
      {
        name: '📈 Growth Predictor',
        description: 'Predict fish growth',
        icon: <Timeline />,
        path: '/growth-predictor',
        color: '#e65100'
      },
      {
        name: '❤️ Fish Stress Monitor',
        description: 'Monitor fish stress levels',
        icon: <MonitorHeart />,
        path: '/fish-stress',
        color: '#009688'
      },
      {
        name: '🔢 Fish Calculator',
        description: 'Fish calculations',
        icon: <Calculate />,
        path: '/fish-calculator',
        color: '#00796b'
      },
      {
        name: '📊 Fish Stocking Calculator',
        description: 'Calculate stocking density',
        icon: <BarChart />,
        path: '/fish-stocking',
        color: '#00695c'
      },
      {
        name: '⚖️ Fish Yield Calculator',
        description: 'Calculate fish yield',
        icon: <MonitorWeight />,
        path: '/fish-yield',
        color: '#004d40'
      },
    ]
  },
  {
    category: '🍽️ Feed Management',
    tools: [
      {
        name: '🍽️ Feed Management',
        description: 'Optimize feeding schedules',
        icon: <Restaurant />,
        path: '/feed-management',
        color: '#4caf50'
      },
      {
        name: '🧮 FCR Calculator',
        description: 'Calculate feed conversion ratios',
        icon: <Calculate />,
        path: '/fcr-calculator',
        color: '#388e3c'
      },
      {
        name: '⚡ FCR Optimizer',
        description: 'Optimize feed conversion',
        icon: <Speed />,
        path: '/fcr-optimizer',
        color: '#2e7d32'
      },
      {
        name: '🍽️ Feeding Calculator',
        description: 'Calculate feeding amounts',
        icon: <LocalDining />,
        path: '/feeding-calculator',
        color: '#1b5e20'
      },
    ]
  },
  {
    category: '🏥 Health Management',
    tools: [
      {
        name: '🔬 Disease Prevention',
        description: 'Prevent fish diseases',
        icon: <Science />,
        path: '/disease-prevention',
        color: '#9c27b0'
      },
      {
        name: '⚕️ Disease Risk Assessment',
        description: 'Assess disease risks',
        icon: <Analytics />,
        path: '/disease-risk',
        color: '#7b1fa2'
      },
      {
        name: '♻️ Waste to Fertilizer',
        description: 'Convert waste to fertilizer',
        icon: <Recycling />,
        path: '/waste-fertilizer',
        color: '#795548'
      },
    ]
  },
  {
    category: '🌡️ Environment',
    tools: [
      {
        name: '🌡️ Environmental Monitor',
        description: 'Monitor environment',
        icon: <WbSunny />,
        path: '/environmental-monitor',
        color: '#ff8f00'
      },
      {
        name: '⚡ Energy Efficiency',
        description: 'Optimize energy usage',
        icon: <BoltOutlined />,
        path: '/energy-efficiency',
        color: '#ffd600'
      },
      {
        name: '🌤️ Weather Impact',
        description: 'Analyze weather effects',
        icon: <WbSunny />,
        path: '/weather-impact',
        color: '#ff8f00'
      },
      {
        name: '💨 Aeration Calculator',
        description: 'Design aeration systems',
        icon: <Air />,
        path: '/aeration-calculator',
        color: '#0097a7'
      },
    ]
  },
  {
    category: '📊 Business Tools',
    tools: [
      {
        name: '📈 Market Analysis',
        description: 'Analyze market trends',
        icon: <AttachMoney />,
        path: '/market-analysis',
        color: '#f57c00'
      },
      {
        name: '💰 Profitability Calculator',
        description: 'Calculate profits',
        icon: <AttachMoney />,
        path: '/profitability',
        color: '#ef6c00'
      },
      {
        name: '⏲️ Harvest Timing Advisor',
        description: 'Optimize harvest timing',
        icon: <Timer />,
        path: '/harvest-timing',
        color: '#d84315'
      },
      {
        name: '📦 Inventory',
        description: 'Manage stock',
        icon: <Inventory />,
        path: '/inventory',
        color: '#bf360c'
      },
      {
        name: '📊 Reports',
        description: 'Generate reports',
        icon: <Assessment />,
        path: '/reports',
        color: '#3e2723'
      },
      {
        name: '📅 Production Calendar',
        description: 'Plan production',
        icon: <Event />,
        path: '/calendar',
        color: '#263238'
      },
    ]
  }
];

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          🌊 Aquaculture Tools
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Comprehensive suite of tools for modern aquaculture management
        </Typography>
      </Box>

      {/* Tools Section */}
      {toolCategories.map((category) => (
        <Box key={category.category} sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ ml: 2 }}>
            {category.category}
          </Typography>
          <Grid container spacing={3}>
            {category.tools.map((tool) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={tool.path}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: tool.color,
                          color: 'white',
                          mr: 2
                        }}
                      >
                        {tool.icon}
                      </Box>
                      <Typography variant="h6" component="h2">
                        {tool.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {tool.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      component={RouterLink} 
                      to={tool.path}
                      size="small" 
                      color="primary"
                      sx={{ ml: 1, mb: 1 }}
                    >
                      Open Tool
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Container>
  );
}