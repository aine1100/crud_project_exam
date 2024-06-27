const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const Company = require("../model/generalinfo.model");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/exam")
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
        title, firstname, lastname, position, company, businessArea, employees, street, additionalInformation, zipCode, place, country, code, phone, email
    } = req.body;

    if (!title || !firstname || !lastname || !position || !company || !businessArea || !employees || !street || !additionalInformation || !zipCode || !place || !country || !code || !phone || !email) {
        return res.status(400).send("All fields are required");
    }

    const companyData = {
        title,
        firstname,
        lastname,
        position,
        company,
        businessArea,
        employees,
        street,
        additionalInformation,
        zipCode,
        place,
        country,
        code,
        phone,
        email
    };
    
    try {
        const newCompany = new Company({ ...companyData })
        await newCompany.save();
        return res.status(200).send("Company saved successfully");
    } catch (err) {
        console.error("Failed to create new company", err);
        return res.status(500).send("Failed to create new company");
    }
});

app.get("/allUser", async (req, res) => {
    try {
        const companies = await Company.find();
        res.status(200).send(companies);
        console.log("Users fetched successfully");
    } catch (err) {
        res.status(400).send(err);
        console.log("Failed to fetch users", err);
    }
});

app.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedCompany = await Company.findOneAndUpdate({ _id: id }, updateData, { new: true, runValidators: true });
        if (!updatedCompany) {
            return res.status(400).send("No company info found");
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
        const deletedCompany = await Company.deleteOne({ _id: id });
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
