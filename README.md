# QR Split

QR Split is a small client-side web tool that turns long text into a series of QR codes. It relies solely on JavaScript and runs entirely in the browser, so no server is required.

## Features

- Split any text into chunks (default 750 characters each) and generate a QR code for every chunk.
- Optionally replace line breaks with a custom symbol such as `\n`, `¶`, or `^N^` before encoding.
- Display character and line counts along with MD5 hashes for both the original and modified text in a toggleable debug panel.
- Choose the vertical spacing between generated QR codes.
- A footer QR code links to a default domain (`https://qr.tzara.me/`).

## Usage

1. Open `index.html` in a modern web browser.
2. Enter or paste your text into the textarea.
3. Select how line breaks should be handled and click **Generate QR Codes**.
4. The page will display one QR code per chunk of text. Enable the **Debug** checkbox to view statistics and adjust chunk size or spacing.

All logic is handled by `script.js` and the page uses the [QRCode](https://github.com/soldair/node-qrcode) and [blueimp-md5](https://github.com/blueimp/JavaScript-MD5) libraries via CDN links.

## Development

The project is intentionally simple:

- `index.html` – markup and inline styles for the single-page interface
- `script.js` – client-side logic for processing text and generating QR codes
- `style.css` – reserved for additional styles (currently empty)

Feel free to extend the styling, add features, or modify the default domain in `script.js`.

