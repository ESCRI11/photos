#!/bin/bash

# Fully automatic version - no user prompts
# Script to process photos from to_proces/ folder
# Extracts EXIF metadata and adds to photos.json

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TO_PROCESS_DIR="$SCRIPT_DIR/to_proces"
PUBLIC_DIR="$SCRIPT_DIR/public"
PHOTOS_JSON="$PUBLIC_DIR/photos.json"
COLLECTIONS_JSON="$PUBLIC_DIR/collections.json"

# Check if exiftool is installed
if ! command -v exiftool &> /dev/null; then
    echo "Error: exiftool is not installed"
    echo "Please install it with:"
    echo "  Ubuntu/Debian: sudo apt install libimage-exiftool-perl"
    echo "  macOS: brew install exiftool"
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed"
    echo "Please install it with:"
    echo "  Ubuntu/Debian: sudo apt install jq"
    echo "  macOS: brew install jq"
    exit 1
fi

# Create directories if they don't exist
mkdir -p "$TO_PROCESS_DIR"
mkdir -p "$PUBLIC_DIR"

# Check if there are any JPG files to process
shopt -s nullglob
jpg_files=("$TO_PROCESS_DIR"/*.{jpg,JPG,jpeg,JPEG})
shopt -u nullglob

if [ ${#jpg_files[@]} -eq 0 ]; then
    echo "No JPG files found in $TO_PROCESS_DIR"
    exit 0
fi

echo "Found ${#jpg_files[@]} file(s) to process"
echo ""

# Read existing photos.json
if [ ! -f "$PHOTOS_JSON" ]; then
    echo '{"photos":[]}' > "$PHOTOS_JSON"
fi

# Read existing collections.json
if [ ! -f "$COLLECTIONS_JSON" ]; then
    echo '{"collections":[]}' > "$COLLECTIONS_JSON"
fi

# BATCH PROMPTS - Ask once for all photos
echo "=================================="
echo "BATCH CONFIGURATION (applies to all ${#jpg_files[@]} photos)"
echo "=================================="
echo ""

# Get location for all photos
read -p "Enter location for all photos: " batch_location
batch_location=${batch_location:-"Unknown"}

# Show available collections
echo ""
echo "Available collections:"
collection_ids=($(jq -r '.collections[].id' "$COLLECTIONS_JSON"))
collection_titles=($(jq -r '.collections[].title' "$COLLECTIONS_JSON"))

for i in "${!collection_ids[@]}"; do
    echo "  - ${collection_ids[$i]} (${collection_titles[$i]})"
done

echo ""
read -p "Enter collection ID (existing or new): " collection_id

# Check if collection is new
is_new_collection=false
first_photo_filename=""

if ! jq -e ".collections[] | select(.id == \"$collection_id\")" "$COLLECTIONS_JSON" > /dev/null; then
    is_new_collection=true
    echo ""
    echo "Creating new collection: $collection_id"
    read -p "Enter collection title: " collection_title
    read -p "Enter collection description: " collection_description
fi

echo ""
echo "=================================="
echo "Processing photos..."
echo "=================================="
echo ""

# Process each JPG file
for jpg_file in "${jpg_files[@]}"; do
    filename=$(basename "$jpg_file")
    echo "Processing: $filename"
    
    # Extract EXIF data
    camera=$(exiftool -Model -s -s -s "$jpg_file" || echo "Unknown Camera")
    lens=$(exiftool -LensModel -s -s -s "$jpg_file" || echo "Unknown Lens")
    focal_length=$(exiftool -FocalLength -s -s -s "$jpg_file" || echo "")
    aperture=$(exiftool -FNumber -s -s -s "$jpg_file" || echo "")
    shutter_speed=$(exiftool -ExposureTime -s -s -s "$jpg_file" || echo "")
    iso=$(exiftool -ISO -s -s -s "$jpg_file" || echo "")
    date_taken=$(exiftool -DateTimeOriginal -s -s -s "$jpg_file" || echo "")
    gps_lat=$(exiftool -GPSLatitude -n -s -s -s "$jpg_file" 2>/dev/null || echo "")
    gps_lon=$(exiftool -GPSLongitude -n -s -s -s "$jpg_file" 2>/dev/null || echo "")
    
    # Extract image dimensions for orientation detection
    img_width=$(exiftool -ImageWidth -s -s -s "$jpg_file" || echo "0")
    img_height=$(exiftool -ImageHeight -s -s -s "$jpg_file" || echo "0")
    
    # Format the data
    if [ -n "$focal_length" ]; then
        focal_length="${focal_length} mm"
        focal_length=$(echo "$focal_length" | sed 's/ mm mm/ mm/g')
    fi
    
    if [ -n "$aperture" ]; then
        aperture="f/${aperture}"
    fi
    
    if [ -n "$shutter_speed" ]; then
        # Convert decimal to fraction if needed
        if [[ $shutter_speed =~ ^[0-9]+\.[0-9]+$ ]] && (( $(echo "$shutter_speed < 1" | bc -l) )); then
            shutter_speed="1/$(printf "%.0f" $(echo "1/$shutter_speed" | bc -l))s"
        else
            shutter_speed="${shutter_speed}s"
        fi
    fi
    
    # Format date (from "2025:07:18 16:42:31" to "July 18, 2025")
    if [ -n "$date_taken" ]; then
        # Replace first two colons with dashes for date parsing
        date_temp=$(echo "$date_taken" | sed 's/:/-/; s/:/-/')
        date_formatted=$(date -d "$date_temp" "+%B %-d, %Y" 2>/dev/null || echo "$date_taken")
    else
        date_formatted=$(date "+%B %-d, %Y")
    fi
    
    # Generate a random 12-character ID
    photo_id=$(head /dev/urandom | tr -dc a-z0-9 | head -c 12)
    
    # Use batch location
    location="$batch_location"
    
    # Store first photo filename for collection cover
    if [ -z "$first_photo_filename" ]; then
        first_photo_filename="$filename"
    fi
    
    # Determine span based on image orientation
    # Only apply special spans to ~20% of photos for a balanced grid
    random_chance=$((RANDOM % 100))  # 0-99
    
    if [ "$img_width" -gt 0 ] && [ "$img_height" -gt 0 ]; then
        aspect_ratio=$(echo "scale=2; $img_width / $img_height" | bc)
        
        # Detect orientation
        if (( $(echo "$aspect_ratio < 0.85" | bc -l) )); then
            orientation="portrait"
            detected_span="1x2"
        elif (( $(echo "$aspect_ratio > 1.2" | bc -l) )); then
            orientation="landscape"
            detected_span="2x1"
        else
            orientation="square"
            detected_span="1x1"
        fi
        
        # Apply special span only to 20% of photos (randomly selected)
        if [ $random_chance -lt 20 ] && [ "$orientation" = "portrait" ]; then
            span_class="md:col-span-1 md:row-span-2"
            applied_span="1x2 (featured)"
        elif [ $random_chance -lt 20 ] && [ "$orientation" = "landscape" ]; then
            span_class="md:col-span-2 md:row-span-1"
            applied_span="2x1 (featured)"
        else
            span_class="md:col-span-1 md:row-span-1"
            applied_span="1x1 (standard)"
        fi
    else
        # Fallback if dimensions not found
        span_class="md:col-span-1 md:row-span-1"
        orientation="unknown"
        detected_span="unknown"
        applied_span="1x1 (fallback)"
    fi
    
    # Default values
    alt_text="Photography - $filename"
    
    # Create new photo entry
    new_entry=$(jq -n \
        --arg id "$photo_id" \
        --arg file "$filename" \
        --arg alt "$alt_text" \
        --arg collection_tag "topics.$collection_id" \
        --arg span "$span_class" \
        --arg camera "$camera" \
        --arg lens "$lens" \
        --arg focal "$focal_length" \
        --arg aperture "$aperture" \
        --arg shutter "$shutter_speed" \
        --arg iso "$iso" \
        --arg date "$date_formatted" \
        --arg location "$location" \
        '{
            id: $id,
            file: $file,
            alt: $alt,
            display: [$collection_tag],
            span: $span,
            metadata: {
                camera: $camera,
                lens: $lens,
                focalLength: $focal,
                aperture: $aperture,
                shutterSpeed: $shutter,
                iso: $iso,
                date: $date,
                location: $location
            }
        }')
    
    # Add to photos.json
    jq --argjson entry "$new_entry" '.photos += [$entry]' "$PHOTOS_JSON" > "$PHOTOS_JSON.tmp"
    mv "$PHOTOS_JSON.tmp" "$PHOTOS_JSON"
    
    # Copy to public directory
    cp "$jpg_file" "$PUBLIC_DIR/$filename"
    
    # Move processed file to archive
    mkdir -p "$TO_PROCESS_DIR/processed"
    mv "$jpg_file" "$TO_PROCESS_DIR/processed/$filename"
    
    echo "✓ Added $filename to photos.json"
    echo "  Camera: $camera"
    echo "  Lens: $lens"
    echo "  Settings: $aperture, $shutter_speed, ISO $iso"
    echo "  Orientation: $orientation (${img_width}x${img_height}) → $applied_span"
    echo ""
done

# Add new collection if needed
if [ "$is_new_collection" = true ]; then
    echo ""
    echo "Adding new collection to collections.json..."
    
    new_collection=$(jq -n \
        --arg id "$collection_id" \
        --arg title "$collection_title" \
        --arg desc "$collection_description" \
        --arg cover "$first_photo_filename" \
        '{
            id: $id,
            title: $title,
            description: $desc,
            coverImage: $cover
        }')
    
    jq --argjson coll "$new_collection" '.collections += [$coll]' "$COLLECTIONS_JSON" > "$COLLECTIONS_JSON.tmp"
    mv "$COLLECTIONS_JSON.tmp" "$COLLECTIONS_JSON"
    
    echo "✓ Added collection '$collection_title' to collections.json"
fi

echo ""
echo "✓ Processing complete! Processed ${#jpg_files[@]} file(s)."
echo "✓ Location: $batch_location"
echo "✓ Collection: $collection_id"
echo "✓ Photos moved to: $TO_PROCESS_DIR/processed/"
echo "✓ Photos copied to: $PUBLIC_DIR/"
echo "✓ Updated: $PHOTOS_JSON"
if [ "$is_new_collection" = true ]; then
    echo "✓ Updated: $COLLECTIONS_JSON"
fi

