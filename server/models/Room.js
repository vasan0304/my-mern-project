const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  block: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block',
    required: true
  },
  floor: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['classroom', 'lab', 'office', 'hall', 'other'],
    default: 'classroom'
  },
  capacity: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', RoomSchema);