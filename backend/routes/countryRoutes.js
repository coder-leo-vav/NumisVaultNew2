const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

// GET all countries
router.get('/', async (req, res) => {
  try {
    const countries = await Country.getAll();
    res.json({ success: true, data: countries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET a specific country by ID
router.get('/:id', async (req, res) => {
  try {
    const country = await Country.getById(req.params.id);
    if (!country) {
      return res.status(404).json({ success: false, error: 'Country not found' });
    }
    res.json({ success: true, data: country });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create a new country
router.post('/', async (req, res) => {
  try {
    const country = await Country.create(req.body);
    res.status(201).json({ success: true, data: country });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update a country
router.put('/:id', async (req, res) => {
  try {
    const country = await Country.update(req.params.id, req.body);
    if (!country) {
      return res.status(404).json({ success: false, error: 'Country not found' });
    }
    res.json({ success: true, data: country });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE a country
router.delete('/:id', async (req, res) => {
  try {
    const country = await Country.delete(req.params.id);
    if (!country) {
      return res.status(404).json({ success: false, error: 'Country not found' });
    }
    res.json({ success: true, message: 'Country deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;