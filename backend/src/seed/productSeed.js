require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const demoProducts = [
  {
    title: 'Urban Oversized Tee',
    description: 'Premium cotton oversized t-shirt with breathable fabric and relaxed fit.',
    price: 899,
    category: 'Tops',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1200'],
  },
  {
    title: 'Classic Denim Jacket',
    description: 'Washed denim jacket with modern tailoring for everyday layering.',
    price: 2499,
    category: 'Outerwear',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200'],
  },
  {
    title: 'Slim Fit Chinos',
    description: 'Stretchable slim fit chinos with all-day comfort and clean silhouette.',
    price: 1499,
    category: 'Bottoms',
    stock: 24,
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200'],
  },
  {
    title: 'Minimalist Sneakers',
    description: 'Lightweight lifestyle sneakers with cushioned sole and neutral tone.',
    price: 2999,
    category: 'Footwear',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200'],
  },
  {
    title: 'Structured Tote Bag',
    description: 'Modern structured tote with durable finish and spacious inner compartment.',
    price: 1299,
    category: 'Accessories',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1591561954557-26941169b49e?w=1200'],
  },
  {
    title: 'Textured Hoodie',
    description: 'Soft fleece hoodie with subtle texture and elevated streetwear vibe.',
    price: 1899,
    category: 'Tops',
    stock: 22,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200'],
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingCount = await Product.countDocuments();

    if (existingCount > 0) {
      console.log(`Products already exist (${existingCount})`);
      process.exit(0);
    }

    await Product.insertMany(demoProducts);

    console.log('Sample products seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedProducts();
