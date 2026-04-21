const Product = require('../models/Product');
const Order = require('../models/Order');

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = 'mock' } = req.body;

    if (!items?.length) {
      res.status(400);
      throw new Error('Order items are required');
    }

    const enrichedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.title}`);
      }

      product.stock -= item.quantity;
      await product.save();

      enrichedItems.push({
        product: product._id,
        title: product.title,
        image: product.images[0] || '',
        price: product.price,
        quantity: item.quantity,
      });
    }

    const itemsPrice = enrichedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxPrice = Number((itemsPrice * 0.1).toFixed(2));
    const shippingPrice = itemsPrice > 500 ? 0 : 29;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      user: req.user._id,
      items: enrichedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'mock' ? 'paid' : 'pending',
      paidAt: paymentMethod === 'mock' ? new Date() : undefined,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders };
