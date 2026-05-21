const database = {
  users: new Map(),
  tasks: new Map(),
  nextUserId: 1,
  nextTaskId: 1,

  createUser(userData) {
    const user = {
      id: this.nextUserId++,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      createdAt: new Date().toISOString(),
    };
    this.users.set(user.id, user);
    const { password, ...safe } = user;
    return safe;
  },

  findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email.toLowerCase()) return user;
    }
    return undefined;
  },

  findUserById(id) {
    return this.users.get(id);
  },

  getAllUsers() {
    return Array.from(this.users.values()).map(({ password, ...u }) => u);
  },

  createTask(taskData) {
    const task = {
      id: this.nextTaskId++,
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority || "Medium",
      status: taskData.status || "To Do",
      createdBy: taskData.createdBy,
      assignedTo: taskData.assignedTo || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.set(task.id, task);
    return { ...task };
  },

  getTaskById(id) {
    return this.tasks.get(id);
  },

  getAllTasks() {
    return Array.from(this.tasks.values());
  },

  getTasksByUser(userId) {
    return this.getAllTasks().filter(
      (t) => t.assignedTo === userId || t.createdBy === userId
    );
  },

  updateTask(id, updates) {
    const task = this.tasks.get(id);
    if (!task) return null;
    Object.assign(task, updates, { updatedAt: new Date().toISOString() });
    return { ...task };
  },

  deleteTask(id) {
    return this.tasks.delete(id);
  },

  reset() {
    this.users.clear();
    this.tasks.clear();
    this.nextUserId = 1;
    this.nextTaskId = 1;
  },
};

module.exports = database;
