import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import TaskForm from "../../components/TaskForm";

export default function TaskDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { isLoggedIn } = useAuth();

  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn]);

  useEffect(() => {
    if (id && isLoggedIn) {
      fetchTask();
      fetchUsers();
    }
  }, [id, isLoggedIn]);

  const fetchTask = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`);
      if (!res.ok) throw new Error("Task not found");
      setTask(await res.json());
    } catch (err) {
      setError(err.message);
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

  const handleUpdate = async (taskData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      await fetchTask();
      setEditing(false);
      setSuccess("Task updated");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkComplete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Done" }),
      });
      if (!res.ok) throw new Error("Failed");
      await fetchTask();
      setSuccess("Marked as complete");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="container loading">Loading...</div>;
  if (error) return <div className="container error-message">{error}</div>;
  if (!task) return <div className="container">Task not found</div>;

  const assignedUser = users.find((u) => u.id === task.assignedTo);

  return (
    <div className="container">
      <Link href="/dashboard" className="back-link">&larr; Back</Link>

      {success && <div className="success-message">{success}</div>}

      {editing ? (
        <TaskForm task={task} users={users} onSubmit={handleUpdate} onCancel={() => setEditing(false)} />
      ) : (
        <div className="task-detail">
          <div className="task-detail-header">
            <h1>{task.title}</h1>
            <div className="task-detail-badges">
              <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
              <span className={`status-badge status-${task.status === "To Do" ? "todo" : task.status === "In Progress" ? "progress" : "done"}`}>{task.status}</span>
            </div>
          </div>

          <div className="task-detail-section">
            <h3>Description</h3>
            <p>{task.description || "No description."}</p>
          </div>

          <div className="task-detail-section">
            <h3>Assigned To</h3>
            {assignedUser ? (
              <p style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--primary)', color: '#fff',
                  fontSize: '0.7rem', fontWeight: 700
                }}>{assignedUser.name.charAt(0).toUpperCase()}</span>
                {assignedUser.name}
              </p>
            ) : <p>Unassigned</p>}
          </div>

          <div className="task-detail-section">
            <h3>Created</h3>
            <p>{new Date(task.createdAt).toLocaleString()}</p>
          </div>

          <div className="task-detail-actions">
            <button onClick={() => setEditing(true)} className="btn btn-primary">Edit</button>
            {task.status !== "Done" && (
              <button onClick={handleMarkComplete} className="btn btn-success">Mark Complete</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
