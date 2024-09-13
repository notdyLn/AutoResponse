const { ImageAnnotatorClient } = require('@google-cloud/vision');
const { Error, Google } = require('./logging');
const fs = require('fs');
const path = require('path');

const validImageExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff'];

const credentialsPath = path.join(__dirname, '..', 'data/bot/google-cloud-vision/dylcore-990d2a5075af.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

const visionClient = new ImageAnnotatorClient({ credentials });

async function analyzeImage(filePath) {
    try {
        const fileExtension = path.extname(filePath).toLowerCase();
        if (!validImageExtensions.includes(fileExtension)) {
            return Error(`File is not a valid image. Supported formats are ${validImageExtensions.join(', ')}.`);
        }

        const [labelResult] = await visionClient.labelDetection(filePath);
        const labels = labelResult.labelAnnotations.map(label => label.description).join(', ');

        const [textResult] = await visionClient.textDetection(filePath);
        let ocrText = textResult.fullTextAnnotation ? textResult.fullTextAnnotation.text : 'No text detected';

        ocrText = ocrText.replace(/\n/g, ' ');

        Google(`Image analysis: Labels - ${labels}`);
        Google(`OCR result: ${ocrText}`);

        return { labels, ocrText };
    } catch (error) {
        return Error(`Error analyzing image: ${error.message}`);
    }
}

module.exports = { analyzeImage };
