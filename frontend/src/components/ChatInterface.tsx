import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  List, 
  ListItem, 
  Avatar,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { Send as SendIcon, SmartToy as BotIcon, Person as UserIcon } from '@mui/icons-material';
import { Socket } from 'socket.io-client';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

interface ChatInterfaceProps {
  socket: Socket | null;
  sessionId: string | null;
  language: 'ar' | 'en';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ socket, sessionId, language }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isRTL = language === 'ar';

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('ai-response', (data: { content: string; metadata?: any }) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: data.content,
        timestamp: new Date(),
        metadata: data.metadata
      };
      setMessages(prev => [...prev, newMessage]);
      setIsLoading(false);
    });

    socket.on('error', (data: { message: string }) => {
      setError(data.message);
      setIsLoading(false);
    });

    return () => {
      socket.off('ai-response');
      socket.off('error');
    };
  }, [socket]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !socket || !sessionId || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      socket.emit('ai-message', {
        sessionId,
        message: inputMessage
      });
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في إرسال الرسالة' : 'Error sending message');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" gutterBottom align={isRTL ? 'right' : 'left'}>
        {language === 'ar' ? 'المحادثة الذكية' : 'AI Chat'}
      </Typography>
      
      <Paper elevation={2} sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', mb: 2 }}>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {messages.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
              <BotIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" align="center">
                {language === 'ar' ? 'مرحباً! كيف يمكنني مساعدتك في تطوير مشروعك؟' : 'Hello! How can I help you develop your project?'}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {messages.map((message) => (
                <ListItem key={message.id} sx={{ display: 'flex', justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start', p: 0, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', maxWidth: '70%', gap: 1 }}>
                    <Avatar sx={{ bgcolor: message.type === 'user' ? 'primary.main' : 'secondary.main', width: 32, height: 32 }}>
                      {message.type === 'user' ? <UserIcon /> : <BotIcon />}
                    </Avatar>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: message.type === 'user' ? 'primary.light' : 'grey.100' }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {message.content}
                      </Typography>
                    </Paper>
                  </Box>
                </ListItem>
              ))}
              
              {isLoading && (
                <ListItem sx={{ display: 'flex', justifyContent: 'flex-start', p: 0, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                      <BotIcon />
                    </Avatar>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.100' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2">
                          {language === 'ar' ? 'جاري الكتابة...' : 'Typing...'}
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                </ListItem>
              )}
              
              <div ref={messagesEndRef} />
            </List>
          )}
        </Box>

        <Divider />
        
        <Box sx={{ p: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
              disabled={isLoading || !socket}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || !socket}
              sx={{ minWidth: 56, height: 56 }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatInterface;