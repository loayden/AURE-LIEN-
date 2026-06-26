const fs = require('fs');
const path = require('path');

const corrections = [
  { old: "Aurelien Signature Cotton T-Shirt", new: "Black and White Striped Polo", color: "Black/White", category: "shirts" },
  { old: "Classic Ivory Linen Trousers", new: "Dark Blue Denim Jeans", color: "Dark Blue", category: "pants" },
  { old: "Premium Italian Cashmere Sweater", new: "Sumwon Pink Striped Shirt", color: "Pink/White", category: "shirts" },
  { old: "Tailored Slim Fit Chino Pants", new: "Mint Green Quarter-Zip Shirt", color: "Mint Green", category: "shirts" },
  { old: "Modern Essential Oxford Shirt", new: "Black 1987 Collar Polo", color: "Black/White", category: "shirts" },
  { old: "Vintage Wash Denim Jeans", new: "Dark Future Forest Green Tee", color: "Forest Green", category: "shirts" },
  { old: "Heavyweight Crewneck Pullover", new: "Prohibited Off-White Tee", color: "Off-White", category: "shirts" },
  { old: "Lightweight Summer Linen Blazer", new: "Pink Sleeveless Logo Tee", color: "Light Pink", category: "shirts" },
  { old: "Double Knit Cotton Hoodie", new: "Blue Patchwork Wide Leg Jeans", color: "Blue", category: "pants" },
  { old: "Slim Fit White Dress Shirt", new: "Distressed Jeans With Rope Belt", color: "Blue", category: "pants" },
  { old: "Relaxed Fit Cargo Utility Pants", new: "Brown Washed Denim Jeans", color: "Brown", category: "pants" },
  { old: "Fine Merino Wool Turtleneck", new: "Cream Balenciaga Quarter-Zip", color: "Cream/Black", category: "shirts" },
  { old: "Diamond Quilted Bomber Jacket", new: "Brown Ribbed Quarter-Zip Polo", color: "Brown", category: "shirts" },
  { old: "Genuine Leather Moto Jacket", new: "Blue Tie-Dye Oversized 9 Tee", color: "Blue/White", category: "shirts" },
  { old: "Premium Suede Harrington Jacket", new: "Green Tie-Dye Oversized 9 Tee", color: "Green/White", category: "shirts" },
  { old: "Classic Double Breasted Peacoat", new: "Sage Green Textured Quarter-Zip", color: "Sage Green", category: "shirts" },
  { old: "Waterproof Gabardine Trench Coat", new: "Cream Balezquia Distressed Tee", color: "Cream/Maroon", category: "shirts" },
  { old: "Casual Fine Knit Polo", new: "Olive and Beige Striped Tee", color: "Olive Green/Beige", category: "shirts" },
  { old: "Textured Ribbed Henley Shirt", new: "Orange and Brown Striped Tee", color: "Orange/Brown", category: "shirts" },
  { old: "Athletic Fit French Terry Joggers", new: "Blue Dolce Gabbana Jeans", color: "Blue", category: "pants" },
  { old: "Pleated Tailored Wool Trousers", new: "Black Miu Miu Logo Tee", color: "Black/Red", category: "shirts" },
  { old: "Midweight Corduroy Overshirt", new: "Faded Black Denim Jeans", color: "Faded Black", category: "pants" },
  { old: "Brushed Flannel Plaid Shirt", new: "Black Sleeveless Pink Logo Tee", color: "Black/Pink", category: "shirts" },
  { old: "Classic V-Neck Wool Cardigan", new: "Navy Blue Lacoste Polo", color: "Navy Blue", category: "shirts" },
  { old: "Cozy Waffle Knit Long Sleeve", new: "Washed Black Bland Oversized Tee", color: "Washed Black", category: "shirts" },
  { old: "Breathable Linen Blend Shorts", new: "Sumwon Striped Button-Down", color: "Pink/White", category: "shirts" },
  { old: "Quick-Dry Board Swim Trunks", new: "Light Blue Ribbed Quarter-Zip", color: "Light Blue", category: "shirts" },
  { old: "Abstract Graphic Print T-Shirt", new: "Black Prada Quarter-Zip Polo", color: "Black", category: "shirts" },
  { old: "Nautical Striped Breton Shirt", new: "Black Prada Joggers", color: "Black", category: "pants" },
  { old: "Elegant Mock Neck Sweater", new: "White Resilient Conformity Tee", color: "White", category: "shirts" },
  { old: "Sherpa Lined Classic Denim Jacket", new: "Black Painted Graphic Tee", color: "Black", category: "shirts" },
  { old: "Insulated Down Puffer Vest", new: "Black Resilient Conformity Tee", color: "Black", category: "shirts" },
  { old: "Packable Windbreaker Pullover", new: "White Puma Ferrari Sneakers", color: "White/Red", category: "shoes" },
  { old: "Rugged Twill Field Jacket", new: "Black Puma Petronas Sneakers", color: "Black/Teal", category: "shoes" },
  { old: "Winter Chunky Knit Sweater", new: "Off-White Louis Vuitton Tee", color: "Off-White", category: "shirts" },
  { old: "Luxurious Silk Blend Blouse", new: "Olive Striped Quarter-Zip Polo", color: "Olive Green/White", category: "shirts" },
  { old: "Graceful Satin Slip Dress", new: "Navy Blue Boss Quarter-Zip", color: "Navy Blue", category: "shirts" },
  { old: "Flowy Wrap Midi Skirt", new: "Zara Blue Striped Quarter-Zip", color: "Blue/White/Navy", category: "shirts" },
  { old: "High-Waist Wide Leg Palazzo Pants", new: "Maroon Prada Tracksuit", color: "Maroon", category: "suits" },
  { old: "Chic Cropped Wool Cardigan", new: "Light Blue Denim Jeans", color: "Light Blue", category: "pants" },
  { old: "Ultra-Soft Cashmere Scarf", new: "White Armani Jeans Logo Tee", color: "White", category: "shirts" },
  { old: "Full Grain Leather Belt", new: "Faded Olive Denim Jeans", color: "Faded Olive", category: "pants" },
  { old: "Durable Canvas Weekend Tote Bag", new: "White Gucci Collar Polo", color: "White/Beige", category: "shirts" },
  { old: "Sleek Minimalist Leather Sneakers", new: "Endless Weekend Striped Shirt", color: "White/Navy", category: "shirts" }
];

