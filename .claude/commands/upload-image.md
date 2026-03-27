Upload an image to Sanity CMS and optionally attach it to a post or project document.

Arguments: $ARGUMENTS

## Accepted argument formats
- `/upload-image <filepath>` — upload only, no document attachment
- `/upload-image <filepath> <post|project>:<slug>` — upload and attach to document
- `/upload-image <filename>` — searches ~/Downloads for the file

## Steps

1. **Locate the image**
   - If a full path is given, use it directly
   - If just a filename, search `~/Downloads/` for exact or partial match
   - If no file argument, list recent images in `~/Downloads/` (last 24h) and ask which one

2. **Rename to slug-based filename**
   - If attaching to a document, rename to `{document-slug}.{ext}`
   - If standalone, slugify the original filename
   - Copy (do not move) the renamed file to `~/Downloads/`

3. **Upload to Sanity**
   - Read the auth token from `~/.config/sanity/config.json` → `authToken`
   - Upload via Sanity Assets API:
     ```
     POST https://une0zsrz.api.sanity.io/v2024-01-01/assets/images/production?filename={slug-filename}
     Authorization: Bearer {token}
     Content-Type: image/{ext}
     Body: binary file data
     ```
   - Extract the `_id` from the response `document._id`

4. **Attach to document (if specified)**
   - Query Sanity for the document: `*[_type == "{type}" && slug.current == "{slug}"][0]{_id, title, image}`
   - Patch the document via Mutations API:
     ```
     POST https://une0zsrz.api.sanity.io/v2024-01-01/data/mutate/production
     Body: { "mutations": [{ "patch": { "id": "{doc_id}", "set": { "image": { "_type": "image", "asset": { "_type": "reference", "_ref": "{asset_id}" } } } } }] }
     ```

5. **Report results**
   - Image CDN URL
   - Dimensions and file size
   - Document attachment status (if applicable)
   - Note: ISR cache (3600s) applies — mention revalidation if needed

## Sanity config
- Project ID: `une0zsrz`
- Dataset: `production`
- API version: `2024-01-01`
- Auth token location: `~/.config/sanity/config.json` → `.authToken`

## Supported formats
PNG, JPG/JPEG, WebP, GIF, SVG
