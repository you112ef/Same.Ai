import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Tooltip,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  Badge,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem
} from '@mui/material';
import {
  History as HistoryIcon,
  Save as SaveIcon,
  RestoreFromTrash as RestoreIcon,
  Delete as DeleteIcon,
  Compare as CompareIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Create as CreateIcon,
  Archive as ArchiveIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  Storage as StorageIcon,
  Code as CodeIcon,
  Folder as FolderIcon,
  FileCopy as FileCopyIcon,
  Diff as DiffIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const VersionControlContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default
}));

const ToolbarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const VersionsListContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2)
}));

const VersionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-2px)'
  }
}));

const VersionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

const VersionStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(1)
}));

const DiffViewer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  fontFamily: 'monospace',
  fontSize: '14px',
  lineHeight: '1.5',
  maxHeight: '400px',
  overflow: 'auto'
}));

const DiffLine = styled(Box)<{ type: 'added' | 'removed' | 'unchanged' }>(({ theme, type }) => ({
  padding: theme.spacing(0.5, 1),
  backgroundColor: type === 'added' ? theme.palette.success.light : 
                 type === 'removed' ? theme.palette.error.light : 
                 'transparent',
  color: type === 'added' ? theme.palette.success.contrastText :
         type === 'removed' ? theme.palette.error.contrastText :
         theme.palette.text.primary,
  borderLeft: `3px solid ${
    type === 'added' ? theme.palette.success.main :
    type === 'removed' ? theme.palette.error.main :
    'transparent'
  }`
}));

interface Version {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  size: number;
  fileCount: number;
  projectType: string;
  tags: string[];
  isCurrent: boolean;
}

interface DiffResult {
  added: string[];
  removed: string[];
  unchanged: string[];
  totalChanges: number;
}

interface VersionControlProps {
  socket: any;
  sessionId: string;
  language: 'ar' | 'en';
}

