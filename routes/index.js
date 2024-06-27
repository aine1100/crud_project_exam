const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Tasks=require("./model/data.model")
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


app.post("/register", async (req, res) => {
    const {
        title,description,duration
    } = req.body;

    if (!title|| !description || !duration) {
        return res.status(400).send("All fields are required");
    }

    const companyData = {
      title,
      description,
      duration
    };
    
    try {
        const newCompany = new Tasks({ ...companyData })
        await newCompany.save();
        return res.status(200).send("task saved successfully");
    } catch (err) {
        console.error("Failed to create new company", err);
        return res.status(500).send("Failed to create new task");
    }
});

app.get("/allUser", async (req, res) => {
    try {
        const companies = await Tasks.find();
        res.status(200).send(companies);
        console.log("task fetched successfully");
    } catch (err) {
        res.status(400).send(err);
        console.log("Failed to fetch task", err);
    }
});

app.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedCompany = await Tasks.findOneAndUpdate({ _id: id }, updateData, { new: true, runValidators: true });
        if (!updatedCompany) {
            return res.status(400).send("No task info found");
        }
        res.status(200).send(updatedCompany);
        console.log("Updated successfully");
    } catch (err) {
        res.status(404).send(err);
        console.log("Failed to update company", err);
    }
});

app.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCompany = await Tasks.deleteOne({ _id: id });
        if (deletedCompany.deletedCount === 0) {
            return res.status(400).send("No company info found");
        }
        res.status(200).send("Company deleted successfully");
        console.log(deletedCompany);
    } catch (err) {
        res.status(400).send(err);
        console.log("Failed to delete company", err);
    }
});
