# Original Apple product footage

Downloaded September 12, 2026 from the video and picture sources on
https://www.apple.com/iphone-duo/ . No generated model, replacement screen,
or re-encoding is used. The original movie is now composited through offline
silhouette masks so its white background does not appear on Cellzy's cream.

- `apple-highlights-display.mp4`: https://www.apple.com/105/media/us/iphone-duo/2026/9305e4b9-72d9-4c05-9381-b572adadd5e5/anim/highlights-display/large.mp4
- `apple-display-start.jpg`: https://www.apple.com/v/iphone-duo/a/images/overview/highlights/highlights_display_startframe__bg5quzqwkz7m_large.jpg
- `apple-display-end.jpg`: https://www.apple.com/v/iphone-duo/a/images/overview/highlights/highlights_display_endframe__e0hi6rmf3hg2_large.jpg

The MP4 is a 3-second, 1260 × 612 H.264 product-only opening sequence.
The two JPEG reference images are Apple's original supplied frames, not screenshots.
The active transparent posters are derived from the movie as documented below.
The surrounding typography, navigation, copy, buttons and layout remain Cellzy's.

These assets belong to Apple; public accessibility is not a reuse license.
No commercial reuse permission has been established. The owner approved pushing
the Cellzy changes to `main` on September 12, 2026; that approval does not establish
a licence from Apple.
https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html

The older glTF/bin assets in this directory are not used by this sequence.

## Derived transparent presentation

`duo-mattes.json`, `duo-transparent-start.png`, and `duo-transparent-end.png`
are Cellzy's local presentation derivatives, not Apple-supplied alpha assets.
They were produced from the original MP4 using
`scripts/prepare-duo-mattes.swift` and native AVFoundation decoding.

The deterministic process floods only near-white pixels connected to the
outside of each frame. The connected device outline encloses and preserves
white screen text and controls. A simplified silhouette deviates by at most
0.4 source pixels from its extracted edge. Ninety masks retain the original
presentation timestamps; the original MP4 and its RGB imagery remain unchanged.
Start/end PNGs preserve opaque foreground RGB and use offline antialiasing at
the contour. No AI imagery, color tint, CSS blending, or live pixel keying is used.

The browser uses `lib/duo-matte.ts` to clip and draw the decoded original frame
at its `requestVideoFrameCallback` media timestamp. Canvas backing resolution
is the source's native 1260 × 612. Generated comparison PNGs stay in ignored
`output/playwright/`, not in the delivered media directory.
