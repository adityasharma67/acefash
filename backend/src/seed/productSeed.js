require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const demoProducts = [
  {
    title: 'ProDry Training Tee',
    description: 'Sweat-wicking sports t-shirt designed for gym workouts and running sessions.',
    price: 999,
    category: 'Sportswear',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200'],
  },
  {
    title: 'All-Weather Track Jacket',
    description: 'Lightweight zip-up sports jacket for warm-up, training, and outdoor runs.',
    price: 2199,
    category: 'Sportswear',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200'],
  },
  {
    title: 'FlexFit Running Shorts',
    description: 'Breathable running shorts with stretch fabric and quick-dry comfort.',
    price: 1299,
    category: 'Running',
    stock: 24,
    images: ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200'],
  },
  {
    title: 'Velocity Running Shoes',
    description: 'Performance running shoes with cushioned sole and responsive traction.',
    price: 3499,
    category: 'Footwear',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200'],
  },
  {
    title: 'Match-Day Football',
    description: 'Durable stitched football ideal for practice sessions and turf matches.',
    price: 1499,
    category: 'Equipment',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1200'],
  },
  {
    title: 'GripX Gym Gloves',
    description: 'Padded gym gloves for better grip during weight training and pull workouts.',
    price: 799,
    category: 'Accessories',
    stock: 22,
    images: ['https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200'],
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany({});
    await Product.insertMany(demoProducts);

    console.log('Sports products seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedProducts();