const VersionControl: React.FC<VersionControlProps> = ({ socket, sessionId, language }) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showCompareDialog, setShowCompareDialog] = useState<boolean>(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState<boolean>(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [snapshotName, setSnapshotName] = useState<string>('');
  const [snapshotDescription, setSnapshotDescription] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [versionToRestore, setVersionToRestore] = useState<string>('');

  const t = {
    ar: {
      title: 'إدارة الإصدارات',
      createSnapshot: 'إنشاء لقطة',
      restoreVersion: 'استعادة إصدار',
      compareVersions: 'مقارنة الإصدارات',
      snapshotName: 'اسم اللقطة',
      snapshotDescription: 'وصف اللقطة',
      create: 'إنشاء',
      restore: 'استعادة',
      compare: 'مقارنة',
      cancel: 'إلغاء',
      delete: 'حذف',
      download: 'تحميل',
      info: 'معلومات',
      noVersions: 'لا توجد إصدارات',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      confirmDelete: 'هل أنت متأكد من حذف هذا الإصدار؟',
      confirmRestore: 'هل أنت متأكد من استعادة هذا الإصدار؟',
      currentVersion: 'الإصدار الحالي',
      versionInfo: 'معلومات الإصدار',
      fileCount: 'عدد الملفات',
      size: 'الحجم',
      timestamp: 'التاريخ والوقت',
      projectType: 'نوع المشروع',
      tags: 'العلامات',
      changes: 'التغييرات',
      added: 'مضاف',
      removed: 'محذوف',
      unchanged: 'غير متغير',
      totalChanges: 'إجمالي التغييرات',
      selectVersions: 'اختر الإصدارات للمقارنة',
      selectVersion: 'اختر الإصدار للاستعادة',
      noChanges: 'لا توجد تغييرات',
      restoreSuccess: 'تم استعادة الإصدار بنجاح',
      restoreError: 'فشل في استعادة الإصدار',
      createSuccess: 'تم إنشاء اللقطة بنجاح',
      createError: 'فشل في إنشاء اللقطة',
      deleteSuccess: 'تم حذف الإصدار بنجاح',
      deleteError: 'فشل في حذف الإصدار'
    },
    en: {
      title: 'Version Control',
      createSnapshot: 'Create Snapshot',
      restoreVersion: 'Restore Version',
      compareVersions: 'Compare Versions',
      snapshotName: 'Snapshot Name',
      snapshotDescription: 'Snapshot Description',
      create: 'Create',
      restore: 'Restore',
      compare: 'Compare',
      cancel: 'Cancel',
      delete: 'Delete',
      download: 'Download',
      info: 'Info',
      noVersions: 'No versions found',
      loading: 'Loading...',
      error: 'An error occurred',
      confirmDelete: 'Are you sure you want to delete this version?',
      confirmRestore: 'Are you sure you want to restore this version?',
      currentVersion: 'Current Version',
      versionInfo: 'Version Information',
      fileCount: 'File Count',
      size: 'Size',
      timestamp: 'Timestamp',
      projectType: 'Project Type',
      tags: 'Tags',
      changes: 'Changes',
      added: 'Added',
      removed: 'Removed',
      unchanged: 'Unchanged',
      totalChanges: 'Total Changes',
      selectVersions: 'Select versions to compare',
      selectVersion: 'Select version to restore',
      noChanges: 'No changes found',
      restoreSuccess: 'Version restored successfully',
      restoreError: 'Failed to restore version',
      createSuccess: 'Snapshot created successfully',
      createError: 'Failed to create snapshot',
      deleteSuccess: 'Version deleted successfully',
      deleteError: 'Failed to delete version'
    }
  };

  useEffect(() => {
    if (socket && sessionId) {
      loadVersions();
      
      socket.on('versions-loaded', handleVersionsLoaded);
      socket.on('snapshot-created', handleSnapshotCreated);
      socket.on('version-restored', handleVersionRestored);
      socket.on('version-deleted', handleVersionDeleted);
      socket.on('versions-compared', handleVersionsCompared);
      socket.on('error', handleError);

      return () => {
        socket.off('versions-loaded');
        socket.off('snapshot-created');
        socket.off('version-restored');
        socket.off('version-deleted');
        socket.off('versions-compared');
        socket.off('error');
      };
    }
  }, [socket, sessionId]);

  const loadVersions = () => {
    if (socket && sessionId) {
      setIsLoading(true);
      setError('');
      socket.emit('get-versions-list', { sessionId });
    }
  };

  const handleVersionsLoaded = (data: { versions: Version[] }) => {
    setVersions(data.versions);
    setIsLoading(false);
  };

  const handleSnapshotCreated = (data: { success: boolean, message: string }) => {
    if (data.success) {
      setShowCreateDialog(false);
      setSnapshotName('');
      setSnapshotDescription('');
      setIsCreating(false);
      loadVersions();
    } else {
      setError(data.message);
      setIsCreating(false);
    }
  };

  const handleVersionRestored = (data: { success: boolean, message: string }) => {
    if (data.success) {
      setShowRestoreDialog(false);
      setVersionToRestore('');
      setIsRestoring(false);
      loadVersions();
    } else {
      setError(data.message);
      setIsRestoring(false);
    }
  };

  const handleVersionDeleted = (data: { success: boolean, message: string }) => {
    if (data.success) {
      loadVersions();
    } else {
      setError(data.message);
    }
  };

  const handleVersionsCompared = (data: { diff: DiffResult }) => {
    setDiffResult(data.diff);
    setShowCompareDialog(true);
  };

  const handleError = (data: { message: string }) => {
    setError(data.message);
    setIsLoading(false);
    setIsCreating(false);
    setIsRestoring(false);
  };

  const createSnapshot = () => {
    if (!snapshotName.trim()) return;
    
    setIsCreating(true);
    if (socket && sessionId) {
      socket.emit('create-snapshot', { 
        sessionId, 
        name: snapshotName, 
        description: snapshotDescription 
      });
    }
  };

  const restoreVersion = () => {
    if (!versionToRestore) return;
    
    if (confirm(t[language].confirmRestore)) {
      setIsRestoring(true);
      if (socket && sessionId) {
        socket.emit('restore-version', { 
          sessionId, 
          versionId: versionToRestore 
        });
      }
    }
  };

  const deleteVersion = (versionId: string) => {
    if (confirm(t[language].confirmDelete)) {
      if (socket && sessionId) {
        socket.emit('delete-version', { 
          sessionId, 
          versionId 
        });
      }
    }
  };

  const compareVersions = () => {
    if (selectedVersions.length !== 2) return;
    
    if (socket && sessionId) {
      socket.emit('compare-versions', { 
        sessionId, 
        versionIds: selectedVersions 
      });
    }
  };

  const downloadVersion = (versionId: string) => {
    if (socket && sessionId) {
      socket.emit('download-version', { 
        sessionId, 
        versionId 
      });
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleVersionSelection = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    }
  };

  return (
    <VersionControlContainer>
      <ToolbarContainer>
        <Typography variant="h6" component="h2" sx={{ flex: 1 }}>
          {t[language].title}
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<CreateIcon />}
          onClick={() => setShowCreateDialog(true)}
        >
          {t[language].createSnapshot}
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<RestoreIcon />}
          onClick={() => setShowRestoreDialog(true)}
        >
          {t[language].restoreVersion}
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<CompareIcon />}
          onClick={compareVersions}
          disabled={selectedVersions.length !== 2}
        >
          {t[language].compareVersions}
        </Button>
        
        <IconButton onClick={loadVersions} disabled={isLoading}>
          <RefreshIcon />
        </IconButton>
      </ToolbarContainer>

      <VersionsListContainer>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>{t[language].loading}</Typography>
          </Box>
        ) : versions.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="h6" color="text.secondary">
              {t[language].noVersions}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {versions.map((version) => (
              <Grid item xs={12} md={6} lg={4} key={version.id}>
                <VersionCard>
                  <CardContent>
                    <VersionHeader>
                      <Typography variant="h6" component="h3">
                        {version.name}
                      </Typography>
                      {version.isCurrent && (
                        <Chip
                          label={t[language].currentVersion}
                          color="primary"
                          size="small"
                        />
                      )}
                    </VersionHeader>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {version.description}
                    </Typography>
                    
                    <VersionStats>
                      <Chip
                        icon={<CalendarIcon />}
                        label={formatDate(version.timestamp)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<StorageIcon />}
                        label={formatFileSize(version.size)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<FileCopyIcon />}
                        label={`${version.fileCount} ${t[language].fileCount}`}
                        size="small"
                        variant="outlined"
                      />
                    </VersionStats>
                    
                    {version.tags.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {version.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions>
                    <Tooltip title={t[language].info}>
                      <IconButton size="small">
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title={t[language].download}>
                      <IconButton 
                        size="small"
                        onClick={() => downloadVersion(version.id)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title={t[language].delete}>
                      <IconButton 
                        size="small"
                        color="error"
                        onClick={() => deleteVersion(version.id)}
                        disabled={version.isCurrent}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Box sx={{ ml: 'auto' }}>
                      <input
                        type="checkbox"
                        checked={selectedVersions.includes(version.id)}
                        onChange={() => handleVersionSelection(version.id)}
                        disabled={selectedVersions.length >= 2 && !selectedVersions.includes(version.id)}
                      />
                    </Box>
                  </CardActions>
                </VersionCard>
              </Grid>
            ))}
          </Grid>
        )}
      </VersionsListContainer>

      {/* Create Snapshot Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t[language].createSnapshot}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t[language].snapshotName}
            fullWidth
            variant="outlined"
            value={snapshotName}
            onChange={(e) => setSnapshotName(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label={t[language].snapshotDescription}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={snapshotDescription}
            onChange={(e) => setSnapshotDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>
            {t[language].cancel}
          </Button>
          <Button 
            onClick={createSnapshot} 
            variant="contained"
            disabled={!snapshotName.trim() || isCreating}
          >
            {isCreating ? t[language].loading : t[language].create}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restore Version Dialog */}
      <Dialog open={showRestoreDialog} onClose={() => setShowRestoreDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t[language].restoreVersion}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t[language].selectVersion}
          </Typography>
          <TextField
            select
            fullWidth
            label="Version"
            value={versionToRestore}
            onChange={(e) => setVersionToRestore(e.target.value)}
            variant="outlined"
          >
            {versions.filter(v => !v.isCurrent).map((version) => (
              <MenuItem key={version.id} value={version.id}>
                {version.name} - {formatDate(version.timestamp)}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRestoreDialog(false)}>
            {t[language].cancel}
          </Button>
          <Button 
            onClick={restoreVersion} 
            variant="contained"
            disabled={!versionToRestore || isRestoring}
          >
            {isRestoring ? t[language].loading : t[language].restore}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Compare Versions Dialog */}
      <Dialog open={showCompareDialog} onClose={() => setShowCompareDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{t[language].compareVersions}</DialogTitle>
        <DialogContent>
          {diffResult ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t[language].changes} ({diffResult.totalChanges})
              </Typography>
              
              {diffResult.totalChanges === 0 ? (
                <Typography color="text.secondary">
                  {t[language].noChanges}
                </Typography>
              ) : (
                <DiffViewer>
                  {diffResult.removed.map((line, index) => (
                    <DiffLine key={`removed-${index}`} type="removed">
                      - {line}
                    </DiffLine>
                  ))}
                  {diffResult.added.map((line, index) => (
                    <DiffLine key={`added-${index}`} type="added">
                      + {line}
                    </DiffLine>
                  ))}
                  {diffResult.unchanged.map((line, index) => (
                    <DiffLine key={`unchanged-${index}`} type="unchanged">
                      {line}
                    </DiffLine>
                  ))}
                </DiffViewer>
              )}
            </Box>
          ) : (
            <Typography>{t[language].loading}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCompareDialog(false)}>
            {t[language].cancel}
          </Button>
        </DialogActions>
      </Dialog>
    </VersionControlContainer>
  );
};

export default VersionControl;