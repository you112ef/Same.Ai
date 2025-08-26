import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Chip,
  Button,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const SidebarContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const LanguageToggle = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  language: 'ar' | 'en';
  onLanguageChange: (language: 'ar' | 'en') => void;
  isConnected: boolean;
  sessionId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  language,
  onLanguageChange,
  isConnected,
  sessionId
}) => {
  return (
    <StyledDrawer variant="permanent" anchor="right">
      <SidebarHeader>
        <Typography variant="h6" component="h1" gutterBottom>
          مساعد البرمجة الذكي
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          AI Coding Assistant
        </Typography>
        
        {sessionId && (
          <Chip
            label={`الجلسة: ${sessionId.substring(0, 8)}...`}
            size="small"
            sx={{ mt: 1, backgroundColor: 'rgba(255,255,255,0.2)' }}
          />
        )}
      </SidebarHeader>

      <SidebarContent>
        <List>
          {tabs.map((tab) => (
            <ListItem key={tab.id} disablePadding>
              <ListItemButton
                selected={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
                </ListItemIcon>
                <ListItemText 
                  primary={tab.label}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: activeTab === tab.id ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {language === 'ar' ? 'حالة الاتصال' : 'Connection Status'}
          </Typography>
          <Chip
            label={isConnected ? (language === 'ar' ? 'متصل' : 'Connected') : (language === 'ar' ? 'غير متصل' : 'Disconnected')}
            color={isConnected ? 'success' : 'error'}
            size="small"
            sx={{ width: '100%' }}
          />
        </Box>
      </SidebarContent>

      <LanguageToggle>
        <Typography variant="subtitle2" gutterBottom>
          {language === 'ar' ? 'اللغة' : 'Language'}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant={language === 'ar' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => onLanguageChange('ar')}
            sx={{ flex: 1 }}
          >
            العربية
          </Button>
          <Button
            variant={language === 'en' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => onLanguageChange('en')}
            sx={{ flex: 1 }}
          >
            English
          </Button>
        </Stack>
      </LanguageToggle>
    </StyledDrawer>
  );
};

export default Sidebar;