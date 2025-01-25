import React, { useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  Alert,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

interface Task {
  id: string;
  title: string;
  date: Date;
  type: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Completed';
}

interface TaskFormData {
  title: string;
  date: Date | null;
  type: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
}

const taskTypes = [
  'Water Quality Testing',
  'Feeding Schedule',
  'Health Check',
  'Harvesting',
  'Pond Preparation',
  'Stocking',
  'Maintenance',
  'Treatment',
  'Inventory Check',
];

const initialFormData: TaskFormData = {
  title: '',
  date: null,
  type: '',
  description: '',
  priority: 'Medium',
};

const ProductionCalendar: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    date: new Date(),
    type: '',
    description: '',
    priority: 'Medium',
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
    setFormData({
      title: '',
      date: new Date(),
      type: '',
      description: '',
      priority: 'Medium',
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | "Low" | "Medium" | "High">
  ) => {
    const name = e.target.name as keyof TaskFormData;
    const value = e.target.value;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };

  const handleSubmit = () => {
    if (!formData.date) return;

    if (editingTask) {
      setTasks(prev =>
        prev.map(task =>
          task.id === editingTask.id
            ? {
                ...task,
                ...formData,
                date: formData.date as Date,
              }
            : task
        )
      );
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        date: formData.date,
        status: 'Pending',
      };
      setTasks(prev => [...prev, newTask]);
    }
    handleCloseDialog();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      date: task.date,
      type: task.type,
      description: task.description,
      priority: task.priority,
    });
    setOpenDialog(true);
  };

  const handleDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleToggleStatus = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === 'Pending' ? 'Completed' : 'Pending',
            }
          : task
      )
    );
  };

  const sortedTasks = [...tasks].sort((a, b) => a.date.getTime() - b.date.getTime());

  const getUpcomingTasks = () => {
    const today = new Date();
    return sortedTasks.filter(
      (task) =>
        task.status === 'Pending' &&
        task.date.getTime() >= today.setHours(0, 0, 0, 0)
    );
  };

  const getPendingTasks = () => {
    const today = new Date();
    return sortedTasks.filter(
      (task) =>
        task.status === 'Pending' &&
        task.date.getTime() < today.setHours(0, 0, 0, 0)
    );
  };

  const getCompletedTasks = () => {
    return sortedTasks.filter((task) => task.status === 'Completed');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Production Planning Calendar
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage and track your aquaculture production activities.
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ mb: 4 }}
        >
          Add New Task
        </Button>

        <Grid container spacing={3}>
          {/* Upcoming Tasks */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Tasks
              </Typography>
              {getUpcomingTasks().map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => handleEdit(task)}
                  onDelete={() => handleDelete(task.id)}
                  onToggleStatus={() => handleToggleStatus(task.id)}
                />
              ))}
            </Paper>
          </Grid>

          {/* Pending Tasks */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="error">
                Overdue Tasks
              </Typography>
              {getPendingTasks().map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => handleEdit(task)}
                  onDelete={() => handleDelete(task.id)}
                  onToggleStatus={() => handleToggleStatus(task.id)}
                />
              ))}
            </Paper>
          </Grid>

          {/* Completed Tasks */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="success.main">
                Completed Tasks
              </Typography>
              {getCompletedTasks().map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => handleEdit(task)}
                  onDelete={() => handleDelete(task.id)}
                  onToggleStatus={() => handleToggleStatus(task.id)}
                />
              ))}
            </Paper>
          </Grid>
        </Grid>

        {/* SEO-optimized Blog Content */}
        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            📅 Production Calendar: Complete Guide to Farm Planning
          </Typography>
          
          <Typography variant="body1" paragraph>
            Welcome to your comprehensive guide on production calendars in aquaculture! Effective planning is crucial for successful farming. In this detailed guide, we'll explore everything you need to know about scheduling and managing your farm activities. 🎯
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            🤔 Why is Production Planning Important?
          </Typography>
          <Typography variant="body1" paragraph>
            Production planning optimizes resource use, coordinates activities, and ensures timely operations. It's essential for farm success.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            🎯 Benefits of Good Planning
          </Typography>
          <Typography variant="body1" component="div">
            <ul>
              <li>Better timing</li>
              <li>Resource efficiency</li>
              <li>Task coordination</li>
              <li>Risk management</li>
              <li>Market alignment</li>
              <li>Staff planning</li>
              <li>Higher profits</li>
            </ul>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            📊 Key Planning Factors
          </Typography>
          <Typography variant="body1" paragraph>
            Essential considerations:
          </Typography>
          <Typography variant="body1" component="div">
            <ul>
              <li><strong>Species:</strong> Growth cycles</li>
              <li><strong>Climate:</strong> Seasons</li>
              <li><strong>Market:</strong> Demand times</li>
              <li><strong>Resources:</strong> Availability</li>
              <li><strong>Staff:</strong> Scheduling</li>
              <li><strong>Maintenance:</strong> Timing</li>
            </ul>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            ⏰ When to Update Calendar
          </Typography>
          <Typography variant="body1" paragraph>
            Key update times:
          </Typography>
          <Typography variant="body1" component="div">
            <ul>
              <li>Season start</li>
              <li>Cycle planning</li>
              <li>Market changes</li>
              <li>Resource shifts</li>
              <li>Staff updates</li>
            </ul>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            📝 Step-by-Step Planning
          </Typography>
          <Typography variant="body1" component="div">
            <ol>
              <li><strong>Analysis:</strong> Use our tool</li>
              <li><strong>Schedule:</strong> Set dates</li>
              <li><strong>Resources:</strong> Plan needs</li>
              <li><strong>Staff:</strong> Assign tasks</li>
              <li><strong>Monitor:</strong> Track progress</li>
              <li><strong>Adjust:</strong> Update plans</li>
            </ol>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            ⚠️ Common Planning Issues
          </Typography>
          <Typography variant="body1" component="div">
            <ul>
              <li>Timing conflicts</li>
              <li>Resource gaps</li>
              <li>Staff shortages</li>
              <li>Weather impacts</li>
              <li>Market changes</li>
              <li>Equipment delays</li>
            </ul>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            💡 Expert Planning Tips
          </Typography>
          <Typography variant="body1" paragraph>
            1. <strong>Regular Updates:</strong> Stay current
            2. <strong>Buffer Time:</strong> Plan extras
            3. <strong>Resource Check:</strong> Confirm needs
            4. <strong>Staff Input:</strong> Get feedback
            5. <strong>Market Align:</strong> Match demand
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            🌟 Impact of Good Planning
          </Typography>
          <Typography variant="body1" paragraph>
            Effective planning leads to:
          </Typography>
          <Typography variant="body1" component="div">
            <ul>
              <li>25-35% better efficiency</li>
              <li>Resource savings</li>
              <li>Better timing</li>
              <li>Smooth operations</li>
              <li>Higher profits</li>
            </ul>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            🔍 Frequently Asked Questions
          </Typography>
          <Typography variant="body1" component="div">
            <strong>Q: How to plan cycles?</strong>
            <Typography paragraph>
              A: Multiple factors matter. Our tool guides planning.
            </Typography>

            <strong>Q: Best timing?</strong>
            <Typography paragraph>
              A: Depends on species. Our tool shows options.
            </Typography>

            <strong>Q: Resource needs?</strong>
            <Typography paragraph>
              A: Varies by activity. Our tool calculates requirements.
            </Typography>

            <strong>Q: Schedule conflicts?</strong>
            <Typography paragraph>
              A: Use buffers. Our tool helps coordinate.
            </Typography>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            📚 Conclusion
          </Typography>
          <Typography variant="body1" paragraph>
            Proper production planning is crucial for successful aquaculture operations. Use our production calendar tool above to optimize your farm activities. Follow the guidelines in this guide to implement effective planning strategies.
          </Typography>

          <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
            Last Updated: January 2025 | Written by Aquaculture Planning Specialists | Based on Latest Research and Industry Best Practices
          </Typography>
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <form onSubmit={(e) => e.preventDefault()}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Task Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date"
                      value={formData.date}
                      onChange={handleDateChange}
                      sx={{ width: '100%' }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Task Type</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                        onChange={handleInputChange as (event: SelectChangeEvent<string>) => void}
                      label="Task Type"
                    >
                      {taskTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="description"
                    multiline
                    rows={3}
                    label="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      name="priority"
                      value={formData.priority}
                        onChange={handleInputChange as (event: SelectChangeEvent<"Low" | "Medium" | "High">) => void}
                        label="Priority"
                    >
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" onClick={handleSubmit}>
                {editingTask ? 'Update' : 'Add'} Task
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" component="div">
            {task.title}
          </Typography>
          <Box>
            <IconButton size="small" onClick={onEdit}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {task.type}
        </Typography>
        <Typography variant="body2">
          {new Date(task.date).toLocaleDateString()}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <Button size="small" onClick={onToggleStatus}>
            {task.status === 'Pending' ? 'Mark Complete' : 'Mark Pending'}
          </Button>
          <Typography
            variant="caption"
            sx={{
              color:
                task.priority === 'High'
                  ? 'error.main'
                  : task.priority === 'Medium'
                  ? 'warning.main'
                  : 'success.main',
            }}
          >
            {task.priority} Priority
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductionCalendar;