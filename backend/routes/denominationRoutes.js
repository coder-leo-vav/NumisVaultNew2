const express = require('express');
const router = express.Router();
const Denomination = require('../models/Denomination');

// GET all denominations
router.get('/', async (req, res) => {
  try {
    const denominations = await Denomination.getAll();
    res.json({ success: true, data: denominations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET a specific denomination by ID
router.get('/:id', async (req, res) => {
  try {
    const denomination = await Denomination.getById(req.params.id);
    if (!denomination) {
      return res.status(404).json({ success: false, error: 'Denomination not found' });
    }
    res.json({ success: true, data: denomination });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create a new denomination
router.post('/', async (req, res) => {
  try {
    const denomination = await Denomination.create(req.body);
    res.status(201).json({ success: true, data: denomination });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update a denomination
router.put('/:id', async (req, res) => {
  try {
    const denomination = await Denomination.update(req.params.id, req.body);
    if (!denomination) {
      return res.status(404).json({ success: false, error: 'Denomination not found' });
    }
    res.json({ success: true, data: denomination });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE a denomination
router.delete('/:id', async (req, res) => {
  try {
    const denomination = await Denomination.delete(req.params.id);
    if (!denomination) {
      return res.status(404).json({ success: false, error: 'Denomination not found' });
    }
    res.json({ success: true, message: 'Denomination deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;