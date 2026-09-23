const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const JWT_SECRET = "training_secret_key_2026";
const MONGO_URI = "mongodb+srv://anshu:priya022006@cluster0.wfqzacv.mongodb.net/taskmanager?appName=Cluster0";

app.use(express.json());
app.use(express.static("public"));

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

const taskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});
const Task = mongoose.model("Task", taskSchema);

function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
}

app.post("/api/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ error: "Username already taken" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.json({ message: "Signup successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "Invalid username or password" });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: "Invalid username or password" });
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/tasks", auth, async (req, res) => {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
});

app.post("/api/tasks", auth, async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Task text required" });
    const task = new Task({ text, user: req.userId });
    await task.save();
    res.json(task);
});

app.put("/api/tasks/:id", auth, async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ error: "Task not found" });
    task.completed = !task.completed;
    await task.save();
    res.json(task);
});

app.delete("/api/tasks/:id", auth, async (req, res) => {
    await Task.deleteOne({ _id: req.params.id, user: req.userId });
    res.json({ message: "Task deleted" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
});
