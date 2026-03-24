type ProductReference = {
  _id: string;
  name: string;
  category: string;
  colors?: string[];
  size?: string[];
  description?: string;
};

export type ProductPageSpecification = {
  label: string;
  value: string;
};

export type ProductPageHighlight = {
  title: string;
  desc: string;
};

export type ProductPageContent = {
  story: string;
  specs: ProductPageSpecification[];
  highlights: ProductPageHighlight[];
};

const PRODUCT_PAGE_CONTENT: Record<string, ProductPageContent> = {
  "p-jc-001": {
    story:
      "A sharper interpretation of the black leather jacket, this piece is built for a cleaner wardrobe with stronger edges. It keeps the attitude of a classic biker shape, but the overall impression feels more refined, controlled, and easy to style from day to evening.",
    specs: [
      { label: "Silhouette", value: "Clean biker profile" },
      { label: "Mood", value: "Minimal and urban" },
      { label: "Color Direction", value: "Deep black" },
      { label: "Styling Note", value: "Works with denim or tailored trousers" },
      { label: "Size Range", value: "S to XL" },
      { label: "Best For", value: "Evening layering and daily city wear" },
    ],
    highlights: [
      { title: "Controlled attitude", desc: "A leather look with enough structure to feel bold without becoming heavy." },
      { title: "Easy pairing", desc: "Fits naturally into monochrome wardrobes and sharper casual outfits." },
      { title: "Balanced finish", desc: "The line stays streamlined so the piece feels intentional from every angle." },
      { title: "Year-round role", desc: "Strong as a standalone outer layer and equally useful over light knits." },
    ],
  },
  "p-jc-002": {
    story:
      "This cardigan brings vintage softness into a more directional silhouette. The result is a knit layer that feels relaxed, textured, and visually rich, with enough presence to carry an outfit while still remaining comfortable and approachable.",
    specs: [
      { label: "Silhouette", value: "Relaxed cardigan shape" },
      { label: "Mood", value: "Soft vintage character" },
      { label: "Color Direction", value: "Black and cream mix" },
      { label: "Styling Note", value: "Strong over tees, shirting, or fine knits" },
      { label: "Size Range", value: "M to XL" },
      { label: "Best For", value: "Layered looks with texture" },
    ],
    highlights: [
      { title: "Textural depth", desc: "Adds warmth and visual interest without relying on loud detailing." },
      { title: "Relaxed polish", desc: "Keeps the comfort of knitwear while still feeling styled and considered." },
      { title: "Versatile tone", desc: "Easy to carry with darker bases or lighter tonal combinations." },
      { title: "Everyday presence", desc: "A dependable mid-layer that still looks distinctive in motion." },
    ],
  },
  "p-jc-003": {
    story:
      "A trench-inspired layer with a lighter, more modern attitude. The shape feels tailored but not formal, making it an easy choice for clients who want something polished, bright, and wearable without losing everyday ease.",
    specs: [
      { label: "Silhouette", value: "Modern trench line" },
      { label: "Mood", value: "Refined and light" },
      { label: "Color Direction", value: "Cream tone" },
      { label: "Styling Note", value: "Pairs well with neutrals and darker contrast pieces" },
      { label: "Size Range", value: "M to XL" },
      { label: "Best For", value: "Transitional dressing and elevated daywear" },
    ],
    highlights: [
      { title: "Lighter statement", desc: "Brings the authority of a coat without feeling too formal or too heavy." },
      { title: "Tailored feel", desc: "Keeps the shoulder and line disciplined for a more premium impression." },
      { title: "Clean contrast", desc: "Works especially well against black, charcoal, and muted earth tones." },
      { title: "Flexible wear", desc: "Useful across changing temperatures where a full winter layer is too much." },
    ],
  },
  "p-jc-004": {
    story:
      "This biker jacket leans into a stronger, more expressive point of view. The studded detailing gives it a harder edge, but the overall shape still reads controlled enough to feel styled rather than costume-driven.",
    specs: [
      { label: "Silhouette", value: "Statement biker cut" },
      { label: "Mood", value: "Bold and rebellious" },
      { label: "Color Direction", value: "Black" },
      { label: "Styling Note", value: "Best with clean basics to let the jacket lead" },
      { label: "Size Range", value: "M to XL" },
      { label: "Best For", value: "Night looks and stronger styling" },
    ],
    highlights: [
      { title: "Sharper identity", desc: "Designed for clients who want the jacket to define the look instantly." },
      { title: "Confident detail", desc: "Stud work creates texture and light without overcomplicating the outfit." },
      { title: "Balanced structure", desc: "The silhouette keeps the visual energy focused and wearable." },
      { title: "Editorial energy", desc: "Feels especially strong in monochrome wardrobes with leaner pieces." },
    ],
  },
  "p-jc-005": {
    story:
      "An oversized puffer with a more composed streetwear language. It delivers warmth and volume, but the shape remains clean enough to fit a more considered wardrobe rather than reading purely technical or sporty.",
    specs: [
      { label: "Silhouette", value: "Oversized winter volume" },
      { label: "Mood", value: "Protective and contemporary" },
      { label: "Color Direction", value: "Navy" },
      { label: "Styling Note", value: "Ideal over knitwear, hoodies, or layered basics" },
      { label: "Size Range", value: "M to XL" },
      { label: "Best For", value: "Cold-weather city dressing" },
    ],
    highlights: [
      { title: "Comfort first", desc: "Made for warmth and coverage without abandoning a clean visual line." },
      { title: "Street-ready", desc: "Brings volume and presence that suit a more relaxed urban wardrobe." },
      { title: "Dark versatility", desc: "The navy tone keeps it adaptable with black, stone, or lighter neutrals." },
      { title: "Seasonal anchor", desc: "One of the easiest outer layers to build repeated winter looks around." },
    ],
  },
  "p-jc-006": {
    story:
      "A vintage workwear influence reinterpreted through a distinctive violet tone. The result feels individual and expressive, but still grounded enough for real wardrobe use when paired with muted layers and simple foundations.",
    specs: [
      { label: "Silhouette", value: "Workwear-inspired jacket" },
      { label: "Mood", value: "Vintage and offbeat" },
      { label: "Color Direction", value: "Soft violet" },
      { label: "Styling Note", value: "Works best with black, cream, or faded denim" },
      { label: "Size Range", value: "M to XL" },
      { label: "Best For", value: "Expressive everyday styling" },
    ],
    highlights: [
      { title: "Distinct tone", desc: "The color shifts the entire look away from expected neutrals." },
      { title: "Casual character", desc: "Keeps a grounded workwear feeling so the piece remains wearable." },
      { title: "Strong contrast", desc: "Especially effective when layered with darker and cleaner inner pieces." },
      { title: "Individual feel", desc: "A useful piece for clients who want difference without excess." },
    ],
  },
  "p-jc-007": {
    story:
      "A bomber with decorative character and a more styled attitude. The embroidered finish adds visual richness, while the underlying silhouette keeps it practical enough to wear as part of a regular rotation.",
    specs: [
      { label: "Silhouette", value: "Classic bomber base" },
      { label: "Mood", value: "Decorative and refined" },
      { label: "Color Direction", value: "Navy and camel accents" },
      { label: "Styling Note", value: "Looks strongest with simple trousers and clean layers" },
      { label: "Size Range", value: "M to XL" },
      { label: "Best For", value: "Weekend dressing with personality" },
    ],
    highlights: [
      { title: "Richer surface", desc: "Embroidery gives the jacket depth without making it feel overloaded." },
      { title: "Bomber ease", desc: "Retains the easy wearability of a familiar silhouette." },
      { title: "Balanced statement", desc: "Enough character to stand out, still simple enough to repeat often." },
      { title: "Warm palette", desc: "The tones add softness and a more premium visual warmth." },
    ],
  },
  "p-jc-008": {
    story:
      "A leaner biker profile designed for a sharper silhouette. This piece reads cleaner and more fitted than oversized outerwear, making it useful for clients who want definition, darker styling, and a more streamlined presence.",
    specs: [
      { label: "Silhouette", value: "Slim biker shape" },
      { label: "Mood", value: "Sharp and focused" },
      { label: "Color Direction", value: "Black" },
      { label: "Styling Note", value: "Ideal with straight denim or slim trousers" },
      { label: "Size Range", value: "M to XL" },
      { label: "Best For", value: "Clean evening and city looks" },
    ],
    highlights: [
      { title: "Defined line", desc: "The silhouette holds closer to the body for a more precise look." },
      { title: "Low-noise styling", desc: "Best when the rest of the outfit stays disciplined and quiet." },
      { title: "Dark wardrobe fit", desc: "Integrates easily into black and charcoal-heavy dressing." },
      { title: "Reliable edge", desc: "Adds attitude without relying on heavy embellishment." },
    ],
  },
  "p-jc-009": {
    story:
      "A coordinated street set with a calmer, more tailored attitude than standard casual matching pieces. It feels modern, pared back, and easy to wear for clients who want casual structure rather than obvious sportswear energy.",
    specs: [
      { label: "Silhouette", value: "Coordinated relaxed set" },
      { label: "Mood", value: "Clean street tailoring" },
      { label: "Color Direction", value: "Dark minimal palette" },
      { label: "Styling Note", value: "Strong as a full look or broken into separates" },
      { label: "Size Range", value: "M to XL" },
      { label: "Best For", value: "Modern daywear with structure" },
    ],
    highlights: [
      { title: "Easy coordination", desc: "Offers the speed of a set while still feeling visually composed." },
      { title: "Minimal language", desc: "Built around cleaner lines instead of loud sporty cues." },
      { title: "Flexible styling", desc: "Each piece can work separately without losing relevance." },
      { title: "Urban polish", desc: "A strong choice for clients who want ease with discipline." },
    ],
  },
  "p-jc-010": {
    story:
      "This camel leather jacket adds warmth and maturity to the leather category. The color gives it a softer, more elevated tone than black, making it especially strong for neutral wardrobes and layered transitional dressing.",
    specs: [
      { label: "Silhouette", value: "Clean leather jacket line" },
      { label: "Mood", value: "Warm and refined" },
      { label: "Color Direction", value: "Camel" },
      { label: "Styling Note", value: "Pairs naturally with cream, black, olive, and stone" },
      { label: "Size Range", value: "M to XL" },
      { label: "Best For", value: "Transitional dressing with richer tone" },
    ],
    highlights: [
      { title: "Softer leather mood", desc: "The camel tone feels more nuanced than a standard black jacket." },
      { title: "Elevated neutral", desc: "Easy to style with other quiet colors and textured layers." },
      { title: "Seasonal flexibility", desc: "Useful in both cooler evenings and lighter cold-weather dressing." },
      { title: "Visual warmth", desc: "Adds depth and softness to otherwise darker outfits." },
    ],
  },
  "p-jc-011": {
    story:
      "A brown leather outer layer with a more grounded urban attitude. It feels solid, dependable, and mature, offering a darker earthy alternative for clients who want richness without moving into brighter tones.",
    specs: [
      { label: "Silhouette", value: "Urban leather profile" },
      { label: "Mood", value: "Grounded and confident" },
      { label: "Color Direction", value: "Brown" },
      { label: "Styling Note", value: "Works well with black, cream, denim, and muted green" },
      { label: "Size Range", value: "M to XL" },
      { label: "Best For", value: "Daily wear with a richer tone base" },
    ],
    highlights: [
      { title: "Earthier depth", desc: "Brown keeps the look mature and more textured than flat black." },
      { title: "Easy integration", desc: "Pairs naturally with denim and neutral knitwear." },
      { title: "City-ready line", desc: "Strong enough for everyday use without feeling overly rugged." },
      { title: "Reliable versatility", desc: "One of the easiest pieces to rotate across multiple outfits." },
    ],
  },
  "p-jc-012": {
    story:
      "A dark bomber with a cleaner urban expression. This piece is about ease, protection, and quiet structure, making it ideal for clients who prefer understated outerwear that still feels current and composed.",
    specs: [
      { label: "Silhouette", value: "Modern bomber shape" },
      { label: "Mood", value: "Quiet and functional" },
      { label: "Color Direction", value: "Black" },
      { label: "Styling Note", value: "Suitable for daily wear with denim, cargo, or knit layers" },
      { label: "Size Range", value: "M to XL" },
      { label: "Best For", value: "Daily city movement" },
    ],
    highlights: [
      { title: "Understated presence", desc: "The jacket stays quiet visually but still sharp in silhouette." },
      { title: "Daily utility", desc: "A useful outer layer for repeated, low-effort styling." },
      { title: "Dark adaptability", desc: "Works with almost any palette built around black and neutrals." },
      { title: "Modern restraint", desc: "Feels contemporary without chasing trend-driven detailing." },
    ],
  },
  "p-jc-013": {
    story:
      "A winter-ready black jacket reduced to its essentials. The shape and color are intentionally simple, giving the piece a calm, practical authority that fits clients who want dependable outerwear with a refined edge.",
    specs: [
      { label: "Silhouette", value: "Winter utility line" },
      { label: "Mood", value: "Minimal and protective" },
      { label: "Color Direction", value: "Black" },
      { label: "Styling Note", value: "Designed to sit easily over everyday cold-weather layers" },
      { label: "Size Range", value: "M to XL" },
      { label: "Best For", value: "Cold mornings and practical daily wear" },
    ],
    highlights: [
      { title: "Functional clarity", desc: "Keeps the look direct and clean without visual clutter." },
      { title: "Layering ease", desc: "Simple enough to wear over knitwear, hoodies, or lighter tailoring." },
      { title: "Winter relevance", desc: "Made for repeat wear during colder parts of the season." },
      { title: "Quiet confidence", desc: "Ideal for clients who want utility without sacrificing style." },
    ],
  },
  "p-jc-014": {
    story:
      "A gray bomber that brings a softer, more neutral tone into the outerwear selection. It feels contemporary and easy to wear, especially for clients who want something versatile and urban without defaulting to black.",
    specs: [
      { label: "Silhouette", value: "Urban bomber profile" },
      { label: "Mood", value: "Neutral and modern" },
      { label: "Color Direction", value: "Gray" },
      { label: "Styling Note", value: "Pairs well with black, white, navy, and denim" },
      { label: "Size Range", value: "M to XL" },
      { label: "Best For", value: "Lightly styled everyday looks" },
    ],
    highlights: [
      { title: "Softer palette", desc: "Gray gives the silhouette a lighter and more open visual tone." },
      { title: "Easy coordination", desc: "A versatile option when black feels too harsh or predictable." },
      { title: "Casual clarity", desc: "The jacket works best in clean, straightforward outfits." },
      { title: "Modern utility", desc: "Combines daily practicality with a more contemporary shade." },
    ],
  },
  "p-jc-015": {
    story:
      "A minimal jacket with pocket detail that adds function without disturbing the clean overall direction. It feels useful, structured, and quietly modern, making it a strong option for understated everyday styling.",
    specs: [
      { label: "Silhouette", value: "Minimal utility jacket" },
      { label: "Mood", value: "Structured and calm" },
      { label: "Color Direction", value: "Dark neutral" },
      { label: "Styling Note", value: "Good with tonal looks, cargos, or relaxed tailoring" },
      { label: "Size Range", value: "M to XL" },
      { label: "Best For", value: "Clean daily layering with function" },
    ],
    highlights: [
      { title: "Practical detailing", desc: "Pocket placement adds purpose while keeping the piece restrained." },
      { title: "Minimal direction", desc: "The overall shape stays disciplined and uncluttered." },
      { title: "Strong repeat value", desc: "Easy to rely on across frequent casual rotation." },
      { title: "Balanced structure", desc: "Useful for clients who want a little utility without heaviness." },
    ],
  },
  "p-su-001": {
    story:
      "A cream set that brings a lighter, more directional mood to tailoring. It reads modern rather than formal, making it especially effective for clients who want a coordinated look that feels polished, bright, and easy to style.",
    specs: [
      { label: "Silhouette", value: "Relaxed tailored set" },
      { label: "Mood", value: "Bright and composed" },
      { label: "Color Direction", value: "Cream" },
      { label: "Styling Note", value: "Strong with tonal knitwear, tees, or crisp shirting" },
      { label: "Size Range", value: "38 to 44" },
      { label: "Best For", value: "Events, evenings, and elevated daywear" },
    ],
    highlights: [
      { title: "Lighter tailoring", desc: "Offers a fresher alternative to darker suiting without losing structure." },
      { title: "Coordinated ease", desc: "Feels put together immediately while remaining easy to wear." },
      { title: "Premium clarity", desc: "The color highlights line, cut, and proportion more visibly." },
      { title: "Flexible tone", desc: "Suitable for both sharper occasions and more relaxed styling." },
    ],
  },
  "p-su-003": {
    story:
      "A mocha set that softens tailoring through warmer tone and a more relaxed attitude. It feels refined without becoming rigid, which makes it an easy bridge between formal dressing and more modern coordinated style.",
    specs: [
      { label: "Silhouette", value: "Relaxed suit set" },
      { label: "Mood", value: "Warm and refined" },
      { label: "Color Direction", value: "Mocha" },
      { label: "Styling Note", value: "Works beautifully with cream, black, and muted brown layers" },
      { label: "Size Range", value: "38 to 42" },
      { label: "Best For", value: "Soft tailoring and occasion wear" },
    ],
    highlights: [
      { title: "Warmer tailoring", desc: "The tone gives the suit a more approachable and contemporary attitude." },
      { title: "Relaxed polish", desc: "Structured enough for presence, soft enough for easy repetition." },
      { title: "Versatile separation", desc: "Both pieces can also work individually in daily wardrobes." },
      { title: "Balanced elegance", desc: "Ideal for clients who want tailoring without stiffness." },
    ],
  },
  "p-sh-001": {
    story:
      "A green knit with a minimal attitude and a softer casual mood. It introduces color without overwhelming the outfit, making it useful for wardrobes that want quiet variation while keeping the overall look refined.",
    specs: [
      { label: "Silhouette", value: "Minimal knit shape" },
      { label: "Mood", value: "Relaxed and fresh" },
      { label: "Color Direction", value: "Olive green" },
      { label: "Styling Note", value: "Pairs well with cream, black, navy, and washed denim" },
      { label: "Size Range", value: "S to XL" },
      { label: "Best For", value: "Layered casual looks with soft color" },
    ],
    highlights: [
      { title: "Quiet color", desc: "Adds character to the outfit without becoming the only focus." },
      { title: "Easy wearability", desc: "Designed for repeat use across simple everyday combinations." },
      { title: "Soft contrast", desc: "The green tone works especially well with neutral foundations." },
      { title: "Low-effort polish", desc: "Brings more depth than a basic tee while staying comfortable." },
    ],
  },
  "p-sh-002": {
    story:
      "A classic beige polo designed around simplicity, softness, and versatility. It is the kind of piece that supports a calm wardrobe, giving you a polished casual base that moves easily between daywear, travel, and evening layering.",
    specs: [
      { label: "Silhouette", value: "Classic polo line" },
      { label: "Mood", value: "Clean and understated" },
      { label: "Color Direction", value: "Beige" },
      { label: "Styling Note", value: "Works with tailored trousers, denim, or relaxed suiting" },
      { label: "Size Range", value: "S to XL" },
      { label: "Best For", value: "Everyday refinement and travel wardrobes" },
    ],
    highlights: [
      { title: "Reliable base", desc: "A foundational piece that keeps the outfit neat without trying too hard." },
      { title: "Neutral ease", desc: "Beige coordinates naturally with almost any restrained palette." },
      { title: "Polished casual", desc: "More composed than a tee, still easy enough for daily rotation." },
      { title: "Wardrobe flexibility", desc: "Transitions smoothly between relaxed and more elevated styling." },
    ],
  },
};

