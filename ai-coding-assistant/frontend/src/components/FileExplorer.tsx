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
  Breadcrumbs,
  Link,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  CreateNewFolder as CreateFolderIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  Archive as ArchiveIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const FileExplorerContainer = styled(Box)(({ theme }) => ({
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

const BreadcrumbsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper
}));

const FileListContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(1)
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: theme.palette.text.secondary,
  gap: theme.spacing(2)
}));

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
  size?: number;
  modified?: string;
  extension?: string;
}

interface FileExplorerProps {
  socket: any;
  sessionId: string;
  language: 'ar' | 'en';
}

const FileExplorer: React.FC<FileExplorerProps> = ({ socket, sessionId, language }) => {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [createType, setCreateType] = useState<'file' | 'directory'>('file');
  const [fileName, setFileName] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const t = {
    ar: {
      title: 'مستكشف الملفات',
      createFile: 'إنشاء ملف',
      createFolder: 'إنشاء مجلد',
      editFile: 'تعديل الملف',
      deleteFile: 'حذف الملف',
      fileName: 'اسم الملف',
      folderName: 'اسم المجلد',
      fileContent: 'محتوى الملف',
      create: 'إنشاء',
      edit: 'تعديل',
      cancel: 'إلغاء',
      delete: 'حذف',
      refresh: 'تحديث',
      noFiles: 'لا توجد ملفات',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      confirmDelete: 'هل أنت متأكد من حذف هذا العنصر؟',
      file: 'ملف',
      directory: 'مجلد',
      size: 'الحجم',
      modified: 'آخر تعديل',
      path: 'المسار',
      home: 'الرئيسية',
      back: 'رجوع',
      open: 'فتح',
      rename: 'إعادة تسمية',
      copy: 'نسخ',
      move: 'نقل',
      properties: 'الخصائص'
    },
    en: {
      title: 'File Explorer',
      createFile: 'Create File',
      createFolder: 'Create Folder',
      editFile: 'Edit File',
      deleteFile: 'Delete File',
      fileName: 'File Name',
      folderName: 'Folder Name',
      fileContent: 'File Content',
      create: 'Create',
      edit: 'Edit',
      cancel: 'Cancel',
      delete: 'Delete',
      refresh: 'Refresh',
      noFiles: 'No files found',
      loading: 'Loading...',
      error: 'An error occurred',
      confirmDelete: 'Are you sure you want to delete this item?',
      file: 'File',
      directory: 'Directory',
      size: 'Size',
      modified: 'Modified',
      path: 'Path',
      home: 'Home',
      back: 'Back',
      open: 'Open',
      rename: 'Rename',
      copy: 'Copy',
      move: 'Move',
      properties: 'Properties'
    }
  };

  useEffect(() => {
    if (socket && sessionId) {
      loadFiles();
      
      socket.on('files-loaded', handleFilesLoaded);
      socket.on('file-created', handleFileCreated);
      socket.on('file-edited', handleFileEdited);
      socket.on('file-deleted', handleFileDeleted);
      socket.on('error', handleError);

      return () => {
        socket.off('files-loaded');
        socket.off('file-created');
        socket.off('file-edited');
        socket.off('file-deleted');
        socket.off('error');
      };
    }
  }, [socket, sessionId]);

  const loadFiles = () => {
    if (socket && sessionId) {
      setIsLoading(true);
      setError('');
      socket.emit('get-project-structure', { sessionId, path: currentPath });
    }
  };

  const handleFilesLoaded = (data: { files: FileItem[], path: string }) => {
    setFiles(data.files);
    setCurrentPath(data.path);
    setIsLoading(false);
  };

  const handleFileCreated = (data: { file: FileItem, path: string }) => {
    loadFiles();
    setShowCreateDialog(false);
    setFileName('');
    setFileContent('');
    setIsCreating(false);
  };

  const handleFileEdited = (data: { file: FileItem, path: string }) => {
    loadFiles();
    setShowEditDialog(false);
    setSelectedFile(null);
    setFileContent('');
    setIsEditing(false);
  };

  const handleFileDeleted = (data: { path: string }) => {
    loadFiles();
    setSelectedFile(null);
  };

  const handleError = (data: { message: string }) => {
    setError(data.message);
    setIsLoading(false);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'directory') {
      setCurrentPath(file.path);
      loadFiles();
    } else {
      setSelectedFile(file);
      setFileContent('');
      setShowEditDialog(true);
      // Load file content
      if (socket && sessionId) {
        socket.emit('read-file', { sessionId, path: file.path });
      }
    }
  };

  const handleCreateFile = () => {
    if (!fileName.trim()) return;
    
    setIsCreating(true);
    if (socket && sessionId) {
      const fullPath = currentPath ? `${currentPath}/${fileName}` : fileName;
      if (createType === 'file') {
        socket.emit('edit-file', { 
          sessionId, 
          path: fullPath, 
          content: fileContent 
        });
      } else {
        socket.emit('create-directory', { 
          sessionId, 
          path: fullPath 
        });
      }
    }
  };

  const handleEditFile = () => {
    if (!selectedFile || !fileContent.trim()) return;
    
    setIsEditing(true);
    if (socket && sessionId) {
      socket.emit('edit-file', { 
        sessionId, 
        path: selectedFile.path, 
        content: fileContent 
      });
    }
  };

  const handleDeleteFile = (file: FileItem) => {
    if (socket && sessionId && confirm(t[language].confirmDelete)) {
      socket.emit('delete-file', { sessionId, path: file.path });
    }
  };

  const handleBreadcrumbClick = (path: string) => {
    setCurrentPath(path);
    loadFiles();
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'directory') return <FolderIcon />;
    
    const ext = file.extension?.toLowerCase();
    if (ext === 'js' || ext === 'jsx' || ext === 'ts' || ext === 'tsx') return <CodeIcon />;
    if (ext === 'md' || ext === 'txt') return <DescriptionIcon />;
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif') return <ImageIcon />;
    if (ext === 'zip' || ext === 'tar' || ext === 'gz') return <ArchiveIcon />;
    return <FileIcon />;
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  const getBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(Boolean);
    const breadcrumbs = [{ name: t[language].home, path: '' }];
    
    let currentPathPart = '';
    parts.forEach(part => {
      currentPathPart += `/${part}`;
      breadcrumbs.push({ name: part, path: currentPathPart });
    });
    
    return breadcrumbs;
  };

  return (
    <FileExplorerContainer>
      <ToolbarContainer>
        <Typography variant="h6" component="h2" sx={{ flex: 1 }}>
          {t[language].title}
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<CreateFolderIcon />}
          onClick={() => {
            setCreateType('directory');
            setShowCreateDialog(true);
          }}
        >
          {t[language].createFolder}
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            setCreateType('file');
            setShowCreateDialog(true);
          }}
        >
          {t[language].createFile}
        </Button>
        
        <IconButton onClick={loadFiles} disabled={isLoading}>
          <RefreshIcon />
        </IconButton>
      </ToolbarContainer>

      <BreadcrumbsContainer>
        <Breadcrumbs aria-label="breadcrumb">
          {getBreadcrumbs().map((breadcrumb, index) => (
            <Link
              key={index}
              color={index === getBreadcrumbs().length - 1 ? 'text.primary' : 'inherit'}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleBreadcrumbClick(breadcrumb.path);
              }}
              sx={{ cursor: 'pointer' }}
            >
              {breadcrumb.name}
            </Link>
          ))}
        </Breadcrumbs>
      </BreadcrumbsContainer>

      <FileListContainer>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <EmptyState>
            <Typography>{t[language].loading}</Typography>
          </EmptyState>
        ) : files.length === 0 ? (
          <EmptyState>
            <Typography>{t[language].noFiles}</Typography>
          </EmptyState>
        ) : (
          <List>
            {files.map((file, index) => (
              <ListItem
                key={index}
                disablePadding
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={t[language].open}>
                      <IconButton
                        size="small"
                        onClick={() => handleFileClick(file)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t[language].delete}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteFile(file)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemButton onClick={() => handleFileClick(file)}>
                  <ListItemIcon>
                    {getFileIcon(file)}
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                          label={file.type === 'directory' ? t[language].directory : t[language].file}
                          size="small"
                          variant="outlined"
                        />
                        {file.size && (
                          <Typography variant="caption" color="text.secondary">
                            {formatFileSize(file.size)}
                          </Typography>
                        )}
                        {file.modified && (
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(file.modified)}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </FileListContainer>

      {/* Create File/Directory Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {createType === 'file' ? t[language].createFile : t[language].createFolder}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={createType === 'file' ? t[language].fileName : t[language].folderName}
            fullWidth
            variant="outlined"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          {createType === 'file' && (
            <TextField
              margin="dense"
              label={t[language].fileContent}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>
            {t[language].cancel}
          </Button>
          <Button 
            onClick={handleCreateFile} 
            variant="contained"
            disabled={!fileName.trim() || isCreating}
          >
            {isCreating ? t[language].loading : t[language].create}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit File Dialog */}
      <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {t[language].editFile}: {selectedFile?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label={t[language].fileContent}
            fullWidth
            multiline
            rows={12}
            variant="outlined"
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>
            {t[language].cancel}
          </Button>
          <Button 
            onClick={handleEditFile} 
            variant="contained"
            disabled={!fileContent.trim() || isEditing}
          >
            {isEditing ? t[language].loading : t[language].edit}
          </Button>
        </DialogActions>
      </Dialog>
    </FileExplorerContainer>
  );
};

export default FileExplorer;