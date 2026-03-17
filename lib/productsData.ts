const productsData = [
  
  // Jackets & Coats
  { _id: "p-jc-001", name: "Black Minimal Leather Jacket", category: "jackets-coats", price: 1199, images: ["/uploads/lether.jpg", "/uploads/simple_leather.jpg"], size: ["S", "M", "L", "XL"], description: "Black Minimal Leather Jacket", colors: [ "black"] },
  { _id: "p-jc-002", name: "Vintage Knit Cardigan", category: "jackets-coats", price: 1249, images: ["/uploads/korean_bijam_peig2.jpg","/uploads/pijam_korean_jacket_black2.jpg","/uploads/korean_bijam_peig.jpg","/uploads/pijam_korean_jacket_black.jpg"], size: ["M", "L", "XL"], description: "Vintage Knit Cardigan", colors: ["black", "cream"] },
   { _id: "p-jc-003", name: "Wool-Blend Trench Coat", category: "jackets-coats", price: 749, images: ["/uploads/whitejacket.jpg","/uploads/peig_leather_jacket.jpg"], size: ["M", "L", "XL"], description: "A modern trench with a tailored shoulder.", colors: ["cream"] },
    { _id: "p-jc-004", name: "Studded Biker Jacket", category: "jackets-coats", price: 749, images: ["/uploads/harly.jpg","/uploads/mozz2.jpg"], size: ["M", "L", "XL"], description: "Studded Biker Jacket", colors: ["black"] },
     { _id: "p-jc-005", name: "Oversized Winter Puffer", category: "jackets-coats", price: 749, images: ["/uploads/mozzz.jpg","/uploads/mozz.jpg"], size: ["M", "L", "XL"], description: "Oversized Winter Puffer", colors: ["navy"] },
{ _id: "p-jc-006", name: "Vintage Purple Work", category: "jackets-coats", price: 749, images: ["/uploads/purblejacket.jpg","/uploads/light_violet_jacket.jpg"], size: ["M", "L", "XL"], description: "Vintage Purple Work jacket", colors: ["violet"] },
{ _id: "p-jc-007", name: "Navy Embroidered Bomber", category: "jackets-coats", price: 749, images: ["/uploads/italian_jacket3.jpg","/uploads/italian_jacket.jpg","/uploads/italian_jacket2.jpg"], size: ["M", "L", "XL"], description: "Navy Embroidered Bomber", colors: ["camel", "navy"] },
{ _id: "p-jc-008", name: "Slim Black Biker Jacket", category: "jackets-coats", price: 749, images: ["/uploads/leathercrazy.jpg","/uploads/harly2.jpg"], size: ["M", "L", "XL"], description: "Slim Black Biker Jacket", colors: ["black"] },
{ _id: "p-jc-009", name: "Sage Minimal Street Set", category: "jackets-coats", price: 749, images: ["/uploads/formal_lines2.jpg","/uploads/formal_lines.jpg"], size: ["M", "L", "XL"], description: "Sage Minimal Street Set", colors: ["black"] },
{ _id: "p-jc-010", name: "Camel Leather jacket", category: "jackets-coats", price: 749, images: ["/uploads/brown_leather2.jpg","/uploads/brown_leather.jpg"], size: ["M", "L", "XL"], description: "Camel Leather jacket", colors: ["camel"] },
{ _id: "p-jc-011", name: "Urban Brown Leather Jacket", category: "jackets-coats", price: 749, images: ["/uploads/brownleather2.jpg","/uploads/brown_wind_jacket.jpg"], size: ["M", "L", "XL"], description: "Urban Brown Leather Jacket", colors: ["brown"] },
{ _id: "p-jc-012", name: "Dark Urban Bomber Jacket", category: "jackets-coats", price: 749, images: ["/uploads/black.jpg","/uploads/black_wind_jacket.jpg"], size: ["M", "L", "XL"], description: "Dark Urban Bomber Jacket", colors: ["black"] },
{ _id: "p-jc-013", name: "Minimal Black Winter Jacket", category: "jackets-coats", price: 749, images: ["/uploads/noir.jpg","/uploads/black_soft_jacket.jpg"], size: ["M", "L", "XL"], description: "Minimal Black Winter Jacket", colors: ["black"] },
{ _id: "p-jc-014", name: "gray Urban Bomber Jacket", category: "jackets-coats", price: 749, images: ["/uploads/greyjacket.jpg","/uploads/greyjacket2.jpg"], size: ["M", "L", "XL"], description: "gray Urban Bomber Jacket", colors: ["gray"] },
{ _id: "p-jc-015", name: "Sage Minimal pockets jacket", category: "jackets-coats", price: 749, images: ["/uploads/formallinespockets.jpg","/uploads/pocket.jpg"], size: ["M", "L", "XL"], description: "Sage Minimal pockets Street Set", colors: ["black"] },
// Suits
  { _id: "p-su-001", name: "Minimal Cream Street Set", category: "suits", price: 2149, images: ["/uploads/whitesuit.jpg","/uploads/peig_suit2.jpg"], size: ["38", "40", "42", "44"], description: "Minimal Cream Street Set", colors: ["cream"] },
  { _id: "p-su-003", name: "Mocha Casual Street Set", category: "suits", price: 2149, images: ["/uploads/brownsuit.jpg","/uploads/brown_suit.jpg"], size: ["38", "40", "42"], description: "Mocha Casual Street Set", colors: ["mocha"] },

  // Shirts
  { _id: "p-sh-001", name: "Olive Minimal green Knit", category: "shirts", price: 109, images: ["/uploads/gre.jpg","/uploads/green_zipper.jpg"], size: ["S", "M", "L", "XL"], description: "Olive Minimal green Knit", colors: ["green"] },
    { _id: "p-sh-002", name: "beige polo classic", category: "shirts", price: 95, images: ["/uploads/peigshirt.jpg","/uploads/peig.jpg"], size: ["S", "M", "L", "XL"], description: "beige polo classic", colors: ["beige"] },

  // Knitwear
 //  { _id: "p-kn-001", name: "Merino Crewneck Sweater", category: "knitwear", price: 179, images: ["/uploads/Knitwear.jpg"], size: ["S", "M", "L", "XL"], description: "Fine merino knit with clean finishing.", colors: ["black", "gray"] },
 //  { _id: "p-kn-002", name: "Ribbed Turtleneck", category: "knitwear", price: 199, images: ["/uploads/Knitwear.jpg"], size: ["S", "M", "L"], description: "Ribbed texture with a sharp turtleneck line.", colors: ["ivory", "navy"] },
  // { _id: "p-kn-003", name: "Cashmere Cardigan", category: "knitwear", price: 349, images: ["/uploads/Knitwear.jpg"], size: ["M", "L", "XL"], description: "Light cashmere cardigan with discreet buttons.", colors: ["camel", "black"] },

  // Bags & Wallets
  // { _id: "p-bw-001", name: "Pebbled Leather Tote", category: "bags-wallets", price: 399, images: ["/uploads/Bags & Wallets.jpg"], size: [], description: "Structured tote with pebbled leather texture.", colors: ["black"] },
  // { _id: "p-bw-002", name: "Compact Card Holder", category: "bags-wallets", price: 69, images: ["/uploads/Bags & Wallets.jpg"], size: [], description: "Slim profile with four card slots.", colors: ["black", "brown"] },
  // { _id: "p-bw-003", name: "Zip-Around Wallet", category: "bags-wallets", price: 129, images: ["/uploads/Bags & Wallets.jpg"], size: [], description: "Secure zip-around wallet with interior organization.", colors: ["navy", "black"] },
  // { _id: "p-bw-004", name: "Mini Crossbody Bag", category: "bags-wallets", price: 219, images: ["/uploads/Bags & Wallets.jpg"], size: [], description: "Minimal crossbody for essentials only.", colors: ["black", "tan"] },

  // Belts
  // { _id: "p-be-001", name: "Reversible Leather Belt", category: "belts", price: 119, images: ["/uploads/Belts.jpg"], size: ["S", "M", "L"], description: "Two-tone reversible belt with polished buckle.", colors: ["black", "brown"] },
  // { _id: "p-be-002", name: "Textured Buckle Belt", category: "belts", price: 109, images: ["/uploads/Belts.jpg"], size: ["M", "L"], description: "Subtle grain texture and brushed buckle.", colors: ["black"] },
  // { _id: "p-be-003", name: "Braided Suede Belt", category: "belts", price: 89, images: ["/uploads/Belts.jpg"], size: ["S", "M", "L"], description: "Braided suede for relaxed tailoring.", colors: ["tan"] },

// sunglasses
  // { _id: "p-sg-001", name: "Square Acetate Sunglasses", category: "sunglasses", price: 169, images: ["/uploads/sunglasses.jpg"], size: [], description: "Bold square frame with dark lenses.", colors: ["black"] },
  // { _id: "p-sg-002", name: "Thin Metal Round Sunglasses", category: "sunglasses", price: 149, images: ["/uploads/sunglasses.jpg"], size: [], description: "Lightweight round frame with refined bridge.", colors: ["gold"] },
  // { _id: "p-sg-003", name: "Gradient Lens Wayfarer", category: "sunglasses", price: 179, images: ["/uploads/sunglasses.jpg"], size: [], description: "Wayfarer frame with subtle gradient lenses.", colors: ["tortoise"] },

  // Lace-Ups
  // { _id: "p-lu-001", name: "Cap-Toe Derby", category: "lace-ups", price: 219, images: ["/uploads/Lace-Ups.jpg"], size: ["7", "8", "9", "10", "11"], description: "Cap-toe derby with a clean, formal stance.", colors: ["black"] },
  // { _id: "p-lu-002", name: "Wholecut Oxford", category: "lace-ups", price: 279, images: ["/uploads/Lace-Ups.jpg"], size: ["7", "8", "9", "10"], description: "Single-piece leather upper with minimal seams.", colors: ["black", "brown"] },
  // { _id: "p-lu-003", name: "Suede Chukka Lace-Up", category: "lace-ups", price: 199, images: ["/uploads/Lace-Ups.jpg"], size: ["8", "9", "10", "11"], description: "Soft suede with a refined casual silhouette.", colors: ["sand", "navy"] },

  // Loafers
 //  { _id: "p-lo-001", name: "Penny Loafers", category: "loafers", price: 189, images: ["/uploads/Loafers.jpg"], size: ["7", "8", "9", "10", "11"], description: "Classic penny loafer with a sleek apron toe.", colors: ["black", "brown"] },
 //  { _id: "p-lo-002", name: "Suede Tassel Loafers", category: "loafers", price: 209, images: ["/uploads/Loafers.jpg"], size: ["8", "9", "10"], description: "Tassel loafer in soft suede for evenings.", colors: ["navy", "tan"] },
  // { _id: "p-lo-003", name: "Bit Loafers", category: "loafers", price: 229, images: ["/uploads/Loafers.jpg"], size: ["7", "8", "9", "10"], description: "Metal bit detail with a formal finish.", colors: ["black"] },

  // Sneakers
  // { _id: "p-sn-001", name: "Minimal Leather Sneakers", category: "sneakers", price: 149, images: ["/uploads/Sneakers.jpg"], size: ["7", "8", "9", "10", "11"], description: "Minimal leather sneaker with tonal outsole.", colors: ["white", "black"] },
  // { _id: "p-sn-002", name: "Retro Runner Sneakers", category: "sneakers", price: 139, images: ["/uploads/Sneakers.jpg"], size: ["8", "9", "10", "11"], description: "Retro runner shape with modern comfort.", colors: ["gray", "navy"] },
  // { _id: "p-sn-003", name: "High-Top Canvas Sneakers", category: "sneakers", price: 119, images: ["/uploads/Sneakers.jpg"], size: ["7", "8", "9", "10"], description: "High-top canvas build with sturdy sole.", colors: ["black", "cream"] },

  // Denim Pants
  // { _id: "p-denim-001", name: "Classic Blue Denim", category: "denim", price: 149, images: ["/uploads/denim.jpg"], size: ["S", "M", "L", "XL"], description: "Timeless denim pants with classic fit.", colors: ["blue"] },
  // { _id: "p-denim-002", name: "Dark Indigo Denim", category: "denim",  price: 159, images: ["/uploads/denim.jpg"], size: ["S", "M", "L", "XL"], description: "Slim fit dark indigo denim pants.", colors: ["indigo"] },
  // { _id: "p-denim-003", name: "Distressed Denim", category: "denim",  price: 169, images: ["/uploads/denim.jpg"], size: ["S", "M", "L"], description: "Modern distressed denim with relaxed feel.", colors: ["blue"] },

  // Korean Pants
  // { _id: "p-korean-001", name: "Korean Slim Fit", category: "korean", price: 159, images: ["/uploads/korean.jpg"], size: ["S", "M", "L"], description: "Stylish Korean-inspired slim pants.", colors: ["navy", "beige"] },
// { _id: "p-korean-002", name: "Korean Cropped Pants", category: "korean", price: 149, images: ["/uploads/korean.jpg"], size: ["S", "M", "L"], description: "Cropped Korean pants with modern cut.", colors: ["black", "gray"] },
 //  { _id: "p-korean-003", name: "Korean Wide Leg Pants", category: "korean", price: 169, images: ["/uploads/korean.jpg"], size: ["M", "L", "XL"], description: "Wide leg pants with Korean streetwear style.", colors: ["olive", "navy"] },

  // Baggy Pants
  // { _id: "p-baggy-001", name: "Classic Baggy Pants", category: "jeans", price: 129, images: ["/uploads/baggy.jpg"], size: ["S", "M", "L", "XL"], description: "Relaxed fit baggy pants for casual style.", colors: ["black", "gray"] },
  // { _id: "p-baggy-002", name: "Baggy Cargo Pants", category: "jeans",  price: 139, images: ["/uploads/baggy.jpg"], size: ["M", "L", "XL"], description: "Cargo-style baggy pants with pockets.", colors: ["khaki", "olive"] },
  // { _id: "p-baggy-003", name: "Baggy Jogger Pants", category: "jeans", price: 119, images: ["/uploads/baggy.jpg"], size: ["S", "M", "L"], description: "Baggy joggers with elastic waist and ankle cuffs.", colors: ["gray", "black"] },
];

export default productsData;