function titleCaseCategory(category: string) {
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatColors(colors: string[] = []) {
  if (!colors.length) return "Varies by selection";
  return colors.map((color) => color.charAt(0).toUpperCase() + color.slice(1)).join(", ");
}

function formatSizeRange(size: string[] = []) {
  if (!size.length) return "Available by style";
  return size.join(" to ").replace(/\s+to\s+/g, " to ");
}

function buildFallbackContent(product: ProductReference): ProductPageContent {
  return {
    story:
      `${product.name} is presented as a more considered interpretation of ${titleCaseCategory(product.category)}. The focus is on clean styling, wearable structure, and a premium visual tone that allows the piece to feel distinct without losing everyday usefulness.`,
    specs: [
      { label: "Category", value: titleCaseCategory(product.category) },
      { label: "Mood", value: "Modern and wearable" },
      { label: "Color Direction", value: formatColors(product.colors) },
      { label: "Styling Note", value: "Designed for clean, versatile outfits" },
      { label: "Size Range", value: formatSizeRange(product.size) },
      { label: "Focus", value: "Balanced presence and repeat wear" },
    ],
    highlights: [
      { title: "Refined direction", desc: "Built to feel elevated without becoming difficult to style." },
      { title: "Easy integration", desc: "Works inside a wardrobe built around clean shapes and quiet color." },
      { title: "Balanced character", desc: "Offers enough distinction to stand out while staying wearable." },
      { title: "Daily relevance", desc: "Designed to return often in real, repeated outfit rotation." },
    ],
  };
}

export function getProductPageContent(product: ProductReference): ProductPageContent {
  return PRODUCT_PAGE_CONTENT[product._id] ?? buildFallbackContent(product);
}
