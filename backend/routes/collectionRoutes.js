const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');

// GET all collections
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.getAll();
    res.json({ success: true, data: collections });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET a specific collection by ID
router.get('/:id', async (req, res) => {
  try {
    const collection = await Collection.getById(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, error: 'Collection not found' });
    }
    res.json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET coins in a specific collection
router.get('/:id/coins', async (req, res) => {
  try {
    const coins = await Collection.getCoinsInCollection(req.params.id);
    res.json({ success: true, data: coins });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST add a coin to a collection
router.post('/:id/add-coin', async (req, res) => {
  try {
    const { coin_id, quantity, purchase_price, purchase_date, notes } = req.body;
    const result = await Collection.addCoinToCollection(
      req.params.id,
      coin_id,
      quantity,
      purchase_price,
      purchase_date,
      notes
    );
    res.json({ success: true, data: result, message: 'Coin added to collection successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE remove a coin from a collection
router.delete('/:id/remove-coin/:coinId', async (req, res) => {
  try {
    const result = await Collection.removeCoinFromCollection(
      req.params.id,
      req.params.coinId
    );
    if (!result) {
      return res.status(404).json({ success: false, error: 'Coin not found in collection' });
    }
    res.json({ success: true, message: 'Coin removed from collection successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create a new collection
router.post('/', async (req, res) => {
  try {
    const collection = await Collection.create(req.body);
    res.status(201).json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update a collection
router.put('/:id', async (req, res) => {
  try {
    const collection = await Collection.update(req.params.id, req.body);
    if (!collection) {
      return res.status(404).json({ success: false, error: 'Collection not found' });
    }
    res.json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE a collection
router.delete('/:id', async (req, res) => {
  try {
    const collection = await Collection.delete(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, error: 'Collection not found' });
    }
    res.json({ success: true, message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;