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
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  PriorityHigh as PriorityHighIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Archive as ArchiveIcon,
  RestoreFromTrash as RestoreIcon,
  ClearAll as ClearAllIcon,
  Assignment as AssignmentIcon,
  Work as WorkIcon,
  BugReport as BugIcon,
  Lightbulb as IdeaIcon,
  Star as StarIcon,
  Flag as FlagIcon,
  Label as LabelIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const TodoListContainer = styled(Box)(({ theme }) => ({
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

const FiltersContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper
}));

const TodoListContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2)
}));

const TodoCard = styled(Card)<{ completed: boolean; priority: string }>(({ theme, completed, priority }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  opacity: completed ? 0.7 : 1,
  borderLeft: `4px solid ${
    priority === 'high' ? theme.palette.error.main :
    priority === 'medium' ? theme.palette.warning.main :
    theme.palette.success.main
  }`,
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-2px)'
  }
}));

const TodoHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

const TodoMeta = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(1),
  flexWrap: 'wrap'
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  justifyContent: 'space-around',
  marginBottom: theme.spacing(2)
}));

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  estimatedTime: number;
  actualTime: number;
  notes: string;
}

interface TodoListProps {
  socket: any;
  sessionId: string;
  language: 'ar' | 'en';
}

const TodoList: React.FC<TodoListProps> = ({ socket, sessionId, language }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filters, setFilters] = useState({
    showCompleted: true,
    priority: 'all',
    category: 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: '',
    dueDate: '',
    tags: '',
    estimatedTime: 0,
    notes: ''
  });

  const t = {
    ar: {
      title: 'قائمة المهام',
      addTodo: 'إضافة مهمة',
      editTodo: 'تعديل المهمة',
      titleLabel: 'عنوان المهمة',
      descriptionLabel: 'وصف المهمة',
      priorityLabel: 'الأولوية',
      categoryLabel: 'الفئة',
      dueDateLabel: 'تاريخ الاستحقاق',
      tagsLabel: 'العلامات (مفصولة بفواصل)',
      estimatedTimeLabel: 'الوقت المقدر (بالساعات)',
      notesLabel: 'ملاحظات',
      add: 'إضافة',
      edit: 'تعديل',
      cancel: 'إلغاء',
      delete: 'حذف',
      complete: 'إكمال',
      uncomplete: 'إلغاء الإكمال',
      priority: 'الأولوية',
      category: 'الفئة',
      dueDate: 'تاريخ الاستحقاق',
      tags: 'العلامات',
      estimatedTime: 'الوقت المقدر',
      actualTime: 'الوقت الفعلي',
      notes: 'ملاحظات',
      createdAt: 'تاريخ الإنشاء',
      updatedAt: 'تاريخ التحديث',
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية',
      all: 'الكل',
      showCompleted: 'إظهار المكتملة',
      hideCompleted: 'إخفاء المكتملة',
      search: 'بحث',
      sortBy: 'ترتيب حسب',
      noTodos: 'لا توجد مهام',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      confirmDelete: 'هل أنت متأكد من حذف هذه المهمة؟',
      progress: 'التقدم',
      completed: 'مكتمل',
      pending: 'معلق',
      total: 'المجموع',
      overdue: 'متأخر',
      today: 'اليوم',
      thisWeek: 'هذا الأسبوع',
      thisMonth: 'هذا الشهر',
      bug: 'خطأ',
      feature: 'ميزة',
      improvement: 'تحسين',
      task: 'مهمة',
      idea: 'فكرة',
      documentation: 'توثيق',
      testing: 'اختبار',
      deployment: 'نشر',
      maintenance: 'صيانة'
    },
    en: {
      title: 'Todo List',
      addTodo: 'Add Todo',
      editTodo: 'Edit Todo',
      titleLabel: 'Todo Title',
      descriptionLabel: 'Description',
      priorityLabel: 'Priority',
      categoryLabel: 'Category',
      dueDateLabel: 'Due Date',
      tagsLabel: 'Tags (comma separated)',
      estimatedTimeLabel: 'Estimated Time (hours)',
      notesLabel: 'Notes',
      add: 'Add',
      edit: 'Edit',
      cancel: 'Cancel',
      delete: 'Delete',
      complete: 'Complete',
      uncomplete: 'Uncomplete',
      priority: 'Priority',
      category: 'Category',
      dueDate: 'Due Date',
      tags: 'Tags',
      estimatedTime: 'Estimated Time',
      actualTime: 'Actual Time',
      notes: 'Notes',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      all: 'All',
      showCompleted: 'Show Completed',
      hideCompleted: 'Hide Completed',
      search: 'Search',
      sortBy: 'Sort By',
      noTodos: 'No todos found',
      loading: 'Loading...',
      error: 'An error occurred',
      confirmDelete: 'Are you sure you want to delete this todo?',
      progress: 'Progress',
      completed: 'Completed',
      pending: 'Pending',
      total: 'Total',
      overdue: 'Overdue',
      today: 'Today',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      bug: 'Bug',
      feature: 'Feature',
      improvement: 'Improvement',
      task: 'Task',
      idea: 'Idea',
      documentation: 'Documentation',
      testing: 'Testing',
      deployment: 'Deployment',
      maintenance: 'Maintenance'
    }
  };

  const categories = [
    { value: 'bug', label: t[language].bug, icon: <BugIcon /> },
    { value: 'feature', label: t[language].feature, icon: <StarIcon /> },
    { value: 'improvement', label: t[language].improvement, icon: <WorkIcon /> },
    { value: 'task', label: t[language].task, icon: <AssignmentIcon /> },
    { value: 'idea', label: t[language].idea, icon: <LightbulbIcon /> },
    { value: 'documentation', label: t[language].documentation, icon: <LabelIcon /> },
    { value: 'testing', label: t[language].testing, icon: <CheckCircleIcon /> },
    { value: 'deployment', label: t[language].deployment, icon: <FlagIcon /> },
    { value: 'maintenance', label: t[language].maintenance, icon: <WorkIcon /> }
  ];

  useEffect(() => {
    if (socket && sessionId) {
      loadTodos();
      
      socket.on('todos-loaded', handleTodosLoaded);
      socket.on('todo-added', handleTodoAdded);
      socket.on('todo-updated', handleTodoUpdated);
      socket.on('todo-deleted', handleTodoDeleted);
      socket.on('error', handleError);

      return () => {
        socket.off('todos-loaded');
        socket.off('todo-added');
        socket.off('todo-updated');
        socket.off('todo-deleted');
        socket.off('error');
      };
    }
  }, [socket, sessionId]);

  const loadTodos = () => {
    if (socket && sessionId) {
      setIsLoading(true);
      setError('');
      socket.emit('get-todos', { sessionId });
    }
  };

  const handleTodosLoaded = (data: { todos: Todo[] }) => {
    setTodos(data.todos);
    setIsLoading(false);
  };

  const handleTodoAdded = (data: { success: boolean, message: string }) => {
    if (data.success) {
      setShowAddDialog(false);
      resetNewTodo();
      loadTodos();
    } else {
      setError(data.message);
    }
  };

  const handleTodoUpdated = (data: { success: boolean, message: string }) => {
    if (data.success) {
      setShowEditDialog(false);
      setEditingTodo(null);
      loadTodos();
    } else {
      setError(data.message);
    }
  };

  const handleTodoDeleted = (data: { success: boolean, message: string }) => {
    if (data.success) {
      loadTodos();
    } else {
      setError(data.message);
    }
  };

  const handleError = (data: { message: string }) => {
    setError(data.message);
    setIsLoading(false);
  };

  const resetNewTodo = () => {
    setNewTodo({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      dueDate: '',
      tags: '',
      estimatedTime: 0,
      notes: ''
    });
  };

  const addTodo = () => {
    if (!newTodo.title.trim()) return;
    
    if (socket && sessionId) {
      const todoData = {
        ...newTodo,
        tags: newTodo.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        estimatedTime: Number(newTodo.estimatedTime)
      };
      
      socket.emit('add-todo', { sessionId, todo: todoData });
    }
  };

  const editTodo = () => {
    if (!editingTodo || !editingTodo.title.trim()) return;
    
    if (socket && sessionId) {
      const todoData = {
        ...editingTodo,
        tags: editingTodo.tags
      };
      
      socket.emit('update-todo', { sessionId, todo: todoData });
    }
  };

  const deleteTodo = (todoId: string) => {
    if (confirm(t[language].confirmDelete)) {
      if (socket && sessionId) {
        socket.emit('delete-todo', { sessionId, todoId });
      }
    }
  };

  const toggleTodoComplete = (todo: Todo) => {
    if (socket && sessionId) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      socket.emit('update-todo', { sessionId, todo: updatedTodo });
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo);
    setShowEditDialog(true);
  };

  const getFilteredAndSortedTodos = () => {
    let filtered = todos.filter(todo => {
      if (!filters.showCompleted && todo.completed) return false;
      if (filters.priority !== 'all' && todo.priority !== filters.priority) return false;
      if (filters.category !== 'all' && todo.category !== filters.category) return false;
      if (filters.search && !todo.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Todo];
      let bValue = b[sortBy as keyof Todo];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const getProgressStats = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    
    return { total, completed, pending, progress };
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <PriorityHighIcon color="error" />;
      case 'medium': return <PriorityHighIcon color="warning" />;
      default: return <PriorityHighIcon color="success" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : <CategoryIcon />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const filteredTodos = getFilteredAndSortedTodos();
  const stats = getProgressStats();

  return (
    <TodoListContainer>
      <ToolbarContainer>
        <Typography variant="h6" component="h2" sx={{ flex: 1 }}>
          {t[language].title}
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddDialog(true)}
        >
          {t[language].addTodo}
        </Button>
        
        <IconButton onClick={loadTodos} disabled={isLoading}>
          <RefreshIcon />
        </IconButton>
      </ToolbarContainer>

      <ProgressContainer>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t[language].progress}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={stats.progress} 
          sx={{ mb: 2, height: 8, borderRadius: 4 }}
        />
        <StatsContainer>
          <Box textAlign="center">
            <Typography variant="h4" color="primary">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t[language].total}
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="success.main">
              {stats.completed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t[language].completed}
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="warning.main">
              {stats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t[language].pending}
            </Typography>
          </Box>
        </StatsContainer>
      </ProgressContainer>

      <FiltersContainer>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label={t[language].search}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t[language].priority}</InputLabel>
              <Select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                label={t[language].priority}
              >
                <MenuItem value="all">{t[language].all}</MenuItem>
                <MenuItem value="low">{t[language].low}</MenuItem>
                <MenuItem value="medium">{t[language].medium}</MenuItem>
                <MenuItem value="high">{t[language].high}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t[language].category}</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                label={t[language].category}
              >
                <MenuItem value="all">{t[language].all}</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t[language].sortBy}</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label={t[language].sortBy}
              >
                <MenuItem value="createdAt">{t[language].createdAt}</MenuItem>
                <MenuItem value="dueDate">{t[language].dueDate}</MenuItem>
                <MenuItem value="priority">{t[language].priority}</MenuItem>
                <MenuItem value="title">{t[language].titleLabel}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.showCompleted}
                  onChange={(e) => setFilters({ ...filters, showCompleted: e.target.checked })}
                />
              }
              label={filters.showCompleted ? t[language].showCompleted : t[language].hideCompleted}
            />
          </Grid>
        </Grid>
      </FiltersContainer>

      <TodoListContent>
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
        ) : filteredTodos.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="h6" color="text.secondary">
              {t[language].noTodos}
            </Typography>
          </Box>
        ) : (
          filteredTodos.map((todo) => (
            <TodoCard key={todo.id} completed={todo.completed} priority={todo.priority}>
              <CardContent>
                <TodoHeader>
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => toggleTodoComplete(todo)}
                    icon={<UncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                  />
                  <Typography 
                    variant="h6" 
                    component="h3"
                    sx={{ 
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      flex: 1
                    }}
                  >
                    {todo.title}
                  </Typography>
                  {getPriorityIcon(todo.priority)}
                </TodoHeader>
                
                {todo.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {todo.description}
                  </Typography>
                )}
                
                <TodoMeta>
                  <Chip
                    icon={getCategoryIcon(todo.category)}
                    label={categories.find(c => c.value === todo.category)?.label || todo.category}
                    size="small"
                    variant="outlined"
                  />
                  {todo.dueDate && (
                    <Chip
                      icon={<ScheduleIcon />}
                      label={formatDate(todo.dueDate)}
                      size="small"
                      variant="outlined"
                      color={isOverdue(todo.dueDate) ? 'error' : 'default'}
                    />
                  )}
                  {todo.estimatedTime > 0 && (
                    <Chip
                      label={`${todo.estimatedTime}h`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {todo.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </TodoMeta>
              </CardContent>
              
              <CardActions>
                <Tooltip title={todo.completed ? t[language].uncomplete : t[language].complete}>
                  <IconButton 
                    size="small"
                    onClick={() => toggleTodoComplete(todo)}
                  >
                    {todo.completed ? <UncheckedIcon /> : <CheckCircleIcon />}
                  </IconButton>
                </Tooltip>
                
                <Tooltip title={t[language].edit}>
                  <IconButton 
                    size="small"
                    onClick={() => startEditing(todo)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title={t[language].delete}>
                  <IconButton 
                    size="small"
                    color="error"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </TodoCard>
          ))
        )}
      </TodoListContent>

      {/* Add Todo Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t[language].addTodo}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                fullWidth
                label={t[language].titleLabel}
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t[language].descriptionLabel}
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t[language].priorityLabel}</InputLabel>
                <Select
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as any })}
                  label={t[language].priorityLabel}
                >
                  <MenuItem value="low">{t[language].low}</MenuItem>
                  <MenuItem value="medium">{t[language].medium}</MenuItem>
                  <MenuItem value="high">{t[language].high}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t[language].categoryLabel}</InputLabel>
                <Select
                  value={newTodo.category}
                  onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
                  label={t[language].categoryLabel}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label={t[language].dueDateLabel}
                value={newTodo.dueDate}
                onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={t[language].estimatedTimeLabel}
                value={newTodo.estimatedTime}
                onChange={(e) => setNewTodo({ ...newTodo, estimatedTime: Number(e.target.value) })}
                inputProps={{ min: 0, step: 0.5 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t[language].tagsLabel}
                value={newTodo.tags}
                onChange={(e) => setNewTodo({ ...newTodo, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t[language].notesLabel}
                value={newTodo.notes}
                onChange={(e) => setNewTodo({ ...newTodo, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>
            {t[language].cancel}
          </Button>
          <Button 
            onClick={addTodo} 
            variant="contained"
            disabled={!newTodo.title.trim()}
          >
            {t[language].add}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Todo Dialog */}
      <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t[language].editTodo}</DialogTitle>
        <DialogContent>
          {editingTodo && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  fullWidth
                  label={t[language].titleLabel}
                  value={editingTodo.title}
                  onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={t[language].descriptionLabel}
                  value={editingTodo.description}
                  onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t[language].priorityLabel}</InputLabel>
                  <Select
                    value={editingTodo.priority}
                    onChange={(e) => setEditingTodo({ ...editingTodo, priority: e.target.value as any })}
                    label={t[language].priorityLabel}
                  >
                    <MenuItem value="low">{t[language].low}</MenuItem>
                    <MenuItem value="medium">{t[language].medium}</MenuItem>
                    <MenuItem value="high">{t[language].high}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t[language].categoryLabel}</InputLabel>
                  <Select
                    value={editingTodo.category}
                    onChange={(e) => setEditingTodo({ ...editingTodo, category: e.target.value })}
                    label={t[language].categoryLabel}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label={t[language].dueDateLabel}
                  value={editingTodo.dueDate}
                  onChange={(e) => setEditingTodo({ ...editingTodo, dueDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={t[language].estimatedTimeLabel}
                  value={editingTodo.estimatedTime}
                  onChange={(e) => setEditingTodo({ ...editingTodo, estimatedTime: Number(e.target.value) })}
                  inputProps={{ min: 0, step: 0.5 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t[language].tagsLabel}
                  value={editingTodo.tags.join(', ')}
                  onChange={(e) => setEditingTodo({ ...editingTodo, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })}
                  placeholder="tag1, tag2, tag3"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={t[language].notesLabel}
                  value={editingTodo.notes}
                  onChange={(e) => setEditingTodo({ ...editingTodo, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>
            {t[language].cancel}
          </Button>
          <Button 
            onClick={editTodo} 
            variant="contained"
            disabled={!editingTodo?.title.trim()}
          >
            {t[language].edit}
          </Button>
        </DialogActions>
      </Dialog>
    </TodoListContainer>
  );
};

export default TodoList;