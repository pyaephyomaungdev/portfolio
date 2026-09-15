#!/usr/bin/env python3
"""
Generate circular favicons and touch icons from public/avatar.jpg.
Creates:
  - public/favicon.png (64x64 transparent circular PNG)
  - public/apple-touch-icon.png (180x180 transparent circular PNG)
  - public/favicon.ico (16x16, 32x32, 48x48, 64x64 multi-size ICO)
"""
import os
import sys
from PIL import Image, ImageDraw

def make_circular_icon(src_path: str, dest_path: str, size: int) -> Image.Image:
    if not os.path.exists(src_path):
        print(f"Error: Source image not found at {src_path}", file=sys.stderr)
        sys.exit(1)

    img = Image.open(src_path).convert("RGBA")
    w, h = img.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    cropped = img.crop((left, top, left + min_dim, top + min_dim))

    # Supersample at 4x for smooth anti-aliasing along circle border
    scale = 4
    large_size = size * scale
    large_img = cropped.resize((large_size, large_size), Image.Resampling.LANCZOS)

    mask = Image.new("L", (large_size, large_size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, large_size - 1, large_size - 1), fill=255)

    large_img.putalpha(mask)
    result = large_img.resize((size, size), Image.Resampling.LANCZOS)
    result.save(dest_path, "PNG", optimize=True)
    return result

def main():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    avatar_path = os.path.join(repo_root, "public", "avatar.jpg")
    favicon_png = os.path.join(repo_root, "public", "favicon.png")
    apple_icon_png = os.path.join(repo_root, "public", "apple-touch-icon.png")
    favicon_ico = os.path.join(repo_root, "public", "favicon.ico")

    ico_img = make_circular_icon(avatar_path, favicon_png, 64)
    make_circular_icon(avatar_path, apple_icon_png, 180)
    ico_img.save(favicon_ico, sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print("Circular favicons generated successfully:")
    print(f" - {favicon_png} (64x64)")
    print(f" - {apple_icon_png} (180x180)")
    print(f" - {favicon_ico} (16, 32, 48, 64)")

if __name__ == "__main__":
    main()
