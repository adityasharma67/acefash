const Product = require('../models/Product');
const Order = require('../models/Order');

const createOrderNumber = async () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');

  const countToday = await Order.countDocuments({
    createdAt: {
      $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
    },
  });

  return `ACE-${y}${m}${d}-${String(countToday + 1).padStart(4, '0')}`;
};

const maybeAutoProgressOrder = async (order) => {
  const now = Date.now();
  const created = new Date(order.createdAt).getTime();
  const timeline = order.statusTimeline || {};
  let changed = false;

  if (order.orderStatus === 'processing' && now - created > 30 * 60 * 1000) {
    order.orderStatus = 'shipped';
    if (!timeline.shippedAt) {
      timeline.shippedAt = new Date(created + 30 * 60 * 1000);
    }
    changed = true;
  }

  if (order.orderStatus === 'shipped' && now - created > 2 * 60 * 60 * 1000) {
    order.orderStatus = 'delivered';
    if (!timeline.deliveredAt) {
      timeline.deliveredAt = new Date(created + 2 * 60 * 60 * 1000);
    }
    changed = true;
  }

  order.statusTimeline = {
    processingAt: timeline.processingAt || order.createdAt,
    shippedAt: timeline.shippedAt,
    deliveredAt: timeline.deliveredAt,
    cancelledAt: timeline.cancelledAt,
  };

  if (changed) {
    await order.save();
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = 'mock', paymentId = '' } = req.body;

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
      orderNumber: await createOrderNumber(),
      items: enrichedItems,
      shippingAddress,
      paymentMethod,
      paymentId,
      paymentStatus: paymentMethod === 'mock' ? 'paid' : 'pending',
      paidAt: paymentMethod === 'mock' ? new Date() : undefined,
      statusTimeline: {
        processingAt: new Date(),
      },
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

const createStorefrontOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress = {}, paymentMethod = 'razorpay', paymentStatus = 'paid', paymentId = '' } = req.body;

    if (!items?.length) {
      res.status(400);
      throw new Error('Order items are required');
    }

    const normalizedItems = items.map((item) => ({
      storefrontProductId: Number(item.productId),
      title: item.title,
      image: item.image || '',
      price: Number(item.price),
      quantity: Number(item.quantity),
      size: item.size || 'N/A',
    }));

    const hasInvalidItem = normalizedItems.some(
      (item) => !item.title || !Number.isFinite(item.price) || item.price < 0 || !Number.isFinite(item.quantity) || item.quantity < 1
    );

    if (hasInvalidItem) {
      res.status(400);
      throw new Error('Invalid storefront order items');
    }

    const itemsPrice = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxPrice = Number((itemsPrice * 0.1).toFixed(2));
    const shippingPrice = 0;
    const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

    const order = await Order.create({
      user: req.user._id,
      orderNumber: await createOrderNumber(),
      items: normalizedItems,
      shippingAddress,
      paymentMethod,
      paymentId,
      paymentStatus,
      paidAt: paymentStatus === 'paid' ? new Date() : undefined,
      statusTimeline: {
        processingAt: new Date(),
      },
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

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['processing', 'shipped', 'delivered', 'cancelled'];

    if (!allowed.includes(status)) {
      res.status(400);
      throw new Error('Invalid status value');
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.orderStatus = status;

    const now = new Date();
    const timeline = order.statusTimeline || {};
    if (status === 'processing' && !timeline.processingAt) timeline.processingAt = now;
    if (status === 'shipped' && !timeline.shippedAt) timeline.shippedAt = now;
    if (status === 'delivered' && !timeline.deliveredAt) timeline.deliveredAt = now;
    if (status === 'cancelled' && !timeline.cancelledAt) timeline.cancelledAt = now;
    order.statusTimeline = timeline;

    const updated = await order.save();
    res.status(200).json({ success: true, order: updated });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    await Promise.all(orders.map((order) => maybeAutoProgressOrder(order)));
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    await Promise.all(orders.map((order) => maybeAutoProgressOrder(order)));
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, createStorefrontOrder, getMyOrders, getAllOrders, updateOrderStatus };
