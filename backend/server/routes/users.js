const express = require("express");
const router = express.Router();
const database = require("../database");

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const existing = database.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const user = database.createUser({ name, email, password });
  res.status(201).json({ message: "Registered", user });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = database.findUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const { password: _, ...safe } = user;
  res.json({ message: "Login successful", user: safe });
});

router.get("/", (req, res) => {
  res.json({ users: database.getAllUsers() });
});

router.get("/:id", (req, res) => {
  const user = database.findUserById(parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  const { password, ...safe } = user;
  res.json(safe);
});

module.exports = router;
