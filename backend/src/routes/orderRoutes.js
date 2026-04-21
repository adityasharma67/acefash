const express = require('express');
const { createOrder, getMyOrders, getAllOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, authorize('admin'), getAllOrders);

module.exports = router;
