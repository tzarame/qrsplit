# qrsplit

A small utility that converts text into a sequence of QR codes.

## Usage

Open `index.html` in your browser and enter the text you would like to encode.
You can optionally replace line breaks with a symbol and specify how many
characters should be included in each QR code. Generated codes are displayed one
below another.

To run the unit tests locally install dependencies and execute:

```bash
npm install
npm test
```

The tests cover the text manipulation helpers used by the main script.
