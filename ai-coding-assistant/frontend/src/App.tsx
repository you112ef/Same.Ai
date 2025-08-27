import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { io, Socket } from 'socket.io-client';
import {
  ChatInterface,
  FileExplorer,
  LivePreview,
  VersionControl,
  TodoList,
  Sidebar
} from './components';

// Create theme with Arabic typography support
const theme = createTheme({
  direction: 'ltr', // Can be changed to 'rtl' for Arabic
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

interface Session {
  id: string;
  language: 'ar' | 'en';
  projectType: string;
  history: string[];
  todos: any[];
  lastActivity: string;
}

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [session, setSession] = useState<Session | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [language, setLanguage] = useState<'ar' | 'en'>('en');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:3001');
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      setError('');
      
      // Create new session
      newSocket.emit('create-session', {
        language: language,
        projectType: 'general'
      });
    });

    newSocket.on('session-created', (data: { sessionId: string, session: Session }) => {
      setSessionId(data.sessionId);
      setSession(data.session);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      setError('Connection lost. Trying to reconnect...');
    });

    newSocket.on('error', (data: { message: string }) => {
      setError(data.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [language]);

  const handleLanguageChange = (newLanguage: 'ar' | 'en') => {
    setLanguage(newLanguage);
    if (socket && sessionId) {
      socket.emit('update-session', { sessionId, language: newLanguage });
    }
  };

  const renderActiveTab = () => {
    if (!socket || !sessionId) return null;

    switch (activeTab) {
      case 0:
        return <ChatInterface socket={socket} sessionId={sessionId} language={language} />;
      case 1:
        return <FileExplorer socket={socket} sessionId={sessionId} language={language} />;
      case 2:
        return <LivePreview socket={socket} sessionId={sessionId} language={language} />;
      case 3:
        return <VersionControl socket={socket} sessionId={sessionId} language={language} />;
      case 4:
        return <TodoList socket={socket} sessionId={sessionId} language={language} />;
      default:
        return <ChatInterface socket={socket} sessionId={sessionId} language={language} />;
    }
  };

  if (!isConnected) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <div>Connecting to server...</div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isConnected={isConnected}
          sessionId={sessionId}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {renderActiveTab()}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;