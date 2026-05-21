import Link from "next/link";

export default function TaskCard({ task, onDelete, users = [] }) {
  const assignedUser = users.find((u) => u.id === task.assignedTo);

  return (
    <div className={`task-card ${task.status === "Done" ? "task-done" : ""}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-meta">
        <span className={`status-badge status-${task.status === "To Do" ? "todo" : task.status === "In Progress" ? "progress" : "done"}`}>
          {task.status}
        </span>
        {assignedUser && (
          <span className="task-assignee">
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 18, height: 18, borderRadius: '50%',
              background: 'var(--gray-300)', color: '#fff',
              fontSize: '0.6rem', fontWeight: 700, lineHeight: 1
            }}>{assignedUser.name.charAt(0).toUpperCase()}</span>
            {assignedUser.name}
          </span>
        )}
      </div>

      <div className="task-actions">
        <Link href={`/tasks/${task.id}`} className="btn btn-sm btn-primary">View</Link>
        {onDelete && <button onClick={() => onDelete(task.id)} className="btn btn-sm btn-danger">Delete</button>}
      </div>
    </div>
  );
}
