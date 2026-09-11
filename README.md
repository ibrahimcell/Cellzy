# Cellzy

Cellzy's public website, built with Next.js and deployed through the `ibrahimcell/Cellzy` GitHub repository to its existing Vercel project.

## Local development

Requires Node.js 22.13 or newer. Run `npm install` if dependencies are missing, then `npm run dev` (port 5173).

Validation: `npm run lint` and `npm run build`.
Production preview: `npm run start -- --port 5174` after building. Restart the preview after each new production build so its asset manifest matches the compiled files.

## Customer requests

The device directory supports name/model-number search and unlisted devices. Customers choose one of eight illustrated repair issues, a screen preference when applicable, and a preferred date/time. The final step prepares an email to info@cellzy.com with the selected details.

No message is automatically sent. The customer sends it through their own email app or copies the request into webmail. Nothing is charged, stored on the server, or marked as a confirmed appointment. Cellzy confirms pricing, parts and scheduling by email. Do not replace this with an automated email provider without approval.

Accessories and phone purchases also use inquiry/reservation emails.

## Device previews

3D is optional and loads only when requested. Curated references are in `lib/devices.ts`; other catalog models use a bounded Sketchfab lookup with variant and license checks. Some phones have no matching 3D reference. A preview failure never blocks repair selection or booking. Third-party previews are visual references, not an inventory source.

## Content still needed

- Store address, phone number and opening hours.
- Approved repair prices and model-specific part availability.
- Actual inventory, pickup details and future calendar integration if confirmed bookings are required.

Brand/store imagery comes from the supplied Cellzy design presentation. Store concept renderings are labelled as concepts. The Duo animation is removed.

Keep Cellzy's repository and Vercel project separate from other projects on this computer. Do not commit local credentials, environment files, generated builds or browser audit screenshots.
