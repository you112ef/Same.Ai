import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Box, Container, Paper, Typography, Alert, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatInterface from './components/ChatInterface';
import FileExplorer from './components/FileExplorer';
import LivePreview from './components/LivePreview';
import VersionControl from './components/VersionControl';
import TodoList from './components/TodoList';
import Sidebar from './components/Sidebar';

// Styled components
const AppContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const MainContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
}));

const ContentArea = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  overflow: 'auto',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  gap: theme.spacing(2),
}));

interface Session {
  id: string;
  language: 'ar' | 'en';
  projectType: string;
  files: Map<string, any>;
  history: any[];
  todos: any[];
  createdAt: Date;
  lastActivity: Date;
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create Socket connection
    const newSocket = io('http://localhost:3000', {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setError(null);
      
      // Create new session
      newSocket.emit('create-session', {
        language: language,
        projectType: 'nextjs'
      });
    });

    newSocket.on('session-created', (data: { sessionId: string; session: Session }) => {
      console.log('Session created:', data);
      setSessionId(data.sessionId);
      setSession(data.session);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      setError('انقطع الاتصال بالخادم');
    });

    newSocket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error);
      setError(error.message);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [language]);

  const handleLanguageChange = (newLanguage: 'ar' | 'en') => {
    setLanguage(newLanguage);
    // Recreate session with new language
    if (socket && isConnected) {
      socket.emit('create-session', {
        language: newLanguage,
        projectType: 'nextjs'
      });
    }
  };

  const tabs = [
    { id: 'chat', label: language === 'ar' ? 'المحادثة' : 'Chat', icon: '💬' },
    { id: 'files', label: language === 'ar' ? 'الملفات' : 'Files', icon: '📁' },
    { id: 'preview', label: language === 'ar' ? 'المعاينة' : 'Preview', icon: '👁️' },
    { id: 'versions', label: language === 'ar' ? 'الإصدارات' : 'Versions', icon: '📋' },
    { id: 'todos', label: language === 'ar' ? 'المهام' : 'Todos', icon: '✅' }
  ];

  if (!isConnected) {
    return (
      <LoadingContainer>
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          {language === 'ar' ? 'جاري الاتصال بالخادم...' : 'Connecting to server...'}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </LoadingContainer>
    );
  }

  return (
    <AppContainer>
      <MainContent>
        <Sidebar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          language={language}
          onLanguageChange={handleLanguageChange}
          isConnected={isConnected}
          sessionId={sessionId}
        />
        
        <ContentArea>
          {activeTab === 'chat' && (
            <ChatInterface 
              socket={socket}
              sessionId={sessionId}
              language={language}
            />
          )}
          
          {activeTab === 'files' && (
            <FileExplorer 
              sessionId={sessionId}
              language={language}
            />
          )}
          
          {activeTab === 'preview' && (
            <LivePreview 
              sessionId={sessionId}
              language={language}
            />
          )}
          
          {activeTab === 'versions' && (
            <VersionControl 
              sessionId={sessionId}
              language={language}
            />
          )}
          
          {activeTab === 'todos' && (
            <TodoList 
              sessionId={sessionId}
              language={language}
            />
          )}
        </ContentArea>
      </MainContent>
    </AppContainer>
  );
}

export default App;