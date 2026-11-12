#!/bin/bash
# scripts/extract-frames.sh
# Production frame extractor for Monolith Constructions.
# Creates desktop set (1280x720, q=65, 96 frames), mobile set (960x540, q=62, 48 frames),
# poster (960x540, q=70) and manifest.json for each set.
# Plain full frame (no crop, no delogo, no blur).

VIDEOS_DIR="public/videos"
FRAMES_DIR="public/frames"

declare -A VIDEO_MAP
VIDEO_MAP["Hero.mp4"]="section1"
VIDEO_MAP["Hall.mp4"]="living-room"
VIDEO_MAP["Kitchen.mp4"]="kitchen"
VIDEO_MAP["Bedroom.mp4"]="bedroom"
VIDEO_MAP["Bathroom.mp4"]="bathroom"
VIDEO_MAP["Backyard.mp4"]="backyard"
VIDEO_MAP["BuildProcess.mp4"]="build-process"

DESKTOP_W=1280
DESKTOP_H=720
DESKTOP_Q=65
DESKTOP_FRAMES=96
DESKTOP_TARGET_MB=3.0

MOBILE_W=960
MOBILE_H=540
MOBILE_Q=62
MOBILE_FRAMES=48
MOBILE_TARGET_MB=1.5

POSTER_W=960
POSTER_H=540
POSTER_Q=70

echo "=================================================================="
echo "Monolith Constructions — Production Frame & Poster Extractor"
echo "Desktop: ${DESKTOP_W}x${DESKTOP_H}, WebP q=${DESKTOP_Q}, ${DESKTOP_FRAMES} frames (Target < ${DESKTOP_TARGET_MB} MB)"
echo "Mobile:  ${MOBILE_W}x${MOBILE_H}, WebP q=${MOBILE_Q}, ${MOBILE_FRAMES} frames (Target < ${MOBILE_TARGET_MB} MB)"
echo "Poster:  ${POSTER_W}x${POSTER_H}, WebP q=${POSTER_Q} (First Frame)"
echo "=================================================================="

for VIDEO in "${!VIDEO_MAP[@]}"; do
  FOLDER="${VIDEO_MAP[$VIDEO]}"
  IN_PATH="$VIDEOS_DIR/$VIDEO"
  SECTION_DIR="$FRAMES_DIR/$FOLDER"

  if [ ! -f "$IN_PATH" ]; then
    echo "Skipping $VIDEO: file not found in $VIDEOS_DIR"
    continue
  fi

  DESKTOP_DIR="$SECTION_DIR/desktop"
  MOBILE_DIR="$SECTION_DIR/mobile"

  mkdir -p "$DESKTOP_DIR" "$MOBILE_DIR"
  rm -f "$DESKTOP_DIR"/*.webp "$MOBILE_DIR"/*.webp

  echo -e "\n--------------------------------------------------"
  echo "Processing $VIDEO -> $SECTION_DIR..."
  echo "--------------------------------------------------"

  # Determine duration
  DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$IN_PATH" 2>/dev/null)
  if [ -z "$DURATION" ] || [ "$DURATION" == "N/A" ]; then
    DURATION=6
  fi

  # 1. Poster
  ffmpeg -y -i "$IN_PATH" \
    -vframes 1 \
    -vf "scale=${POSTER_W}:${POSTER_H}:flags=lanczos" \
    -c:v libwebp \
    -quality "$POSTER_Q" \
    "$SECTION_DIR/poster.webp" >/dev/null 2>&1

  POSTER_KB=$(du -k "$SECTION_DIR/poster.webp" 2>/dev/null | cut -f1)
  echo "  ✓ Poster created: $SECTION_DIR/poster.webp (${POSTER_KB} KB)"

  # 2. Desktop Set
  DESKTOP_FPS=$(awk "BEGIN {print $DESKTOP_FRAMES / $DURATION}")
  ffmpeg -y -i "$IN_PATH" \
    -vf "fps=${DESKTOP_FPS},scale=${DESKTOP_W}:${DESKTOP_H}:flags=lanczos" \
    -vframes "$DESKTOP_FRAMES" \
    -c:v libwebp \
    -quality "$DESKTOP_Q" \
    "$DESKTOP_DIR/frame_%04d.webp" >/dev/null 2>&1

  cat <<EOF > "$DESKTOP_DIR/manifest.json"
{
  "count": $DESKTOP_FRAMES,
  "width": $DESKTOP_W,
  "height": $DESKTOP_H
}
EOF

  DESKTOP_KB=$(du -k "$DESKTOP_DIR"/*.webp 2>/dev/null | awk '{sum+=$1} END {print sum}')
  DESKTOP_MB=$(awk "BEGIN {printf \"%.2f\", $DESKTOP_KB / 1024}")
  echo "  ✓ Desktop set: ${DESKTOP_MB} MB (Target < ${DESKTOP_TARGET_MB} MB)"

  # 3. Mobile Set
  MOBILE_FPS=$(awk "BEGIN {print $MOBILE_FRAMES / $DURATION}")
  ffmpeg -y -i "$IN_PATH" \
    -vf "fps=${MOBILE_FPS},scale=${MOBILE_W}:${MOBILE_H}:flags=lanczos" \
    -vframes "$MOBILE_FRAMES" \
    -c:v libwebp \
    -quality "$MOBILE_Q" \
    "$MOBILE_DIR/frame_%04d.webp" >/dev/null 2>&1

  cat <<EOF > "$MOBILE_DIR/manifest.json"
{
  "count": $MOBILE_FRAMES,
  "width": $MOBILE_W,
  "height": $MOBILE_H
}
EOF

  MOBILE_KB=$(du -k "$MOBILE_DIR"/*.webp 2>/dev/null | awk '{sum+=$1} END {print sum}')
  MOBILE_MB=$(awk "BEGIN {printf \"%.2f\", $MOBILE_KB / 1024}")
  echo "  ✓ Mobile set: ${MOBILE_MB} MB (Target < ${MOBILE_TARGET_MB} MB)"

done

echo -e "\n=================================================="
echo "All frame extractions & manifests completed successfully."
echo "=================================================="
