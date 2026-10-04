const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

router.get('/', foodController.getAllFoods);
router.get('/:id', foodController.getFoodById);
router.post('/', foodController.createFood);
router.put('/:id', foodController.updateFood);
router.delete('/:id', foodController.deleteFood);
router.patch('/:id/availability', foodController.toggleAvailability);

module.exports = router;