const dataJsonPath = path.join(__dirname, '..', 'data', 'products.json');
const publicUploadsPath = path.join(__dirname, '..', 'public', 'uploads');

if (fs.existsSync(dataJsonPath)) {
  const rawData = fs.readFileSync(dataJsonPath, 'utf-8');
  const products = JSON.parse(rawData);

  let updatedCount = 0;

  for (const correction of corrections) {
    const prod = products.find(p => p.name === correction.old);
    if (prod) {
      // 1. Rename image file
      const oldFileName = prod.images[0];
      const newFileName = correction.new.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.jpg';
      const oldFilePath = path.join(publicUploadsPath, oldFileName);
      const newFilePath = path.join(publicUploadsPath, newFileName);
      
      if (fs.existsSync(oldFilePath) && oldFilePath !== newFilePath) {
        fs.renameSync(oldFilePath, newFilePath);
      }

      // 2. Update product object
      prod.name = correction.new;
      prod.colors = [correction.color];
      prod.category = correction.category;
      prod.images = [newFileName];
      prod.description = `A premium ${correction.new.toLowerCase()} crafted for comfort and style.`;
      
      // Ensure price > 800 EGP. The previous script generated 950-3950 so it's already true, but let's double check.
      if (prod.price < 800) {
         prod.price = Math.floor(Math.random() * (3950 - 950 + 1) + 950);
      }

      updatedCount++;
    } else {
      console.log(`Could not find product with name: ${correction.old}`);
    }
  }

  // 3. Save products.json
  fs.writeFileSync(dataJsonPath, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`Successfully updated ${updatedCount} products and renamed their images.`);
} else {
  console.error("data/products.json not found!");
}
