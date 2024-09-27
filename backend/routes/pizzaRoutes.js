// pizzaRoutes.js (Pizza Routes for Admin and User)
const express = require('express');
const { protect, adminProtect } = require('../middleware/authMiddleware');
const {
    getAllPizzas,
    createPizza,
    updatePizzaStock,
} = require('../controllers/pizzaController');
const router = express.Router();

// User routes
router.get('/', protect, getAllPizzas);

// Admin routes
router.post('/', protect, adminProtect, createPizza);
router.put('/:id', protect, adminProtect, updatePizzaStock);

module.exports = router;
