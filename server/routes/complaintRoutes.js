const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { 
  sendTicketCreatedEmail, 
  sendTicketUpdateEmail, 
  sendTicketAssignedEmail 
} = require('../utils/emailService');

// Create a new complaint/ticket
router.post('/create', auth, async (req, res) => {
  try {
    const { title, description, category, priority, department } = req.body;

    const ticket = new Ticket({
      user: req.user._id,
      title,
      description,
      category: category || 'Other',
      priority: priority || 'medium',
      department: department || null,
      status: 'pending'
    });

    await ticket.save();

    // Populate user details
    await ticket.populate('user', 'name email');

    // Send email notification
    try {
      await sendTicketCreatedEmail(req.user, ticket);
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Failed to create ticket' });
  }
});

// Get all tickets (Admin/SuperAdmin) or user's tickets
router.get('/all', auth, async (req, res) => {
  try {
    let query = {};
    
    // If user, only show their tickets
    if (req.user.role === 'user') {
      query.user = req.user._id;
    }

    const tickets = await Ticket.find(query)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .populate('department', 'name code')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
});

// Get a single ticket
router.get('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'name email phoneNumber')
      .populate('assignedTo', 'name email')
      .populate('department', 'name code');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user has permission
    if (req.user.role === 'user' && ticket.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Failed to fetch ticket' });
  }
});

// Update ticket status (Admin/SuperAdmin)
router.put('/:id/status', auth, authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const ticket = await Ticket.findById(req.params.id).populate('user', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const oldStatus = ticket.status;
    ticket.status = status;
    
    if (status === 'resolved' || status === 'closed') {
      ticket.resolvedAt = Date.now();
    }
    
    if (resolutionNotes) {
      ticket.resolutionNotes = resolutionNotes;
    }

    await ticket.save();

    // Send email notification for status update
    try {
      const updateMessage = `Ticket status changed from ${oldStatus} to ${status}`;
      await sendTicketUpdateEmail(ticket.user, ticket, updateMessage);
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    res.json({
      message: 'Ticket status updated',
      ticket
    });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({ message: 'Failed to update ticket' });
  }
});

// Assign ticket to user (Admin/SuperAdmin)
router.put('/:id/assign', auth, authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const { assignedToId } = req.body;
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const assignedUser = await User.findById(assignedToId);
    if (!assignedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    ticket.assignedTo = assignedToId;
    ticket.status = 'in-progress';
    await ticket.save();

    // Send email notification to assigned user
    try {
      await sendTicketAssignedEmail(assignedUser, ticket, req.user.name);
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    // Send email to ticket creator
    try {
      const updateMessage = `Ticket assigned to ${assignedUser.name}`;
      await sendTicketUpdateEmail(ticket.user, ticket, updateMessage);
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    res.json({
      message: 'Ticket assigned successfully',
      ticket
    });
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({ message: 'Failed to assign ticket' });
  }
});

// Get tickets by status
router.get('/status/:status', auth, async (req, res) => {
  try {
    const { status } = req.params;
    let query = { status };

    if (req.user.role === 'user') {
      query.user = req.user._id;
    }

    const tickets = await Ticket.find(query)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error('Get tickets by status error:', error);
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
});

// Get ticket statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'user') {
      query.user = req.user._id;
    }

    const total = await Ticket.countDocuments(query);
    const pending = await Ticket.countDocuments({ ...query, status: 'pending' });
    const inProgress = await Ticket.countDocuments({ ...query, status: 'in-progress' });
    const resolved = await Ticket.countDocuments({ ...query, status: 'resolved' });
    const closed = await Ticket.countDocuments({ ...query, status: 'closed' });

    // Priority counts
    const low = await Ticket.countDocuments({ ...query, priority: 'low' });
    const medium = await Ticket.countDocuments({ ...query, priority: 'medium' });
    const high = await Ticket.countDocuments({ ...query, priority: 'high' });
    const critical = await Ticket.countDocuments({ ...query, priority: 'critical' });

    res.json({
      total,
      status: { pending, inProgress, resolved, closed },
      priority: { low, medium, high, critical }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

module.exports = router;