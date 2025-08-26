import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { Send, SmartToy, Person } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Socket } from 'socket.io-client';

const ChatContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 100px)',
  display: 'flex',
  flexDirection: 'column',
}));

const ChatHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const MessageItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'flex-end',
}));

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  socket: Socket | null;
  sessionId: string | null;
  language: 'ar' | 'en';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  socket,
  sessionId,
  language
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (socket) {
      socket.on('ai-response', (data: { message: string; actions: any[] }) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        setIsLoading(false);
      });

      socket.on('error', (error: { message: string }) => {
        setError(error.message);
        setIsLoading(false);
      });
    }

    return () => {
      if (socket) {
        socket.off('ai-response');
        socket.off('error');
      }
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !socket || !sessionId || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      socket.emit('user-message', {
        sessionId,
        message: inputValue
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setError('فشل في إرسال الرسالة');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const getWelcomeMessage = () => {
    if (language === 'ar') {
      return `مرحباً بك في مساعد البرمجة الذكي! 🚀

يمكنني مساعدتك في:
• إنشاء مشاريع ويب جديدة (Next.js, React, Vite)
• تعديل وتطوير الكود الموجود
• إضافة ميزات جديدة
• حل المشاكل البرمجية
• نشر المشاريع

اكتب طلبك وسأساعدك في تنفيذه!`;
    } else {
      return `Welcome to AI Coding Assistant! 🚀

I can help you with:
• Creating new web projects (Next.js, React, Vite)
• Modifying and developing existing code
• Adding new features
• Solving programming problems
• Deploying projects

Type your request and I'll help you implement it!`;
    }
  };

  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date()
      }]);
    }
  }, [language]);

  return (
    <ChatContainer>
      <ChatHeader>
        <Typography variant="h5" gutterBottom>
          {language === 'ar' ? 'المحادثة مع المساعد الذكي' : 'Chat with AI Assistant'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {language === 'ar' 
            ? 'اكتب طلبك وسأساعدك في تطوير تطبيقك' 
            : 'Type your request and I\'ll help you develop your application'
          }
        </Typography>
      </ChatHeader>

      <MessagesContainer>
        <List>
          {messages.map((message) => (
            <MessageItem key={message.id}>
              <Avatar
                sx={{
                  bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                  mr: 2
                }}
              >
                {message.role === 'user' ? <Person /> : <SmartToy />}
              </Avatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {message.role === 'user' 
                        ? (language === 'ar' ? 'أنت' : 'You')
                        : (language === 'ar' ? 'المساعد الذكي' : 'AI Assistant')
                      }
                    </Typography>
                    <Chip
                      label={message.timestamp.toLocaleTimeString('ar-SA')}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6,
                      fontFamily: 'inherit'
                    }}
                  >
                    {message.content}
                  </Typography>
                }
              />
            </MessageItem>
          ))}
          
          {isLoading && (
            <MessageItem>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <SmartToy />
              </Avatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {language === 'ar' ? 'المساعد الذكي' : 'AI Assistant'}
                    </Typography>
                    <CircularProgress size={16} />
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                  </Typography>
                }
              />
            </MessageItem>
          )}
        </List>
        <div ref={messagesEndRef} />
      </MessagesContainer>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <InputContainer>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            language === 'ar' 
              ? 'اكتب طلبك هنا... مثال: أنشئ مشروع Next.js جديد'
              : 'Type your request here... Example: Create a new Next.js project'
          }
          variant="outlined"
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          sx={{ minWidth: 60, height: 56 }}
        >
          <Send />
        </Button>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatInterface;