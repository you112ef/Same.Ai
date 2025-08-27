import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Tooltip,
  Switch,
  FormControlLabel,
  MenuItem
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  Visibility as VisibilityIcon,
  Phone as PhoneIcon,
  Tablet as TabletIcon,
  Laptop as LaptopIcon,
  Computer as DesktopIcon,
  OpenInNew as OpenInNewIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const LivePreviewContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default
}));

const PreviewToolbar = styled(Toolbar)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1)
}));

const PreviewArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  gap: theme.spacing(2)
}));

const PreviewFrame = styled(Box)(({ theme }) => ({
  flex: 1,
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: '#fff',
  position: 'relative'
}));

const ResponsiveFrame = styled(Box)<{ device: string }>(({ theme, device }) => ({
  width: device === 'mobile' ? '375px' : device === 'tablet' ? '768px' : device === 'laptop' ? '1024px' : '100%',
  height: device === 'mobile' ? '667px' : device === 'tablet' ? '1024px' : device === 'laptop' ? '768px' : '100%',
  margin: '0 auto',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: '#fff',
  transition: 'all 0.3s ease'
}));

const CodeViewer = styled(Box)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.grey[100],
  fontFamily: 'monospace',
  fontSize: '14px',
  lineHeight: '1.5',
  padding: theme.spacing(2),
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word'
}));

const DeviceToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1
}));

interface LivePreviewProps {
  socket: any;
  sessionId: string;
  language: 'ar' | 'en';
}

const LivePreview: React.FC<LivePreviewProps> = ({ socket, sessionId, language }) => {
  const [currentProject, setCurrentProject] = useState<string>('');
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<number>(0);
  const [device, setDevice] = useState<string>('desktop');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(5000);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const previewRef = useRef<HTMLIFrameElement>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const t = {
    ar: {
      title: 'معاينة مباشرة',
      preview: 'معاينة',
      code: 'الكود',
      settings: 'الإعدادات',
      refresh: 'تحديث',
      fullscreen: 'ملء الشاشة',
      exitFullscreen: 'خروج من ملء الشاشة',
      autoRefresh: 'تحديث تلقائي',
      refreshInterval: 'فترة التحديث (مللي ثانية)',
      save: 'حفظ',
      cancel: 'إلغاء',
      noProject: 'لا يوجد مشروع محدد',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      mobile: 'جوال',
      tablet: 'تابلت',
      laptop: 'لابتوب',
      desktop: 'سطح المكتب',
      responsive: 'متجاوب',
      download: 'تحميل',
      share: 'مشاركة',
      openInNewTab: 'فتح في تبويب جديد',
      projectFiles: 'ملفات المشروع',
      selectFile: 'اختر ملفاً',
      noFileSelected: 'لم يتم اختيار ملف',
      fileNotFound: 'الملف غير موجود',
      buildProject: 'بناء المشروع',
      runProject: 'تشغيل المشروع',
      stopProject: 'إيقاف المشروع',
      projectStatus: 'حالة المشروع',
      running: 'قيد التشغيل',
      stopped: 'متوقف',
      building: 'قيد البناء',
      failed: 'فشل'
    },
    en: {
      title: 'Live Preview',
      preview: 'Preview',
      code: 'Code',
      settings: 'Settings',
      refresh: 'Refresh',
      fullscreen: 'Fullscreen',
      exitFullscreen: 'Exit Fullscreen',
      autoRefresh: 'Auto Refresh',
      refreshInterval: 'Refresh Interval (ms)',
      save: 'Save',
      cancel: 'Cancel',
      noProject: 'No project selected',
      loading: 'Loading...',
      error: 'An error occurred',
      mobile: 'Mobile',
      tablet: 'Tablet',
      laptop: 'Laptop',
      desktop: 'Desktop',
      responsive: 'Responsive',
      download: 'Download',
      share: 'Share',
      openInNewTab: 'Open in New Tab',
      projectFiles: 'Project Files',
      selectFile: 'Select File',
      noFileSelected: 'No file selected',
      fileNotFound: 'File not found',
      buildProject: 'Build Project',
      runProject: 'Run Project',
      stopProject: 'Stop Project',
      projectStatus: 'Project Status',
      running: 'Running',
      stopped: 'Stopped',
      building: 'Building',
      failed: 'Failed'
    }
  };

  useEffect(() => {
    if (socket && sessionId) {
      loadProjectInfo();
      
      socket.on('project-info-loaded', handleProjectInfoLoaded);
      socket.on('preview-updated', handlePreviewUpdated);
      socket.on('file-content-loaded', handleFileContentLoaded);
      socket.on('project-built', handleProjectBuilt);
      socket.on('project-started', handleProjectStarted);
      socket.on('project-stopped', handleProjectStopped);
      socket.on('error', handleError);

      return () => {
        socket.off('project-info-loaded');
        socket.off('preview-updated');
        socket.off('file-content-loaded');
        socket.off('project-built');
        socket.off('project-started');
        socket.off('project-stopped');
        socket.off('error');
      };
    }
  }, [socket, sessionId]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        refreshPreview();
      }, refreshInterval);
    } else if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval]);

  const loadProjectInfo = () => {
    if (socket && sessionId) {
      setIsLoading(true);
      setError('');
      socket.emit('get-project-info', { sessionId });
    }
  };

  const handleProjectInfoLoaded = (data: { project: string, files: string[] }) => {
    setCurrentProject(data.project);
    setIsLoading(false);
    if (data.files.length > 0) {
      setCurrentFile(data.files[0]);
      loadFileContent(data.files[0]);
    }
  };

  const handlePreviewUpdated = (data: { content: string, file: string }) => {
    setPreviewContent(data.content);
    setIsLoading(false);
  };

  const handleFileContentLoaded = (data: { content: string, file: string }) => {
    setFileContent(data.content);
  };

  const handleProjectBuilt = (data: { success: boolean, message: string }) => {
    if (data.success) {
      refreshPreview();
    } else {
      setError(data.message);
    }
  };

  const handleProjectStarted = (data: { success: boolean, message: string }) => {
    if (data.success) {
      refreshPreview();
    } else {
      setError(data.message);
    }
  };

  const handleProjectStopped = (data: { success: boolean, message: string }) => {
    // Handle project stopped
  };

  const handleError = (data: { message: string }) => {
    setError(data.message);
    setIsLoading(false);
  };

  const refreshPreview = () => {
    if (socket && sessionId && currentFile) {
      setIsLoading(true);
      socket.emit('get-preview', { sessionId, file: currentFile });
    }
  };

  const loadFileContent = (filePath: string) => {
    if (socket && sessionId) {
      socket.emit('read-file', { sessionId, path: filePath });
    }
  };

  const buildProject = () => {
    if (socket && sessionId) {
      setIsLoading(true);
      socket.emit('build-project', { sessionId });
    }
  };

  const runProject = () => {
    if (socket && sessionId) {
      setIsLoading(true);
      socket.emit('run-project', { sessionId });
    }
  };

  const stopProject = () => {
    if (socket && sessionId) {
      socket.emit('stop-project', { sessionId });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filePath = event.target.value;
    setCurrentFile(filePath);
    if (filePath) {
      loadFileContent(filePath);
    }
  };

  const handleFullscreen = () => {
    if (previewRef.current) {
      if (!isFullscreen) {
        previewRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const openInNewTab = () => {
    if (previewContent) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(previewContent);
        newWindow.document.close();
      }
    }
  };

  const downloadPreview = () => {
    if (previewContent) {
      const blob = new Blob([previewContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'preview.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <PhoneIcon />;
      case 'tablet': return <TabletIcon />;
      case 'laptop': return <LaptopIcon />;
      default: return <DesktopIcon />;
    }
  };

  const getDeviceLabel = (deviceType: string) => {
    return t[language][deviceType as keyof typeof t[typeof language]];
  };

  return (
    <LivePreviewContainer>
      <PreviewToolbar>
        <Typography variant="h6" component="h2" sx={{ flex: 1 }}>
          {t[language].title}
        </Typography>

        <DeviceToggle>
          <Tooltip title={t[language].mobile}>
            <IconButton
              size="small"
              color={device === 'mobile' ? 'primary' : 'default'}
              onClick={() => setDevice('mobile')}
            >
              <PhoneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t[language].tablet}>
            <IconButton
              size="small"
              color={device === 'tablet' ? 'primary' : 'default'}
              onClick={() => setDevice('tablet')}
            >
              <TabletIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t[language].laptop}>
            <IconButton
              size="small"
              color={device === 'laptop' ? 'primary' : 'default'}
              onClick={() => setDevice('laptop')}
            >
              <LaptopIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t[language].desktop}>
            <IconButton
              size="small"
              color={device === 'desktop' ? 'primary' : 'default'}
              onClick={() => setDevice('desktop')}
            >
              <DesktopIcon />
            </IconButton>
          </Tooltip>
        </DeviceToggle>

        <Button
          variant="outlined"
          startIcon={<CodeIcon />}
          onClick={() => setShowCode(!showCode)}
        >
          {showCode ? t[language].preview : t[language].code}
        </Button>

        <Tooltip title={t[language].buildProject}>
          <IconButton onClick={buildProject} disabled={isLoading}>
            <CircularProgress size={20} />
          </IconButton>
        </Tooltip>

        <Tooltip title={t[language].runProject}>
          <IconButton onClick={runProject} disabled={isLoading}>
            <PlayArrowIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={t[language].stopProject}>
          <IconButton onClick={stopProject}>
            <StopIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={t[language].refresh}>
          <IconButton onClick={refreshPreview} disabled={isLoading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={t[language].fullscreen}>
          <IconButton onClick={handleFullscreen}>
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title={t[language].settings}>
          <IconButton onClick={() => setShowSettings(true)}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </PreviewToolbar>

      <PreviewArea>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!currentProject ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="h6" color="text.secondary">
              {t[language].noProject}
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="subtitle1" color="text.secondary">
                {t[language].projectFiles}:
              </Typography>
              <TextField
                select
                value={currentFile}
                onChange={handleFileChange}
                variant="outlined"
                size="small"
                sx={{ minWidth: 200 }}
              >
                {['index.html', 'App.jsx', 'main.jsx', 'style.css'].map((file) => (
                  <MenuItem key={file} value={file}>
                    {file}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <PreviewFrame>
              {isLoading && (
                <LoadingOverlay>
                  <CircularProgress />
                </LoadingOverlay>
              )}

              {showCode ? (
                <CodeViewer>
                  {fileContent || t[language].noFileSelected}
                </CodeViewer>
              ) : (
                <ResponsiveFrame device={device}>
                  <iframe
                    ref={previewRef}
                    srcDoc={previewContent}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      backgroundColor: '#fff'
                    }}
                    title="Live Preview"
                  />
                </ResponsiveFrame>
              )}
            </PreviewFrame>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<OpenInNewIcon />}
                onClick={openInNewTab}
                disabled={!previewContent}
              >
                {t[language].openInNewTab}
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={downloadPreview}
                disabled={!previewContent}
              >
                {t[language].download}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={() => navigator.share?.({ title: 'Live Preview', text: 'Check out this preview!' })}
                disabled={!navigator.share}
              >
                {t[language].share}
              </Button>
            </Box>
          </>
        )}
      </PreviewArea>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t[language].settings}</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
            }
            label={t[language].autoRefresh}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t[language].refreshInterval}
            type="number"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            disabled={!autoRefresh}
            inputProps={{ min: 1000, step: 1000 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>
            {t[language].cancel}
          </Button>
          <Button onClick={() => setShowSettings(false)} variant="contained">
            {t[language].save}
          </Button>
        </DialogActions>
      </Dialog>
    </LivePreviewContainer>
  );
};

export default LivePreview;