# Seed Images Directory

Place your artwork images in this directory. The seed script will automatically find and attach them to artworks.

## Image Naming Convention

The seed script automatically converts artwork titles to filenames by:
- Converting to lowercase
- Removing accents (á → a, é → e, etc.)
- Replacing spaces with hyphens
- Removing special characters

### Examples:

For artwork title **"La danza espiritual"**, the script will look for:
- `la-danza-espiritual.jpg`
- `la-danza-espiritual.jpeg`
- `la-danza-espiritual.png`
- `la-danza-espiritual.webp`

For artwork title **"Y aprenderás a volar"**, the script will look for:
- `y-aprenderas-a-volar.jpg`
- `y-aprenderas-a-volar.jpeg`
- etc.

### Alternative: Exact Title Match

You can also name files exactly as the title appears (with spaces and accents):
- `La danza espiritual.jpg`
- `Y aprenderás a volar.png`

## Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

## Usage

1. **Place your image files** in this directory (`backend/db/seeds/images/`)
2. **Name them** according to the artwork titles (see examples above)
3. **Run the seed script**: `rails db:seed`

The seed script will:
- ✅ Automatically find matching images and attach them using Active Storage
- → Fall back to image URLs if no local file is found

## Example File Structure

```
backend/db/seeds/images/
├── la-danza-espiritual.jpg
├── vuela-alto.jpg
├── y-aprenderas-a-volar.png
├── en-el-bosque-de-la-conciencia.jpg
└── ...
```

## Notes

- If a local image is found, it will be attached via Active Storage
- If no local image is found, the script will use the `image_url` from `seeds.rb`
- This allows you to gradually replace URLs with local images

