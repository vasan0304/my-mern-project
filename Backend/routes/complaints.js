const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Role = require('../models/Role');
const { protect } = require('../middleware/auth');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Helper: check role
const isSuperAdmin = (user) => user.role && user.role.roleName.toLowerCase() === 'superadmin';
const isUser = (user) => user.role && user.role.roleName.toLowerCase() === 'user';

// Build filter based on role
const getFilter = (user) => {
  if (isSuperAdmin(user)) return {};
  if (isUser(user)) return { raisedBy: user._id };
  // Staff - see complaints they raised OR assigned to them
  return { $or: [{ raisedBy: user._id }, { assignedTo: user._id }] };
};

// Dashboard stats
router.get('/dashboard', protect, async (req, res) => {
  try {
    const filter = getFilter(req.user);

    const [total, pending, assigned, inProgress, onHold, completed] = await Promise.all([
      Complaint.countDocuments(filter),
      Complaint.countDocuments({ ...filter, status: 'Pending' }),
      Complaint.countDocuments({ ...filter, status: 'Assigned' }),
      Complaint.countDocuments({ ...filter, status: 'In-Progress' }),
      Complaint.countDocuments({ ...filter, status: 'On Hold' }),
      Complaint.countDocuments({ ...filter, status: 'Completed' })
    ]);

    res.json({ total, pending, assigned, inProgress, onHold, completed });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// List complaints
router.get('/', protect, async (req, res) => {
  try {
    const filter = getFilter(req.user);

    const complaints = await Complaint.find(filter)
      .populate('block').populate('room').populate('raisedBy', '-password')
      .populate('assignedTo', '-password').populate('department')
      .sort('-createdAt');

    res.json(complaints);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create complaint - all authenticated users
router.post('/', protect, upload.single('complaintAttachment'), async (req, res) => {
  try {
    const user = req.user;
    const complaintData = {
      ...req.body,
      raisedBy: user._id,
      department: user.department,
      complaintAttachment: req.file ? req.file.filename : undefined
    };

    const complaint = await Complaint.create(complaintData);
    res.status(201).json(complaint);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Assign complaint (SuperAdmin only)
router.patch('/:id/assign', protect, async (req, res) => {
  try {
    if (!isSuperAdmin(req.user)) return res.status(403).json({ message: 'SuperAdmin only' });

    const { assignedTo } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    if (complaint.status === 'Completed') return res.status(400).json({ message: 'Cannot reassign completed complaint' });

    complaint.assignedTo = assignedTo;
    complaint.status = 'Assigned';
    complaint.statusHistory.push({ status: 'Assigned', changedBy: req.user._id });
    await complaint.save();
    res.json(complaint);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Update status (Staff/Technician or SuperAdmin)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const assignedId = complaint.assignedTo?.toString();
    const userId = req.user._id.toString();
    if (!isSuperAdmin(req.user) && assignedId !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    complaint.status = status;
    complaint.statusHistory.push({ status, changedBy: req.user._id, remarks });
    await complaint.save();
    res.json(complaint);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;