const mongoose = require("mongoose");

const SurveySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  ethnicity: {
    type: String,
    required: true,
    enum: ["Caucasian", "Asian", "African American", "Hispanic", "Other"],
  },
});

module.exports = mongoose.model("Survey", SurveySchema);
