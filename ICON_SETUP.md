# Icon Setup Instructions

## Quick Steps:

1. **Save your icon image** (the mountain/sun logo) in three sizes:
   - `icon.png` - Original size (for favicon)
   - `icon-192.png` - 192x192 pixels (for mobile)
   - `icon-512.png` - 512x512 pixels (for high-res displays)

2. **Place all three files** in the root of your project folder

3. **Commit and push**:
   ```bash
   git add icon.png icon-192.png icon-512.png
   git commit -m "Add new outdoor tracker icon"
   git push
   ```

## How to Create Different Sizes:

### Option 1: Online Tool (Easiest)
1. Go to https://www.iloveimg.com/resize-image
2. Upload your icon image
3. Resize to 192x192, download as `icon-192.png`
4. Resize to 512x512, download as `icon-512.png`
5. Keep original as `icon.png`

### Option 2: Using Paint (Windows)
1. Open your image in Paint
2. Click "Resize"
3. Select "Pixels"
4. Enter 192 x 192 (uncheck "Maintain aspect ratio" if needed)
5. Save as `icon-192.png`
6. Repeat for 512x512

### Option 3: Using Preview (Mac)
1. Open image in Preview
2. Tools → Adjust Size
3. Set to 192 x 192 pixels
4. Export as `icon-192.png`
5. Repeat for 512x512

## What I've Already Updated:

✅ `index.html` - Changed favicon references to PNG
✅ `manifest.json` - Updated PWA icons to use PNG files
✅ `auth.js` - Updated fallback profile picture

Once you add the three PNG files and push, your new icon will appear everywhere!
