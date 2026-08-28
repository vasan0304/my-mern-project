const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  block: { type: mongoose.Schema.Types.ObjectId, ref: 'Block', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  complaintType: {
    type: String,
    enum: ['PC Hardware', 'PC Software', 'Application Issues', 'Network', 'Electronics', 'Plumbing', 'Other'],
    required: true
  },
  complaintRemarks: { type: String, required: true },
  complaintAttachment: { type: String },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In-Progress', 'On Hold', 'Completed'],
    default: 'Pending'
  },
  statusHistory: [{
    status: String,
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedAt: { type: Date, default: Date.now },
    remarks: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
