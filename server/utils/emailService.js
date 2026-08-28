const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendTicketCreatedEmail = async (user, ticket) => {
  const subject = `Ticket ${ticket.ticketId} Created Successfully`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
      <h2 style="color: #1e3a5f;">Ticket Created</h2>
      <p>Dear ${user.name},</p>
      <p>Your ticket has been created successfully with the following details:</p>
      <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #1e3a5f;">
        <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
        <p><strong>Title:</strong> ${ticket.title}</p>
        <p><strong>Priority:</strong> ${ticket.priority}</p>
        <p><strong>Status:</strong> ${ticket.status}</p>
        <p><strong>Description:</strong> ${ticket.description}</p>
      </div>
      <p style="margin-top: 20px;">You can track the status of your ticket at any time.</p>
      <p>Thank you,<br>Ticket Management System</p>
    </div>
  `;
  return sendEmail(user.email, subject, html);
};

const sendTicketUpdateEmail = async (user, ticket, updateMessage) => {
  const subject = `Ticket ${ticket.ticketId} Updated`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
      <h2 style="color: #1e3a5f;">Ticket Update</h2>
      <p>Dear ${user.name},</p>
      <p>Your ticket has been updated:</p>
      <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #1e3a5f;">
        <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
        <p><strong>Status:</strong> ${ticket.status}</p>
        <p><strong>Update:</strong> ${updateMessage}</p>
      </div>
      <p style="margin-top: 20px;">Please log in to view more details.</p>
      <p>Thank you,<br>Ticket Management System</p>
    </div>
  `;
  return sendEmail(user.email, subject, html);
};

const sendTicketAssignedEmail = async (user, ticket, assignedBy) => {
  const subject = `Ticket ${ticket.ticketId} Assigned to You`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
      <h2 style="color: #1e3a5f;">Ticket Assigned</h2>
      <p>Dear ${user.name},</p>
      <p>A ticket has been assigned to you by ${assignedBy}:</p>
      <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #1e3a5f;">
        <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
        <p><strong>Title:</strong> ${ticket.title}</p>
        <p><strong>Priority:</strong> ${ticket.priority}</p>
        <p><strong>Description:</strong> ${ticket.description}</p>
      </div>
      <p style="margin-top: 20px;">Please log in to view and resolve the ticket.</p>
      <p>Thank you,<br>Ticket Management System</p>
    </div>
  `;
  return sendEmail(user.email, subject, html);
};

module.exports = {
  sendEmail,
  sendTicketCreatedEmail,
  sendTicketUpdateEmail,
  sendTicketAssignedEmail
};