# Photography Portfolio

Modern photography portfolio website built with Next.js, featuring automated photo processing and EXIF metadata extraction.

## 🚀 Quick Start

### Setup on New Computer

```bash
# 1. Check Node.js (requires >= 20.9.0)
make check-node

# 2. Install dependencies
make setup

# 3. Install photo processing tools
sudo apt install libimage-exiftool-perl jq
# or on macOS: brew install exiftool jq

# 4. Verify tools are installed
make check-exiftool
```

### Main Commands

```bash
make help              # Show all available commands
make process-photos    # Process photos from to_proces/ folder
make export            # Export static site to /docs directory
make preview-export    # Preview exported site locally at :8000
make clean-build       # Clean build artifacts
```

## 📸 Adding New Photos

### 1. Drop Photos

Place your JPG files in the `to_proces/` folder:

```bash
cp /path/to/your/photos/*.jpg to_proces/
```

### 2. Process Photos

Run the processing script:

```bash
make process-photos
```

You'll be prompted for:
- **Location**: Applies to all photos in batch (e.g., "Tokyo, Japan")
- **Collection**: Choose existing or create new
  - If new: provide title, description (first photo becomes cover image)

### 3. What Happens

The script automatically:
- ✅ Extracts all EXIF metadata (camera, lens, settings, date)
- ✅ Generates random IDs for each photo
- ✅ Detects orientation and assigns grid spans (80% standard 1x1, 20% featured)
- ✅ Adds entries to `public/photos.json`
- ✅ Creates new collection in `public/collections.json` (if needed)
- ✅ Copies photos to `public/` folder
- ✅ Archives originals in `to_proces/processed/`

### Example Output

```bash
Processing: DSC_0415.JPG
✓ Added DSC_0415.JPG to photos.json
  Camera: NIKON Z f
  Lens: NIKKOR Z 40mm f/2
  Settings: f/5.0, 1/640s, ISO 100
  Orientation: landscape (6000x4000) → 1x1 (standard)
```

## 📋 What Gets Extracted

From each photo's EXIF data:
- Camera model, lens model, focal length
- Aperture, shutter speed, ISO
- Date taken (formatted as "July 18, 2025")
- Image dimensions and orientation
- GPS location (if available)

Grid spans are intelligently assigned:
- **80% standard**: `md:col-span-1 md:row-span-1`
- **20% featured**: Tall (portrait) or wide (landscape) based on aspect ratio

## 🗂️ Project Structure

```
photos/
├── to_proces/              # Drop new photos here
│   └── processed/          # Auto-archived after processing
├── public/                 # Web assets
│   ├── photos.json        # Photo database (primary)
│   ├── collections.json   # Collections database
│   └── *.jpg              # Photo files
├── docs/                   # Exported static site (GitHub Pages)
├── process-photos-auto.sh  # Photo processing script
└── Makefile               # Build commands
```

## 🎨 Collections

Available collections (view list when running `make process-photos`):
- `tokyo-nights` - Tokyo Nights
- `portraits` - Portraits  
- `landscapes` - Landscapes
- `architecture` - Architecture

Or create new collections on the fly during processing.

## ⚙️ Customization

### Featured Photo Percentage

Edit `process-photos-auto.sh` line ~180 to adjust % of photos with special spans:

```bash
# Change "20" to adjust (0-100)
if [ $random_chance -lt 20 ] && [ "$orientation" = "portrait" ]; then
```

- `20` = 20% featured (recommended, balanced look)
- `50` = 50% featured (more variation)
- `0` = All photos 1x1 (uniform grid)
- `100` = All photos natural size (maximum variation)

### Orientation Thresholds

Edit aspect ratio thresholds around line 168:

```bash
# Portrait: aspect ratio < 0.85
# Landscape: aspect ratio > 1.2
```

## 🐛 Troubleshooting

### Tools not installed
```bash
# Ubuntu/Debian
sudo apt install libimage-exiftool-perl jq

# macOS
brew install exiftool jq
```

### No photos found
- Check photos are in `to_proces/`
- Extensions must be: `.jpg`, `.JPG`, `.jpeg`, or `.JPEG`

### Permission denied
```bash
chmod +x process-photos-auto.sh
```

## 🚢 Deployment

### Export Static Site

```bash
make export           # Builds to /docs directory
make preview-export   # Preview at http://localhost:8000/photos/
```

### GitHub Pages

1. Push `/docs` directory to your repo
2. Go to Settings → Pages
3. Set source to "GitHub Actions" or "Deploy from branch: /docs"

## 📦 Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **exiftool** - EXIF metadata extraction
- **jq** - JSON processing

## 📄 License

MIT
