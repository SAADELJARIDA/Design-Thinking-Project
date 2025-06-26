const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Actualite = require('../models/Actualite');
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

// @route   GET api/actualites
// @desc    Get all actualites
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get latest news first
    const actualites = await Actualite.find()
      .populate('author', 'name')
      .sort({ date: -1 });
    res.json(actualites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/actualites/latest
// @desc    Get latest actualites (limit to 3)
// @access  Public
router.get('/latest', async (req, res) => {
  try {
    // Get latest 3 news items
    const actualites = await Actualite.find()
      .populate('author', 'name')
      .sort({ date: -1 })
      .limit(3);
    res.json(actualites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/actualites/:id
// @desc    Get actualite by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const actualite = await Actualite.findById(req.params.id).populate('author', 'name');
    
    if (!actualite) {
      return res.status(404).json({ msg: 'Actualité non trouvée' });
    }
    
    res.json(actualite);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Actualité non trouvée' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/actualites
// @desc    Create an actualite
// @access  Private (admin only)
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const { title, content, imageUrl, category } = req.body;
    
    const newActualite = new Actualite({
      title,
      content,
      imageUrl,
      category,
      author: req.user.id
    });
    
    const actualite = await newActualite.save();
    res.json(actualite);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/actualites/:id
// @desc    Update an actualite
// @access  Private (admin only)
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const { title, content, imageUrl, category } = req.body;
    
    const actualite = await Actualite.findById(req.params.id);
    
    if (!actualite) {
      return res.status(404).json({ msg: 'Actualité non trouvée' });
    }
    
    actualite.title = title;
    actualite.content = content;
    if (imageUrl) actualite.imageUrl = imageUrl;
    if (category) actualite.category = category;
    
    await actualite.save();
    res.json(actualite);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Actualité non trouvée' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/actualites/:id
// @desc    Delete an actualite
// @access  Private (admin only)
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const actualite = await Actualite.findById(req.params.id);
    
    if (!actualite) {
      return res.status(404).json({ msg: 'Actualité non trouvée' });
    }
    
    await Actualite.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Actualité supprimée' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Actualité non trouvée' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/actualites/category/:category
// @desc    Get actualites by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    // Check if valid category
    if (!['académique', 'culturel', 'sportif'].includes(category)) {
      return res.status(400).json({ msg: 'Catégorie invalide' });
    }
    
    // Get actualites by category
    const actualites = await Actualite.find({ category })
      .populate('author', 'name')
      .sort({ date: -1 });
      
    res.json(actualites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 