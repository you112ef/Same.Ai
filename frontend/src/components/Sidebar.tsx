import React from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Chat as ChatIcon,
  Folder as FolderIcon,
  Visibility as PreviewIcon,
  History as HistoryIcon,
  CheckCircle as TodoIcon,
  Language as LanguageIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon
} from '@mui/icons-material';

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
  const isRTL = language === 'ar';

  const getTabIcon = (icon: string) => {
    switch (icon) {
      case '💬': return <ChatIcon />;
      case '📁': return <FolderIcon />;
      case '👁️': return <PreviewIcon />;
      case '📋': return <HistoryIcon />;
      case '✅': return <TodoIcon />;
      default: return <ChatIcon />;
    }
  };

  const handleLanguageToggle = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    onLanguageChange(newLanguage);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: 280,
        minHeight: '100vh',
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText', textAlign: isRTL ? 'right' : 'left' }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          {language === 'ar' ? 'مساعد البرمجة' : 'AI Coding'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {language === 'ar' ? 'المساعد الذكي للتطوير' : 'Smart Development Assistant'}
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {isConnected ? <WifiIcon color="success" /> : <WifiOffIcon color="error" />}
          <Typography variant="body2" color={isConnected ? 'success.main' : 'error.main'}>
            {isConnected ? (language === 'ar' ? 'متصل' : 'Connected') : (language === 'ar' ? 'غير متصل' : 'Disconnected')}
          </Typography>
        </Box>
        
        {sessionId && (
          <Chip
            label={language === 'ar' ? 'جلسة نشطة' : 'Active Session'}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      <Divider />

      <Box sx={{ flex: 1 }}>
        <List sx={{ p: 0 }}>
          {tabs.map((tab) => (
            <ListItem key={tab.id} sx={{ p: 0 }}>
              <ListItemButton
                selected={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
                sx={{
                  py: 2,
                  px: 3,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': { bgcolor: 'primary.light' },
                  },
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ListItemIcon sx={{ color: activeTab === tab.id ? 'inherit' : 'text.secondary', minWidth: 40 }}>
                  {getTabIcon(tab.icon)}
                </ListItemIcon>
                <ListItemText
                  primary={tab.label}
                  sx={{ textAlign: isRTL ? 'right' : 'left' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Tooltip title={language === 'ar' ? 'تغيير اللغة' : 'Change Language'}>
            <IconButton onClick={handleLanguageToggle} size="small" sx={{ color: 'text.secondary' }}>
              <LanguageIcon />
            </IconButton>
          </Tooltip>
          
          <Typography variant="caption" color="text.secondary">
            {language === 'ar' ? 'الإصدار 1.0.0' : 'v1.0.0'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Sidebar;