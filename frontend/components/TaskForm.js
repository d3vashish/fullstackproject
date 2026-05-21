import { useState, useEffect } from "react";

export default function TaskForm({ task = null, users = [], onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "To Do",
    assignedTo: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Medium",
        status: task.status || "To Do",
        assignedTo: task.assignedTo ? String(task.assignedTo) : "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    onSubmit({
      ...formData,
      assignedTo: formData.assignedTo ? parseInt(formData.assignedTo) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>{task ? "Edit Task" : "New Task"}</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="assignedTo">Assign To</label>
          <select id="assignedTo" name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
            <option value="">-- None --</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{task ? "Update" : "Create"}</button>
        {onCancel && <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>}
      </div>
    </form>
  );
}
