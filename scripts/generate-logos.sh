#!/bin/bash

# CherryBot Logo Generation Script
# Converts logo.jpg to various formats and sizes with transparent background

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLIC_DIR="$SCRIPT_DIR/../public"
INPUT_LOGO="$PUBLIC_DIR/logo.jpg"

echo "🍒 CherryBot Logo Generator"
echo "============================"

# Create output directory if it doesn't exist
mkdir -p "$PUBLIC_DIR"

# Check if input file exists
if [ ! -f "$INPUT_LOGO" ]; then
    echo "❌ Error: logo.jpg not found at $INPUT_LOGO"
    echo "   Please place your logo.jpg in $PUBLIC_DIR"
    exit 1
fi

echo "📁 Input: $INPUT_LOGO"
echo "📁 Output: $PUBLIC_DIR"
echo ""

# Step 1: Convert JPG to PNG with transparent background
echo "🔄 Step 1: Removing background and converting to PNG..."
magick "$INPUT_LOGO" \
    -fuzz 15% \
    -transparent white \
    -transparent "#f5f5f0" \
    -transparent "#e8e8e0" \
    "$PUBLIC_DIR/logo.png"

echo "✅ Created: logo.png (transparent background)"

# Step 2: Generate different sizes
echo ""
echo "🔄 Step 2: Generating multiple sizes..."

# 512x512 - Main app icon
magick "$PUBLIC_DIR/logo.png" \
    -resize 512x512 \
    -background none \
    -gravity center \
    -extent 512x512 \
    "$PUBLIC_DIR/logo-512.png"
echo "✅ Created: logo-512.png (512x512)"

# 192x192 - PWA icon
magick "$PUBLIC_DIR/logo.png" \
    -resize 192x192 \
    -background none \
    -gravity center \
    -extent 192x192 \
    "$PUBLIC_DIR/logo-192.png"
echo "✅ Created: logo-192.png (192x192)"

# 180x180 - Apple touch icon
magick "$PUBLIC_DIR/logo.png" \
    -resize 180x180 \
    -background none \
    -gravity center \
    -extent 180x180 \
    "$PUBLIC_DIR/apple-touch-icon.png"
echo "✅ Created: apple-touch-icon.png (180x180)"

# 32x32 - Standard favicon
magick "$PUBLIC_DIR/logo.png" \
    -resize 32x32 \
    -background none \
    -gravity center \
    -extent 32x32 \
    "$PUBLIC_DIR/favicon-32x32.png"
echo "✅ Created: favicon-32x32.png (32x32)"

# 16x16 - Small favicon
magick "$PUBLIC_DIR/logo.png" \
    -resize 16x16 \
    -background none \
    -gravity center \
    -extent 16x16 \
    "$PUBLIC_DIR/favicon-16x16.png"
echo "✅ Created: favicon-16x16.png (16x16)"

# Step 3: Generate ICO file (multi-size)
echo ""
echo "🔄 Step 3: Generating favicon.ico..."
magick "$PUBLIC_DIR/favicon-16x16.png" \
    "$PUBLIC_DIR/favicon-32x32.png" \
    "$PUBLIC_DIR/favicon.ico"
echo "✅ Created: favicon.ico (16x16, 32x32)"

# Step 4: Generate WebP (optimized for web)
echo ""
echo "🔄 Step 4: Generating WebP format..."
magick "$PUBLIC_DIR/logo.png" \
    -resize 512x512 \
    -quality 90 \
    "$PUBLIC_DIR/logo.webp"
echo "✅ Created: logo.webp (optimized)"

# Step 5: Generate SVG-friendly version (optional)
echo ""
echo "🔄 Step 5: Creating high-quality master PNG..."
magick "$PUBLIC_DIR/logo.png" \
    -resize 1024x1024 \
    -background none \
    -gravity center \
    -extent 1024x1024 \
    "$PUBLIC_DIR/logo-1024.png"
echo "✅ Created: logo-1024.png (1024x1024 master)"

echo ""
echo "✨ All done! Generated files in $PUBLIC_DIR/:"
echo "   - logo.png (transparent source)"
echo "   - logo-1024.png (master)"
echo "   - logo-512.png"
echo "   - logo-192.png"
echo "   - apple-touch-icon.png"
echo "   - favicon-32x32.png"
echo "   - favicon-16x16.png"
echo "   - favicon.ico"
echo "   - logo.webp"
echo ""
echo "🎉 CherryBot logos ready to use!"
