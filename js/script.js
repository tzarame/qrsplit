const textInput = document.getElementById('textInput'); // Text input element
const lineBreakOption = document.getElementById('lineBreakOption'); // Line break symbol selector
const charCount = document.getElementById('charCount'); // Character count element
const lineCount = document.getElementById('lineCount'); // Line count element
const md5Hash = document.getElementById('md5Hash'); // MD5 hash element for original text
const modifiedCharCount = document.getElementById('modifiedCharCount'); // Character count for modified text
const modifiedLineCount = document.getElementById('modifiedLineCount'); // Line count for modified text
const modifiedMd5Hash = document.getElementById('modifiedMd5Hash'); // MD5 hash for modified text
const chunkSizeInput = document.getElementById('chunkSize'); // Chunk size input element
const verticalSpacingInput = document.getElementById('verticalSpacing'); // Vertical spacing input element
const generateBtn = document.getElementById('generateBtn'); // Generate QR codes button
const qrCodesDiv = document.getElementById('qrCodes'); // Div to hold the generated QR codes
const modifiedText = document.getElementById('modifiedText'); // Text area to show modified text
const debugCheckbox = document.getElementById('debugCheckbox'); // Debug mode checkbox
const debugBlock = document.getElementById('debugBlock'); // Debug block element
const domainQRCode = document.getElementById('domainQRCode'); // QR code for the domain

const defaultDomain = 'https://qr.tzara.me/'; // Default domain for the QR code at the bottom

// Load the saved state of the debug checkbox and generate the domain QR code
document.addEventListener('DOMContentLoaded', () => {
    const debugState = localStorage.getItem('debugState') === 'true';
    debugCheckbox.checked = debugState;
    debugBlock.style.display = debugState ? 'block' : 'none';

    const domain = defaultDomain;
    QRCode.toDataURL(domain, { errorCorrectionLevel: 'L' }, (err, url) => {
        if (!err) {
            domainQRCode.src = url;
        }
    });
});

// Update text statistics and modified text display
function updateTextStats(text) {
    const originalText = text || textInput.value;
    const lineBreakSymbol = lineBreakOption.value === 'none' ? '' : lineBreakOption.value;
    const modifiedTextValue = replaceLineBreaks(originalText, lineBreakSymbol);

    charCount.textContent = originalText.length;
    lineCount.textContent = originalText.split(/\r\n|\r|\n/).length;
    md5Hash.textContent = md5(originalText);

    modifiedText.value = modifiedTextValue;
    modifiedCharCount.textContent = modifiedTextValue.length;
    modifiedLineCount.textContent = modifiedTextValue.split(/\r\n|\r|\n/).length;
    modifiedMd5Hash.textContent = md5(modifiedTextValue);

    debugBlock.style.display = debugCheckbox.checked && originalText.length > 0 ? 'block' : 'none';
}

// Replace line breaks in the text with the selected symbol
function replaceLineBreaks(text, symbol) {
    if (symbol === '') return text;
    return text.replace(/(\r\n|\r|\n)/g, symbol + '\n');
}

// Split the text into chunks based on the chunk size
function splitText(text, chunkSize) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
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
                container.style.marginBottom = index === 0 ? '0' : `${verticalSpacingInput.value}px`;
                
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
    const chunkSize = parseInt(chunkSizeInput.value) || 750;

    if (text.length === 0) {
        alert("Please enter some text to generate QR codes.");
        return;
    }

    const lineBreakSymbol = lineBreakOption.value === 'none' ? '' : lineBreakOption.value;
    const modifiedTextValue = replaceLineBreaks(text, lineBreakSymbol);
    const chunks = splitText(modifiedTextValue, chunkSize);

    qrCodesDiv.innerHTML = '';

    for (let i = 0; i < chunks.length; i++) {
        try {
            const container = await generateQRCode(chunks[i], i);
            qrCodesDiv.appendChild(container);
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    }

    updateTextStats(text);
}

// Clear the input and reset the QR code display
function clearAll() {
    textInput.value = '';
    qrCodesDiv.innerHTML = '';
    modifiedText.value = '';
    updateTextStats('');
}

// Event listeners
textInput.addEventListener('input', () => updateTextStats());
generateBtn.addEventListener('click', processText);
debugCheckbox.addEventListener('change', function () {
    const isChecked = debugCheckbox.checked;
    debugBlock.style.display = isChecked && textInput.value.length > 0 ? 'block' : 'none';
    localStorage.setItem('debugState', isChecked);
});

updateTextStats();
