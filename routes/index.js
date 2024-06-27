const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Task = require("./model/data.model");
const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/exam")
    .then(() => {
        console.log("Connected to the database");

        app.listen(5000, () => {
            console.log("Connected to port 5000");
        });
    })
    .catch((err) => {
        console.error("Failed to connect to the database", err);
    });

app.post("/tasks", async (req, res) => {
    const { name, description, duration } = req.body;

    if (!name || !description || !duration) {
        return res.status(400).send("All fields are required");
    }

    const taskData = { name, description, duration };

    try {
        const newTask = new Task(taskData);
        await newTask.save();
        return res.status(200).send(newTask);
    } catch (err) {
        console.error("Failed to create new task", err);
        return res.status(500).send("Failed to create new task");
    }
});

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).send(tasks);
        console.log("Tasks fetched successfully");
    } catch (err) {
        res.status(400).send(err);
        console.log("Failed to fetch tasks", err);
    }
});

app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedTask) {
            return res.status(400).send("No task info found");
        }
        res.status(200).send(updatedTask);
        console.log("Task updated successfully");
    } catch (err) {
        res.status(404).send(err);
        console.log("Failed to update task", err);
    }
});

app.delete("/tasks/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(400).send("No task info found");
        }
        res.status(200).send("Task deleted successfully");
        console.log("Task deleted successfully");
    } catch (err) {
        res.status(400).send(err);
        console.log("Failed to delete task", err);
    }
});

app.patch("/tasks/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { completed: true }, { new: true });
        if (!updatedTask) {
            return res.status(400).send("No task info found");
        }
        res.status(200).send(updatedTask);
        console.log("Task completed successfully");
    } catch (err) {
        res.status(404).send(err);
        console.log("Failed to complete task", err);
    }
});
