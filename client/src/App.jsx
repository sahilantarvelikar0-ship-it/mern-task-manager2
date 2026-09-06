import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('Medium');

  const getTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { getTasks(); }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: text, priority })
    });
    setText('');
    getTasks();
  };

  const toggleTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: 'PUT' });
    getTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    getTasks();
  };

  return (
    <div className="container">
      <h2>Task Manager 🚀</h2>
      <form onSubmit={addTask} className="input-group">
        <input 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Enter a new task..." 
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="priority-select">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit" className="add-btn">Add</button>
      </form>
      <ul>
        {tasks.map(t => (
          <li key={t._id} className={t.completed ? 'completed' : ''}>
            <div className="task-content" onClick={() => toggleTask(t._id)}>
              <input type="checkbox" checked={!!t.completed} readOnly />
              <span className="title">{t.title}</span>
              <span className={`badge ${(t.priority || 'medium').toLowerCase()}`}>{t.priority || 'Medium'}</span>
            </div>
            <button className="delete-btn" onClick={() => deleteTask(t._id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;