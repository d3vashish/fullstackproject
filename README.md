# Full Stack Task Manager

A simple task management app built with Next.js and Express.

## Setup

### Without Docker

**1. Install dependencies**

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

**2. Start the app**

```bash
npm run dev
```

This runs both the backend (port 5000) and frontend (port 3000).

**3. Open the app**

Go to `http://localhost:3000`. Create an account and start adding tasks.

### With Docker

```bash
docker compose up --build
```

Go to `http://localhost:3000`.

## What it does

- Create, edit, and delete tasks
- Assign tasks to users
- Filter by priority, status, or assignee
- Switch between "All" and "My Tasks" view
