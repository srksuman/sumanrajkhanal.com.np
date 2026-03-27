import sys
from PIL import Image

def process_avif():
    in_path = 'src/assets/cursor.avif'
    out_path = 'src/assets/cursor.png'
    
    try:
        # Pillow might need pillow-avif-plugin to read AVIF
        img = Image.open(in_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening AVIF: {e}")
        # If Pillow natively fails, try fallback or just return error
        return
        
    # Check if we need to make it transparent by removing background
    # Let's assume the top-left pixel is the background color
    bg_color = img.getpixel((0, 0))
    
    datas = img.getdata()
    new_data = []
    
    # If the image already has transparency (bg_color[3] == 0), don't mess with it
    if bg_color[3] > 0:
        tolerance = 25
        for item in datas:
            if (abs(item[0] - bg_color[0]) < tolerance and 
                abs(item[1] - bg_color[1]) < tolerance and 
                abs(item[2] - bg_color[2]) < tolerance):
                new_data.append((255, 255, 255, 0)) # transparent
            else:
                new_data.append(item)
        img.putdata(new_data)
        
    # resize to 32x32 max
    img.thumbnail((32, 32), Image.Resampling.LANCZOS)
    img.save(out_path, 'PNG')
    print("Success: Generated cursor.png")

if __name__ == "__main__":
    process_avif()
