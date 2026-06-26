const fs = require('fs');
const path = require('path');

const images = [
  "0f6d86ec-690b-450b-a3a4-9f563f369067.jpg",
  "00f53ce3-064e-4bb5-af1b-a6fc373d2a54.jpg",
  "1c72ace3-6f2a-40e5-baa1-2fa0e022038a.jpg",
  "01fc48fd-1857-4a9b-8399-36cb03b07a49.jpg",
  "2c1f07b5-984c-43a3-b600-00fb2e0eaac4.jpg",
  "02cc7a68-22a8-4a29-81b2-8966b67e1129.jpg",
  "3c1e2387-06cd-4eb2-baab-8b22bd46046b.jpg",
  "3e82f57d-cd23-4502-9833-d7d0b77a411b.jpg",
  "03e98598-764a-4857-85de-f9406f4cc577.jpg",
  "4b608b68-c2e2-41ca-8d1e-2750b98c5f11.jpg",
  "5fb46acd-709a-43d1-8e6b-cac32f435a11.jpg",
  "6e95ea1e-cf67-4461-a0d2-2ef43423af5f.jpg",
  "7a8be377-c0f2-4b59-885e-684319068b20.jpg",
  "8c4f3196-f306-4ca9-8d36-ec5e9970e1f8.jpg",
  "8c4f3196-f306-4ca9-8d36-ec35e9970e1f8.jpg",
  "8c591814-dc10-437d-b715-f58292017ceb.jpg",
  "18bfff59-604d-4528-b578-a62ca65252cc.jpg",
  "0030b6e9-9ce6-421f-9221-0a9240d2ffd8.jpg",
  "0030b6e9-9ce61-421f-9221-0a9240d2ffd8.jpg",
  "41f423b0-7238-4224-8988-cab6bbbec808.jpg",
  "65c36701-2fa2-4a4c-9e84-51a5155b4a5f.jpg",
  "94df5ed2-e987-4552-9e9f-a27f34ebf3ca.jpg",
  "634b9802-48dd-47ec-a302-ec7556b79c19.jpg",
  "664e3ed3-a3ec-4a41-8f4b-2988ed95fb5a.jpg",
  "708f3f3a-a559-4afb-b965-016753686f56.jpg",
  "2390df7a-b3bf-4bf0-a69a-8c50dc019170.jpg",
  "3710d524-cdd4-4ebb-b999-13c8f4f70a15.jpg",
  "4197dbee-f869-4666-93ad-b62af20edc6d.jpg",
  "4197dbwee-f869-4666-93ad-b62af20edc6d.jpg",
  "5927bbe8-9f40-4f05-ad35-edfeda601182.jpg",
  "57415f74-55a2-4e61-8986-1f3cf8cfc662.jpg",
  "59272bbe8-9f40-4f05-ad35-edfeda601182.jpg",
  "994286ef-e549-41f0-a03f-8a0b7cc539fe.jpg",
  "9942816ef-e549-41f0-a03f-8a0b7cc539fe.jpg",
  "67194939-9c09-47d0-9df5-42c2b86b2d3a.jpg",
  "83575755-b69c-4fc2-a42d-30752a188885.jpg",
  "a9a987e1-377d-4749-9235-fc82ab8016a4.jpg",
  "a24beba8-fd33-41be-af75-37632ef34608.jpg",
  "ae66b117-ad28-4306-be89-216c0c73d03f.jpg",
  "d9d015de-0329-41da-a69a-5cd682519d36.jpg",
  "d16fb210-a6b9-4a2e-a316-a48d365aa255.jpg",
  "d35085f9-ed9a-4394-a178-68a47abcdc44.jpg",
  "e838ac9c-6f58-44c0-a934-f56729849795.jpg",
  "f4b69304-4298-4ec5-a290-9bf28ad557c4.jpg"
];

