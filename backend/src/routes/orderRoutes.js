const express = require('express');
const {
	createOrder,
	createStorefrontOrder,
	getMyOrders,
	getAllOrders,
	updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.post('/storefront', protect, createStorefrontOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, authorize('admin'), getAllOrders);
router.patch('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
