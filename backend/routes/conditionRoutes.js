const express = require('express');
const router = express.Router();
const Condition = require('../models/Condition');

// GET all conditions
router.get('/', async (req, res) => {
  try {
    const conditions = await Condition.getAll();
    res.json({ success: true, data: conditions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET a specific condition by ID
router.get('/:id', async (req, res) => {
  try {
    const condition = await Condition.getById(req.params.id);
    if (!condition) {
      return res.status(404).json({ success: false, error: 'Condition not found' });
    }
    res.json({ success: true, data: condition });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create a new condition
router.post('/', async (req, res) => {
  try {
    const condition = await Condition.create(req.body);
    res.status(201).json({ success: true, data: condition });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update a condition
router.put('/:id', async (req, res) => {
  try {
    const condition = await Condition.update(req.params.id, req.body);
    if (!condition) {
      return res.status(404).json({ success: false, error: 'Condition not found' });
    }
    res.json({ success: true, data: condition });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE a condition
router.delete('/:id', async (req, res) => {
  try {
    const condition = await Condition.delete(req.params.id);
    if (!condition) {
      return res.status(404).json({ success: false, error: 'Condition not found' });
    }
    res.json({ success: true, message: 'Condition deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;