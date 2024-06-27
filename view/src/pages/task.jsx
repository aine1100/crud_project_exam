import  { useState, useEffect } from "react";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './task.css';

function Task() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ name: '', description: '', duration: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleAddOrUpdateTask = async (e) => {
    e.preventDefault();
    if (isUpdating) {
      try {
        const response = await axios.put(`http://localhost:5000/tasks/${currentTaskId}`, task);
        console.log("Task updated successfully:", response.data);
        toast.success("Task updated successfully!");
        setTasks(tasks.map(t => (t._id === currentTaskId ? response.data : t)));
        setIsUpdating(false);
        setCurrentTaskId(null);
      } catch (error) {
        console.error("Failed to update task:", error);
        toast.error("Failed to update task.");
      }
    } else {
      try {
        const response = await axios.post("http://localhost:5000/tasks", task);
        console.log("Task added successfully:", response.data);
        toast.success("Task added successfully!");
        setTasks([...tasks, response.data]);
      } catch (error) {
        console.error("Failed to add task:", error);
        toast.error("Failed to add task.");
      }
    }
    setTask({ name: '', description: '', duration: '' });
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      console.log("Task deleted successfully");
      toast.success("Task deleted successfully!");
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task.");
    }
  };

  const handleEditTask = (task) => {
    setTask({ name: task.name, description: task.description, duration: task.duration });
    setIsUpdating(true);
    setCurrentTaskId(task._id);
  };

  const completeTask = async (taskId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/tasks/${taskId}`, { completed: true });
      console.log("Task completed successfully:", response.data);
      toast.success("Task completed successfully!");
      setTasks(tasks.map(task => (task._id === taskId ? response.data : task)));
    } catch (error) {
      console.error("Failed to complete task:", error);
      toast.error("Failed to complete task.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <form onSubmit={handleAddOrUpdateTask} className="task-form">
        <input
          type="text"
          name="name"
          value={task.name}
          onChange={handleChange}
          placeholder="Task Name"
          required
        />
        <input
          type="text"
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Task Description"
          required
        />
        <input
          type="text"
          name="duration"
          value={task.duration}
          onChange={handleChange}
          placeholder="Task Duration"
          required
        />
        <button type="submit">{isUpdating ? 'Update Task' : 'Add Task'}</button>
      </form>
      <table className="task-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td>{task.name}</td>
              <td>{task.description}</td>
              <td>{task.duration}</td>
              <td>{task.completed ? 'Completed' : 'Pending'}</td>
              <td>
                <button onClick={() => completeTask(task._id)}>Complete</button>
                <button onClick={() => handleEditTask(task)}>Edit</button>
                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}

export default Task;