const generatedNames = [
  "Aurelien Signature Cotton T-Shirt",
  "Classic Ivory Linen Trousers",
  "Premium Italian Cashmere Sweater",
  "Tailored Slim Fit Chino Pants",
  "Modern Essential Oxford Shirt",
  "Vintage Wash Denim Jeans",
  "Heavyweight Crewneck Pullover",
  "Lightweight Summer Linen Blazer",
  "Double Knit Cotton Hoodie",
  "Slim Fit White Dress Shirt",
  "Relaxed Fit Cargo Utility Pants",
  "Fine Merino Wool Turtleneck",
  "Diamond Quilted Bomber Jacket",
  "Genuine Leather Moto Jacket",
  "Premium Suede Harrington Jacket",
  "Classic Double Breasted Peacoat",
  "Waterproof Gabardine Trench Coat",
  "Casual Fine Knit Polo",
  "Textured Ribbed Henley Shirt",
  "Athletic Fit French Terry Joggers",
  "Pleated Tailored Wool Trousers",
  "Midweight Corduroy Overshirt",
  "Brushed Flannel Plaid Shirt",
  "Classic V-Neck Wool Cardigan",
  "Cozy Waffle Knit Long Sleeve",
  "Breathable Linen Blend Shorts",
  "Quick-Dry Board Swim Trunks",
  "Abstract Graphic Print T-Shirt",
  "Nautical Striped Breton Shirt",
  "Elegant Mock Neck Sweater",
  "Sherpa Lined Classic Denim Jacket",
  "Insulated Down Puffer Vest",
  "Packable Windbreaker Pullover",
  "Rugged Twill Field Jacket",
  "Winter Chunky Knit Sweater",
  "Luxurious Silk Blend Blouse",
  "Graceful Satin Slip Dress",
  "Flowy Wrap Midi Skirt",
  "High-Waist Wide Leg Palazzo Pants",
  "Chic Cropped Wool Cardigan",
  "Ultra-Soft Cashmere Scarf",
  "Full Grain Leather Belt",
  "Durable Canvas Weekend Tote Bag",
  "Sleek Minimalist Leather Sneakers"
];

const categories = ["shirts", "pants", "knitwear", "jackets", "accessories"];
const sizes = ["S", "M", "L", "XL"];
const colorsList = ["black", "white", "navy", "grey", "beige"];

const publicUploadsPath = path.join(__dirname, '..', 'public', 'uploads');
const dataJsonPath = path.join(__dirname, '..', 'data', 'products.json');

// 1. Rename images and create product objects
const newProducts = [];
for (let i = 0; i < images.length; i++) {
  const originalFileName = images[i];
  const originalFilePath = path.join(publicUploadsPath, originalFileName);
  
  if (fs.existsSync(originalFilePath)) {
    const productName = generatedNames[i];
    const newFileName = productName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.jpg';
    const newFilePath = path.join(publicUploadsPath, newFileName);
    
    // Rename
    fs.renameSync(originalFilePath, newFilePath);
    
    // Generate Product Object
    // Prices are higher than 800 EGP (Random between 950 and 3950)
    const productPrice = Math.floor(Math.random() * (3950 - 950 + 1) + 950);
    
    const product = {
      _id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: productName,
      category: categories[i % categories.length],
      price: productPrice,
      description: `A premium ${productName.toLowerCase()} crafted for comfort and style.`,
      images: [newFileName],
      size: sizes,
      colors: [colorsList[i % colorsList.length]]
    };
    newProducts.push(product);
  } else {
    console.log(`File not found: ${originalFileName}`);
  }
}

// 2. Read existing products and append new ones
let existingProducts = [];
if (fs.existsSync(dataJsonPath)) {
  const rawData = fs.readFileSync(dataJsonPath, 'utf-8');
  existingProducts = JSON.parse(rawData);
}

const mergedProducts = [...existingProducts, ...newProducts];

fs.writeFileSync(dataJsonPath, JSON.stringify(mergedProducts, null, 2), 'utf-8');

console.log(`Successfully renamed ${newProducts.length} images and added them to products.json`);
