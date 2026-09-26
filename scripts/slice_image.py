import sys
from PIL import Image
import os

def main():
    image_path = "/Users/shereenmagdy/.gemini/antigravity/brain/0f968dad-7e6e-4100-bc34-a5b5e8996fbb/media__1782676558273.jpg"
    output_dir = "public/uploads"
    
    if not os.path.exists(image_path):
        print(f"Error: Image not found at {image_path}")
        sys.exit(1)
        
    try:
        img = Image.open(image_path)
        width, height = img.size
        print(f"Image dimensions: {width}x{height}")
        
        # The image appears to be 5 separate looks stitched together horizontally.
        # However, looking at the layout, some looks are on the left and some are on the right.
        # Actually, let me check the image dimensions and how it's divided.
        # The user's image is a single jpeg. If it's a grid (e.g. 1 on left, 2 on right), slicing into 5 columns might be wrong.
        # Let me just slice it manually or check its aspect ratio.
        # For now, let's just slice it into 5 equal columns to see what we get.
        
        cols = 5
        col_width = width // cols
        
        for i in range(cols):
            left = i * col_width
            top = 0
            right = (i + 1) * col_width if i < cols - 1 else width
            bottom = height
            
            cropped = img.crop((left, top, right, bottom))
            output_path = os.path.join(output_dir, f"editorial-look-{i+1}.jpg")
            cropped.save(output_path)
            print(f"Saved {output_path}")
            
    except Exception as e:
        print(f"Error processing image: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
