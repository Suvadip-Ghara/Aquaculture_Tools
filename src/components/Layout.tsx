import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme as useMuiTheme,
  useMediaQuery,
  Button,
  Container,
  Divider,
  Avatar,
  Fab,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Header from './Header';
import Footer from './Footer';
import {
  WaterDrop,
  Restaurant,
  ShowChart,
  Calculate,
  Science,
  Inventory,
  Assessment,
  Event,
  Info,
  GitHub,
  Air,
  Recycling,
  MonitorHeart,
  WaterOutlined,
  Layers,
  BoltOutlined,
  WbSunny,
  TrendingUp,
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

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactElement;
  description: string;
}

const navItems: { category: string; items: NavItem[] }[] = [
  {
    category: '💧 Water Management',
    items: [
      { name: '💧 Water Quality', path: '/water-quality', icon: <WaterDrop />, description: 'Monitor water parameters' },
      { name: '🌊 Water Quality Monitor', path: '/water-quality-monitor', icon: <WaterDrop />, description: 'Advanced water monitoring' },
      { name: '📊 Water Quality Predictor', path: '/water-quality-predictor', icon: <WaterfallChart />, description: 'Predict water parameters' },
      { name: '💨 Pond Evaporation', path: '/pond-evaporation', icon: <WaterOutlined />, description: 'Calculate water loss' },
      { name: '🏊 Pond Sediment', path: '/pond-sediment', icon: <Layers />, description: 'Manage sediment buildup' },
      { name: '🧪 Pond Liming', path: '/pond-liming', icon: <Science />, description: 'Calculate lime requirements' },
      { name: '🏗️ Pond Lining', path: '/pond-lining', icon: <Construction />, description: 'Calculate lining costs' },
    ]
  },
  {
    category: '🐟 Fish Management',
    items: [
      { name: '📈 Growth Tracker', path: '/growth-tracker', icon: <ShowChart />, description: 'Track growth rates' },
      { name: '📊 Growth Benchmark', path: '/growth-benchmark', icon: <TrendingUp />, description: 'Compare growth rates' },
      { name: '📈 Growth Predictor', path: '/growth-predictor', icon: <Timeline />, description: 'Predict fish growth' },
      { name: '❤️ Fish Stress Monitor', path: '/fish-stress', icon: <MonitorHeart />, description: 'Monitor fish stress levels' },
      { name: '🔢 Fish Calculator', path: '/fish-calculator', icon: <Calculate />, description: 'Fish calculations' },
      { name: '📊 Fish Stocking Calculator', path: '/fish-stocking', icon: <BarChart />, description: 'Calculate stocking density' },
      { name: '⚖️ Fish Yield Calculator', path: '/fish-yield', icon: <MonitorWeight />, description: 'Calculate fish yield' },
    ]
  },
  {
    category: '🍽️ Feed Management',
    items: [
      { name: '🍽️ Feed Management', path: '/feed-management', icon: <Restaurant />, description: 'Optimize feeding' },
      { name: '🧮 FCR Calculator', path: '/fcr-calculator', icon: <Calculate />, description: 'Calculate feed conversion' },
      { name: '⚡ FCR Optimizer', path: '/fcr-optimizer', icon: <Speed />, description: 'Optimize feed conversion' },
      { name: '🍽️ Feeding Calculator', path: '/feeding-calculator', icon: <LocalDining />, description: 'Calculate feeding amounts' },
    ]
  },
  {
    category: '🏥 Health Management',
    items: [
      { name: '🔬 Disease Prevention', path: '/disease-prevention', icon: <Science />, description: 'Prevent diseases' },
      { name: '⚕️ Disease Risk Assessment', path: '/disease-risk', icon: <Analytics />, description: 'Assess disease risks' },
      { name: '♻️ Waste to Fertilizer', path: '/waste-fertilizer', icon: <Recycling />, description: 'Convert waste to fertilizer' },
    ]
  },
  {
    category: '🌡️ Environment',
    items: [
      { name: '🌡️ Environmental Monitor', path: '/environmental-monitor', icon: <WbSunny />, description: 'Monitor environment' },
      { name: '⚡ Energy Efficiency', path: '/energy-efficiency', icon: <BoltOutlined />, description: 'Optimize energy usage' },
      { name: '🌤️ Weather Impact', path: '/weather-impact', icon: <WbSunny />, description: 'Analyze weather effects' },
      { name: '💨 Aeration Calculator', path: '/aeration-calculator', icon: <Air />, description: 'Design aeration systems' },
    ]
  },
  {
    category: '📊 Business Tools',
    items: [
      { name: '📈 Market Analysis', path: '/market-analysis', icon: <AttachMoney />, description: 'Analyze market trends' },
      { name: '💰 Profitability Calculator', path: '/profitability', icon: <AttachMoney />, description: 'Calculate profits' },
      { name: '⏲️ Harvest Timing Advisor', path: '/harvest-timing', icon: <Timer />, description: 'Optimize harvest timing' },
      { name: '📦 Inventory', path: '/inventory', icon: <Inventory />, description: 'Manage stock' },
      { name: '📊 Reports', path: '/reports', icon: <Assessment />, description: 'Generate reports' },
      { name: '📅 Production Calendar', path: '/calendar', icon: <Event />, description: 'Plan production' },
    ]
  }
];

export default function Layout({ children }: LayoutProps) {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const location = useLocation();

  const isToolPage = location.pathname !== '/' && 
                    location.pathname !== '/about' && 
                    location.pathname !== '/team' && 
                    location.pathname !== '/contact' &&
                    location.pathname !== '/privacy' &&
                    location.pathname !== '/disclaimer';

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          src="/logo.png" 
          sx={{ width: 40, height: 40 }}
          alt="Aquaculture Tools"
        />
        <Typography variant="h6" noWrap component="div">
          Tools
        </Typography>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
            {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
      </Box>
      <Divider />
      <List>
        {navItems.map((category) => (
          <React.Fragment key={category.category}>
            <ListItem sx={{ py: 1, px: 3 }}>
              <Typography variant="subtitle1" color="text.secondary">
                {category.category}
              </Typography>
            </ListItem>
            {category.items.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    px: 2.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      },
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {drawerOpen && (
                    <ListItemText 
                      primary={item.name}
                      secondary={item.description}
                      secondaryTypographyProps={{
                        sx: { 
                          display: { xs: 'none', sm: 'block' },
                          color: location.pathname === item.path ? 'primary.contrastText' : 'text.secondary'
                        }
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Header />
      <Box sx={{ display: 'flex', flex: 1 }}>
        {isToolPage && (
          <Box
            component="nav"
            sx={{ 
              width: drawerOpen ? { sm: drawerWidth } : { sm: theme.spacing(9) },
              flexShrink: { sm: 0 },
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }}
          >
            {/* Mobile drawer */}
            {isMobile && (
              <Drawer
                variant="temporary"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
                sx={{
                  display: { xs: 'block', sm: 'none' },
                  '& .MuiDrawer-paper': { 
                    boxSizing: 'border-box',
                    width: drawerWidth,
                  },
                }}
              >
                {drawer}
              </Drawer>
            )}
            {/* Desktop drawer */}
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box',
                  width: drawerOpen ? drawerWidth : theme.spacing(9),
                  overflowX: 'hidden',
                  transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
                },
              }}
              open={drawerOpen}
            >
              {drawer}
            </Drawer>
          </Box>
        )}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { 
              sm: isToolPage 
                ? `calc(100% - ${drawerOpen ? drawerWidth : theme.spacing(9)}px)` 
                : '100%' 
            },
            mt: '64px',
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
