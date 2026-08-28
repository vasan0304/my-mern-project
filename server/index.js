require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jandb')
  .then(() => console.log('✅ MongoDB connected!'))
  .catch(err => console.error('❌ Error connecting to MongoDB:', err));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/protected', require('./routes/protectedRoute'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/superadmin', require('./routes/superAdminRoutes'));
app.use('/api/complaint', require('./routes/complaintRoutes'));
app.use('/api/superadmin/room', require('./routes/room'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});