const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true, unique: true },
  departmentShortName: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
