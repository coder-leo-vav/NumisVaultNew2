const express = require('express');
const router = express.Router();
const Coin = require('../models/Coin');
const { validateCoin } = require('../middleware/validation');

// GET all coins with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search || '',
      sortBy: req.query.sortBy || 'id',
      sortOrder: req.query.sortOrder || 'ASC',
      countryId: req.query.countryId,
      denominationId: req.query.denominationId,
      materialId: req.query.materialId,
      conditionId: req.query.conditionId
    };

    const coins = await Coin.getAll(options);
    const total = await Coin.count(options);
    const totalPages = Math.ceil(total / options.limit);

    res.json({
      success: true,
      data: coins,
      pagination: {
        currentPage: options.page,
        totalPages,
        totalItems: total,
        itemsPerPage: options.limit
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET a specific coin by ID
router.get('/:id', async (req, res) => {
  try {
    const coin = await Coin.getById(req.params.id);
    if (!coin) {
      return res.status(404).json({ success: false, error: 'Coin not found' });
    }
    res.json({ success: true, data: coin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create a new coin
router.post('/', validateCoin, async (req, res) => {
  try {
    const coin = await Coin.create(req.body);
    res.status(201).json({ success: true, data: coin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update a coin
router.put('/:id', validateCoin, async (req, res) => {
  try {
    const coin = await Coin.update(req.params.id, req.body);
    if (!coin) {
      return res.status(404).json({ success: false, error: 'Coin not found' });
    }
    res.json({ success: true, data: coin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE a coin
router.delete('/:id', async (req, res) => {
  try {
    const coin = await Coin.delete(req.params.id);
    if (!coin) {
      return res.status(404).json({ success: false, error: 'Coin not found' });
    }
    res.json({ success: true, message: 'Coin deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;