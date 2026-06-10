let textInput;
let lineBreakOption;
let charCount;
let lineCount;
let md5Hash;
let modifiedCharCount;
let modifiedLineCount;
let modifiedMd5Hash;
let chunkSizeInput;
let verticalSpacingInput;
let generateBtn;
let qrCodesDiv;
let modifiedText;
let debugCheckbox;
let debugBlock;
let clearBtn;

if (typeof document !== 'undefined') {
    textInput = document.getElementById('textInput'); // Text input element
    lineBreakOption = document.getElementById('lineBreakOption'); // Line break symbol selector
    charCount = document.getElementById('charCount'); // Character count element
    lineCount = document.getElementById('lineCount'); // Line count element
    md5Hash = document.getElementById('md5Hash'); // MD5 hash element for original text
    modifiedCharCount = document.getElementById('modifiedCharCount'); // Character count for modified text
    modifiedLineCount = document.getElementById('modifiedLineCount'); // Line count for modified text
    modifiedMd5Hash = document.getElementById('modifiedMd5Hash'); // MD5 hash for modified text
    chunkSizeInput = document.getElementById('chunkSize'); // Chunk size input element
    verticalSpacingInput = document.getElementById('verticalSpacing'); // Vertical spacing input element
    generateBtn = document.getElementById('generateBtn'); // Generate QR codes button
    clearBtn = document.getElementById('clearBtn'); // Clear All button
    qrCodesDiv = document.getElementById('qrCodes'); // Div to hold the generated QR codes
    modifiedText = document.getElementById('modifiedText'); // Text area to show modified text
    debugCheckbox = document.getElementById('debugCheckbox'); // Debug mode checkbox
    debugBlock = document.getElementById('debugBlock'); // Debug block element
}

// Load the saved state of the debug checkbox
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const debugState = localStorage.getItem('debugState') === 'true';
        debugCheckbox.checked = debugState;

        // Ensure the debug block visibility matches the stored state
        updateTextStats();
    });
}

// Update text statistics, display modified text and toggle debug block
function updateTextStats(text) {
    const originalText = text !== undefined ? text : textInput.value;
    const lineBreakSymbol = lineBreakOption.value === 'none' ? '' : lineBreakOption.value;
    const modifiedTextValue = replaceLineBreaks(originalText, lineBreakSymbol);

    const originalLines = originalText ? originalText.split(/\r\n|\r|\n/) : [];
    const modifiedLines = modifiedTextValue ? modifiedTextValue.split(/\r\n|\r|\n/) : [];

    charCount.textContent = originalText.length;
    lineCount.textContent = originalLines.length;
    md5Hash.textContent = md5(originalText);

    modifiedText.value = modifiedTextValue;
    modifiedCharCount.textContent = modifiedTextValue.length;
    modifiedLineCount.textContent = modifiedLines.length;
    modifiedMd5Hash.textContent = md5(modifiedTextValue);

    debugBlock.style.display = debugCheckbox.checked ? 'block' : 'none';
}

// Replace line breaks in the text with the selected symbol
function replaceLineBreaks(text, symbol) {
    if (symbol === '') return text;
    return text.replace(/(\r\n|\r|\n)/g, symbol);
}

// Split the text into chunks based on the chunk size, safely handling Unicode/Emojis
function splitText(text, chunkSize) {
    if (typeof chunkSize !== 'number' || chunkSize <= 0) {
        return [text];
    }
    const chunks = [];
    const textChars = Array.from(text); // Converts text into an array of characters, keeping emojis intact
    for (let i = 0; i < textChars.length; i += chunkSize) {
        chunks.push(textChars.slice(i, i + chunkSize).join(''));
    }
    return chunks;
}

// Generate a QR code for the given text
function generateQRCode(text, index) {
    return new Promise((resolve, reject) => {
        QRCode.toDataURL(text, { errorCorrectionLevel: 'L' }, (err, url) => {
            if (err) reject(err);
            else {
                const container = document.createElement('div');
                container.className = 'qr-code-container';
                const spacing = parseInt(verticalSpacingInput.value, 10) || 0;
                container.style.marginBottom = index === 0 ? '0' : `${spacing}px`;

                const img = document.createElement('img');
                img.src = url;
                img.alt = `QR Code ${index + 1}`;

                const label = document.createElement('p');
                label.textContent = `QR Code ${index + 1}`;

                container.appendChild(img);
                container.appendChild(label);
                resolve(container);
            }
        });
    });
}

// Process the text input and generate QR codes
async function processText() {
    const text = textInput.value.trim();
    let chunkSize = parseInt(chunkSizeInput.value, 10);
    if (isNaN(chunkSize) || chunkSize <= 0) {
        alert('Chunk size must be a positive integer. Using default of 1000.');
        chunkSize = 1000;
    }

    if (text.length === 0) {
        clearAll();
        alert("Please enter some text to generate QR codes.");
        return;
    }

    const lineBreakSymbol = lineBreakOption.value === 'none' ? '' : lineBreakOption.value;
    const modifiedTextValue = replaceLineBreaks(text, lineBreakSymbol);
    const chunks = splitText(modifiedTextValue, chunkSize);

    qrCodesDiv.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < chunks.length; i++) {
        try {
            const container = await generateQRCode(chunks[i], i);
            fragment.appendChild(container);
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    }

    qrCodesDiv.appendChild(fragment);

    updateTextStats(text);
}

// Clear the input and reset the QR code display
function clearAll() {
    textInput.value = '';
    qrCodesDiv.innerHTML = '';
    modifiedText.value = '';
    updateTextStats('');
}

if (typeof document !== 'undefined') {
    // Event listeners
    textInput.addEventListener('input', () => updateTextStats());
    generateBtn.addEventListener('click', processText);
    clearBtn.addEventListener('click', clearAll);
    debugCheckbox.addEventListener('change', function () {
        const isChecked = debugCheckbox.checked;
        debugBlock.style.display = isChecked ? 'block' : 'none';
        localStorage.setItem('debugState', isChecked);
    });

    updateTextStats();
}

if (typeof module !== 'undefined') {
    module.exports = { replaceLineBreaks, splitText };
}
