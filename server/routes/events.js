const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Event = require('../models/Event');
const User = require('../models/User');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: admin role required' });
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get upcoming events first, then past events
    const currentDate = new Date();
    const events = await Event.find()
      .populate('author', 'name')
      .sort({ eventDate: 1 });
    
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/events/upcoming
// @desc    Get upcoming events
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const currentDate = new Date();
    const events = await Event.find({ eventDate: { $gte: currentDate } })
      .populate('author', 'name')
      .sort({ eventDate: 1 })
      .limit(3);
    
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('author', 'name');
    
    if (!event) {
      return res.status(404).json({ msg: 'Événement non trouvé' });
    }
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Événement non trouvé' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/events
// @desc    Create an event
// @access  Private (admin only)
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const { title, description, eventDate, location, imageUrl, category } = req.body;
    
    const newEvent = new Event({
      title,
      description,
      eventDate,
      location,
      imageUrl,
      category,
      author: req.user.id
    });
    
    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private (admin only)
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const { title, description, eventDate, location, imageUrl, category } = req.body;
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Événement non trouvé' });
    }
    
    event.title = title;
    event.description = description;
    event.eventDate = eventDate;
    event.location = location;
    if (imageUrl) event.imageUrl = imageUrl;
    if (category) event.category = category;
    
    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Événement non trouvé' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private (admin only)
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Événement non trouvé' });
    }
    
    await event.remove();
    res.json({ msg: 'Événement supprimé' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Événement non trouvé' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/events/category/:category
// @desc    Get events by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    // Check if valid category
    if (!['académique', 'culturel', 'sportif'].includes(category)) {
      return res.status(400).json({ msg: 'Catégorie invalide' });
    }
    
    // Get events by category
    const events = await Event.find({ category })
      .populate('author', 'name')
      .sort({ eventDate: 1 });
      
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 