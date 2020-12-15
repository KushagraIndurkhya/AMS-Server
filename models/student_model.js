const express = require('express');
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    yearOfStudying: {
        type: Number,
        min:[1,"invlid yearOfStudying"],
        max:[6,"invlid yearOfStudying"],
    },
    rollNumber: {
        type: String,
        required: true,
    },
});

module.exports = new mongoose.model("Student",studentSchema);