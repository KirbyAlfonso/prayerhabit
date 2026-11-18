#!/usr/bin/env bash
# Run this while prayerhabit.com is still live on WordPress.
# Downloads every image the new site uses into public/images/.
# For images WordPress resized (e.g. -768x1024) it tries the original first.
set -u
BASE="https://prayerhabit.com/wp-content/uploads/2026/10"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/images"
mkdir -p "$OUT"

# target-name | candidate remote filenames (first one that works wins)
ITEMS=(
  "cropped_circle_image.png|cropped_circle_image.png"
  "favicon.jpg|cropped-Prayer-Habit-Logo.jpg cropped-Prayer-Habit-Logo-270x270.jpg"
  "Praying.jpg|Praying.jpg"
  "Joshua-Verse.jpg|Joshua-Verse.jpg"
  "prayer_manuscript_evening_1922.webp|prayer_manuscript_evening_1922.webp prayer_manuscript_evening_1922-768x1024.webp"
  "prayer_manuscript_morning_1894.webp|prayer_manuscript_morning_1894.webp prayer_manuscript_morning_1894-771x1024.webp"
  "prayer_manuscript_endurance_1908.webp|prayer_manuscript_endurance_1908.webp prayer_manuscript_endurance_1908-771x1024.webp"
  "chapel_interior_sunlight.webp|chapel_interior_sunlight.webp"
  "chapel_beeswax_candle.webp|chapel_beeswax_candle.webp"
  "antique_leather_prayer_book.webp|antique_leather_prayer_book.webp antique_leather_prayer_book-1024x768.webp"
)

fail=0
for item in "${ITEMS[@]}"; do
  target="${item%%|*}"; candidates="${item#*|}"; ok=0
  for c in $candidates; do
    if curl -fsSL "$BASE/$c" -o "$OUT/$target"; then echo "OK    $target  (from $c)"; ok=1; break; fi
  done
  [ $ok -eq 0 ] && { echo "FAIL  $target"; rm -f "$OUT/$target"; fail=1; }
done
[ $fail -eq 1 ] && echo "Some files failed. Copy them from your WordPress Media Library or wp-content/uploads backup."
exit 0
