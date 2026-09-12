# Cellzy

Cellzy's public website, built with Next.js and deployed through the `ibrahimcell/Cellzy` GitHub repository to its existing Vercel project.

## Local development

Requires Node.js 22.13 or newer. Run `npm install` if dependencies are missing, then `npm run dev` (port 5173).

Validation: `npm run lint` and `npm run build`.
Production preview: `npm run start -- --port 5174` after building. Restart the preview after each new production build so its asset manifest matches the compiled files.

## Customer requests

The device directory supports name/model-number search and unlisted devices. Customers choose one of eight illustrated repair issues, a screen preference when applicable, and a preferred date/time. The final step prepares an email to info@cellzy.ca with the selected details.

No message is automatically sent. The customer sends it through their own email app or copies the request into webmail. Nothing is charged, stored on the server, or marked as a confirmed appointment. Cellzy confirms pricing, parts and scheduling by email. Do not replace this with an automated email provider without approval.

Accessories and phone purchases also use inquiry/reservation emails.

## Device selection

Customers identify their device through name/model-number search. The 360° viewer is not displayed; selecting a model leads directly to the illustrated repair choices and reservation flow.

## Content still needed

- Store address, phone number and opening hours.
- Approved repair prices and model-specific part availability.
- Actual inventory, pickup details and future calendar integration if confirmed bookings are required.

Brand/store imagery comes from the supplied Cellzy design presentation. Store concept renderings are labelled as concepts.

## Product-film sequence

The opening now unfolds Apple's original Duo film with scrolling, and folds back when scrolling upward. The white surround is removed with offline silhouette masks; the original phone/screen RGB and frame order remain intact. Native video decoding plus a lightweight canvas clip does the compositing, with one outstanding seek and no live pixel processing, generated model, replacement screen or HLS player. Transparent start/end stills handle loading and reduced motion. See `public/assets/products/duo/PROVENANCE.md` and `scripts/prepare-duo-mattes.swift`.

After the Duo reaches its open frame, the following Pro Max chapter uses native sticky scrolling to move genuine transparent front/back product pairs through Burgundy, Glacier, Silver and Black, with finish-matched background dissolves. Its swatches also work in-place with mouse/keyboard; no scroll lock or autoplay loop is used. Both stages reserve their scroll space from the start, so unlocking the Pro choreography does not move downstream content. Reduced motion, short viewports and unavailable video retain static usable product views. Search, illustrated repairs and booking are independent and never hidden behind animation completion.

Cellzy's cream and terracotta palette, typography and complete wordmark surround the product imagery. The white video box and duplicate later Pro banner are removed. Do not tint, multiply or paint over the source phones. The Pro originals and sources are documented in `public/assets/products/pro-max/PROVENANCE.md`.

The owner approved pushing this sequence to `main` on September 12, 2026. Commercial reuse rights for Apple's imagery have not been established; the source records are not a reuse licence.

The header and footer use `public/assets/cellzy-wordmark.svg`, the complete original vector outlines from the presentation's brand board. Do not reuse the cropped legacy PNG.

## Motion

The product sequence is described above. Two photographic scenes use native scroll-driven image transforms, with a single animation frame per scroll update and only visible scenes measured. Content is never hidden waiting for an observer. Device selection and booking steps have brief response transitions; the store gallery supports touch, buttons and arrow keys with no autoplay. All motion respects `prefers-reduced-motion`, including gallery navigation.

Keep Cellzy's repository and Vercel project separate from other projects on this computer. Do not commit local credentials, environment files, generated builds or browser audit screenshots.
