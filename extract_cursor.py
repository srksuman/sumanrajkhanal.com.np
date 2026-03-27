import sys
from PIL import Image, ImageChops

def extract_fifth_object():
    img_path = 'src/assets/cursors/2309-w032-n002-1033B-p15-1033.jpg'
    try:
        img = Image.open(img_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening image: {e}")
        return

    # Create a background-colored image to find differences
    bg_color = img.getpixel((0, 0))
    bg = Image.new("RGBA", img.size, bg_color)
    diff = ImageChops.difference(img, bg)
    
    # Convert difference to grayscale
    diff = diff.convert("L")
    
    # Threshold to get mask of objects
    mask = diff.point(lambda p: p > 10 and 255)
    
    # Use bounding boxes. Since Pillow's getbbox() gets the *entire* image's bounding box,
    # we need to find individual objects. A simple way for a grid is to slice it.
    # The image is 10000x2500. Let's assume a grid.
    # If the user asks for the 5th, maybe it's 8 cols x 2 rows (each 1250x1250) or 10 cols x 1 row?
    # Let's slice it into 1250x1250 squares, testing 8x2.
    
    tile_size = 1250
    cols = 10000 // tile_size # 8
    rows = 2500 // tile_size # 2
    
    tiles = []
    for r in range(rows):
        for c in range(cols):
            box = (c * tile_size, r * tile_size, (c + 1) * tile_size, (r + 1) * tile_size)
            tile = img.crop(box)
            # Find bounding box of actual content within the tile
            tile_diff = diff.crop(box)
            bbox = tile_diff.getbbox()
            if bbox:
                tiles.append(tile)

    if len(tiles) < 5:
        print(f"Only found {len(tiles)} objects. Cannot extract 5th.")
        return

    # 5th image (index 4)
    target_img = tiles[4]
    
    # Remove background color, make transparent
    datas = target_img.getdata()
    new_data = []
    # Using a tolerance for the background color
    tolerance = 20
    for item in datas:
        # item is (R, G, B, A)
        if (abs(item[0] - bg_color[0]) < tolerance and 
            abs(item[1] - bg_color[1]) < tolerance and 
            abs(item[2] - bg_color[2]) < tolerance):
            new_data.append((255, 255, 255, 0)) # Transparent
        else:
            new_data.append(item)
            
    target_img.putdata(new_data)
    
    # Crop to exact bounding box
    final_diff = ImageChops.difference(target_img.convert("RGBA"), Image.new("RGBA", target_img.size, (255,255,255,0)))
    final_bbox = final_diff.convert("L").getbbox()
    if final_bbox:
        target_img = target_img.crop(final_bbox)
    
    # Resize to standard cursor size (32x32 max)
    target_img.thumbnail((32, 32), Image.Resampling.LANCZOS)
    
    target_img.save('src/assets/custom-cursor.png', 'PNG')
    print("Success: Generated custom-cursor.png")

if __name__ == "__main__":
    extract_fifth_object()
