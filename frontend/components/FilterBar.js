export default function FilterBar({ filters, onFilterChange, users = [] }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    onFilterChange({ priority: "", status: "", assignedTo: "" });
  };

  const hasFilters = filters.priority || filters.status || filters.assignedTo;

  return (
    <div className="filter-bar">
      <select name="priority" value={filters.priority} onChange={handleChange}>
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select name="status" value={filters.status} onChange={handleChange}>
        <option value="">All Statuses</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <select name="assignedTo" value={filters.assignedTo} onChange={handleChange}>
        <option value="">All Users</option>
        {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
      </select>
      {hasFilters && <button onClick={clearFilters} className="btn btn-sm btn-secondary">Clear</button>}
    </div>
  );
}
