const productCategories = [
    { name: 'Shoes', variants: ['Running Shoes', 'Training Shoes', 'Court Shoes', 'Trail Shoes'], basePrice: 1899 },
    { name: 'T-Shirts', variants: ['Training Tee', 'Dry-Fit Tee', 'Match Tee', 'Gym Tee'], basePrice: 699 },
    { name: 'Track Pants', variants: ['Slim Track Pants', 'Warm-Up Track Pants', 'Jogger Track Pants', 'Pro Track Pants'], basePrice: 999 },
    { name: 'Socks', variants: ['Ankle Socks Pack', 'Crew Socks Pack', 'Compression Socks Pack', 'Running Socks Pack'], basePrice: 299 },
    { name: 'Watches', variants: ['Sports Watch', 'Chrono Watch', 'Fitness Watch', 'Trail Watch'], basePrice: 2299 },
    { name: 'Jerseys', variants: ['Team Jersey', 'Match Jersey', 'Practice Jersey', 'Away Jersey'], basePrice: 1199 },
    { name: 'Shorts', variants: ['Training Shorts', 'Running Shorts', 'Court Shorts', 'Gym Shorts'], basePrice: 849 },
    { name: 'Hoodies', variants: ['Warm-Up Hoodie', 'Training Hoodie', 'Zip Hoodie', 'Fleece Hoodie'], basePrice: 1499 },
    { name: 'Bags', variants: ['Duffle Bag', 'Kit Bag', 'Gym Backpack', 'Travel Bag'], basePrice: 1599 },
    { name: 'Accessories', variants: ['Gym Gloves', 'Headband Pack', 'Water Bottle', 'Knee Support'], basePrice: 499 }
];

const productBrands = ['ACE', 'HRX', 'Nike', 'Puma', 'Adidas', 'Reebok', 'Asics', 'UnderArmour', 'NewBalance', 'Fastrack', 'Roadster', 'ProSport'];
const products = [];
let nextId = 1;

productCategories.forEach((category, categoryIndex) => {
    for (let i = 0; i < 12; i++) {
        const brand = productBrands[(categoryIndex + i) % productBrands.length];
        const variant = category.variants[i % category.variants.length];
        const imageNumber = (i % 12) + 1;
        const rating = Math.min(5, 3.5 + ((categoryIndex + i) % 4) * 0.5);
        const price = category.basePrice + (categoryIndex * 53) + (i * 79);

        products.push({
            id: nextId,
            name: `${brand} ${variant} ${String(i + 1).padStart(2, '0')}`,
            image: `product-${imageNumber}.jpg`,
            price: Number(price.toFixed(2)),
            rating,
            category: category.name
        });

        nextId += 1;
    }
});

window.products = products;
