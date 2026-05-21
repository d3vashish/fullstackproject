import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import FilterBar from "../components/FilterBar";

export default function Dashboard() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ priority: "", status: "", assignedTo: "" });

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
      fetchUsers();
    }
  }, [isLoggedIn]);

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks");
      const data = await res.json();
      setTasks(data.tasks);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data.users);
    } catch {}
  };

  const handleCreate = async (taskData) => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...taskData, createdBy: user.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      await fetchTasks();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, { method: "DELETE" });
      await fetchTasks();
    } catch {
      setError("Failed to delete");
    }
  };

  const getFilteredTasks = () => {
    let filtered = activeTab === "my"
      ? tasks.filter((t) => t.assignedTo === user?.id || t.createdBy === user?.id)
      : [...tasks];

    if (filters.priority) filtered = filtered.filter((t) => t.priority === filters.priority);
    if (filters.status) filtered = filtered.filter((t) => t.status === filters.status);
    if (filters.assignedTo) filtered = filtered.filter((t) => t.assignedTo === parseInt(filters.assignedTo));

    return filtered;
  };

  if (!isLoggedIn) return null;

  return (
    <div className="container">
      <div className="top-bar">
        <h1>Tasks</h1>
        <div className="top-bar-actions">
          <span className="user-badge" data-initial={user?.name?.charAt(0).toUpperCase()}>{user?.name}</span>
          <Link href="/users" className="btn btn-sm btn-secondary">Users</Link>
          <button onClick={() => { logout(); router.push("/login"); }} className="btn btn-sm btn-danger">Logout</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && <TaskForm users={users} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}

      <div className="controls">
        <div className="tabs">
          <button className={`tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>All ({tasks.length})</button>
          <button className={`tab ${activeTab === "my" ? "active" : ""}`} onClick={() => setActiveTab("my")}>My Tasks</button>
        </div>
        <div className="controls-right">
          <FilterBar filters={filters} onFilterChange={setFilters} users={users} />
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? "Cancel" : "+ New Task"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : getFilteredTasks().length === 0 ? (
        <div className="empty-state">No tasks found.</div>
      ) : (
        <div className="tasks-grid">
          {getFilteredTasks().map((task) => (
            <TaskCard key={task.id} task={task} users={users} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
