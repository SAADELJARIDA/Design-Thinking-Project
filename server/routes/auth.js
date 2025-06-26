const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // Import auth middleware
const adminEmails = require('../config/adminEmails');

const User = require('../models/User');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error getting authenticated user:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/auth/test
// @desc    Test connection to MongoDB
// @access  Public
router.get('/test', async (req, res) => {
  try {
    // Try to count users to test database connection
    const count = await User.countDocuments();
    res.json({ success: true, message: 'MongoDB connection successful', count });
  } catch (err) {
    console.error('Test route error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET api/auth/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/users', auth, async (req, res) => {
  try {
    // Check if the current user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: admin role required' });
    }

    // Get all users without their passwords
    const users = await User.find().select('-password').sort({ date: -1 });
    res.json(users);
  } catch (err) {
    console.error('Error getting users:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    console.log('Register attempt with:', { name, email });
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Determine user role:
    // 1. Is the email in the predefined admin list?
    // 2. Is this the first user to register?
    // 3. Otherwise, default to regular user
    let userRole = 'user';
    
    if (adminEmails.includes(email)) {
      userRole = 'admin';
    } else {
      const isFirstUser = await User.countDocuments() === 0;
      if (isFirstUser) userRole = 'admin';
    }
    
    // Allow explicit role setting only if it's admin and already qualified for admin
    if (role === 'admin' && userRole === 'admin') {
      userRole = 'admin';
    }

    user = new User({
      name,
      email,
      password,
      role: userRole
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();
    console.log('User created successfully with ID:', user.id);

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).send('Server error: ' + err.message);
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/make-admin
// @desc    Make a user an admin (only existing admins can do this)
// @access  Private/Admin
router.post('/make-admin', auth, async (req, res) => {
  try {
    // Check if the current user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: admin role required' });
    }
    
    const { userId } = req.body;
    
    // Find the user to update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Update the role
    user.role = 'admin';
    await user.save();
    
    res.json({ msg: 'User successfully made admin', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Make admin error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/remove-admin
// @desc    Remove admin rights from a user (only existing admins can do this)
// @access  Private/Admin
router.post('/remove-admin', auth, async (req, res) => {
  try {
    // Check if the current user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: admin role required' });
    }
    
    const { userId } = req.body;
    
    // Find the user to update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Cannot demote yourself
    if (userId === req.user.id) {
      return res.status(400).json({ msg: 'Cannot remove your own admin privileges' });
    }
    
    // Update the role
    user.role = 'user';
    await user.save();
    
    res.json({ msg: 'Admin privileges removed', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Remove admin error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, profileImage } = req.body;
    
    // Find user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Update user fields
    if (name) user.name = name;
    if (profileImage) user.profileImage = profileImage;
    
    await user.save();
    
    // Return the updated user without password
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error('Profile update error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 