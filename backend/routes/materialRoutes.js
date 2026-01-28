const express = require('express');
const router = express.Router();
const Material = require('../models/Material');

// GET all materials
router.get('/', async (req, res) => {
  try {
    const materials = await Material.getAll();
    res.json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET a specific material by ID
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.getById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, error: 'Material not found' });
    }
    res.json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create a new material
router.post('/', async (req, res) => {
  try {
    const material = await Material.create(req.body);
    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update a material
router.put('/:id', async (req, res) => {
  try {
    const material = await Material.update(req.params.id, req.body);
    if (!material) {
      return res.status(404).json({ success: false, error: 'Material not found' });
    }
    res.json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE a material
router.delete('/:id', async (req, res) => {
  try {
    const material = await Material.delete(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, error: 'Material not found' });
    }
    res.json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;