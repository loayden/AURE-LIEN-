const fs = require('fs');
const path = require('path');

const targetNames = [
  "Sumwon Pink Striped Shirt", "Blue Dolce Gabbana Jeans", "Distressed Jeans With Rope Belt", 
  "Black Resilient Conformity Tee", "Black and White Striped Polo", "Dark Blue Denim Jeans", 
  "Brown Washed Denim Jeans", "Olive and Beige Striped Tee", "Zara Blue Striped Quarter-Zip", 
  "Faded Olive Denim Jeans", "Black 1987 Collar Polo", "Faded Black Denim Jeans", 
  "Endless Weekend Striped Shirt", "White Gucci Collar Polo", "Faded Olive Denim Jeans", 
  "White Armani Jeans Logo Tee", "Light Blue Denim Jeans", "Navy Blue Boss Quarter-Zip", 
  "Olive Striped Quarter-Zip Polo", "Off-White Louis Vuitton Tee", "Black Puma Petronas Sneakers", 
  "White Puma Ferrari Sneakers", "Black Resilient Conformity Tee", "Black Painted Graphic Tee", 
  "White Resilient Conformity Tee", "Light Blue Ribbed Quarter-Zip", "Washed Black Bland Oversized Tee", 
  "Navy Blue Lacoste Polo", "Black Sleeveless Pink Logo Tee", "Black Miu Miu Logo Tee", 
  "Orange and Brown Striped Tee", "Olive and Beige Striped Tee", "Cream Balezquia Distressed Tee", 
  "Sage Green Textured Quarter-Zip", "Green Tie-Dye Oversized 9 Tee", "Blue Tie-Dye Oversized 9 Tee", 
  "Brown Ribbed Quarter-Zip Polo", "Cream Balenciaga Quarter-Zip", "Blue Patchwork Wide Leg Jeans", 
  "Prohibited Off-White Tee", "Dark Future Forest Green Tee", "Black 1987 Collar Polo", 
  "Mint Green Quarter-Zip Shirt"
].map(name => name.toLowerCase().trim());

const dataPath = path.join(__dirname, '..', 'data', 'products.json');
let products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
let updatedCount = 0;

products = products.map(product => {
  if (product.name && targetNames.includes(product.name.toLowerCase().trim())) {
    product.price = 999;
    updatedCount++;
  }
  return product;
});

fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
console.log(`Successfully updated the price to 999 EGP for ${updatedCount} products.`);
