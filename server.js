const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = 'mongodb+srv://sahilantarvelikar0_db_user:Sahil1997@cluster0.8zrbufq.mongodb.net/taskdb?retryWrites=true&w=majority';

// Schema with priority and completed status
const taskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
  priority: { type: String, default: 'Medium' }
});
const Task = mongoose.model('Task', taskSchema);

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Cloud Connected! 🍃'))
  .catch(err => console.error('DB Connection Error:', err));

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create task
app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      priority: req.body.priority || 'Medium'
    });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task completion (Toggle complete)
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});