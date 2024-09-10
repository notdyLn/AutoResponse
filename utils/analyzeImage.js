const { ImageAnnotatorClient } = require('@google-cloud/vision');
const fs = require('fs');
const path = require('path');

// Provide the path to your JSON credentials file directly
const credentialsPath = path.join(__dirname, '..', 'data/bot/google-cloud-vision/dylcore-990d2a5075af.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

const visionClient = new ImageAnnotatorClient({ credentials });

async function analyzeImage(filePath) {
    try {
        const [result] = await visionClient.labelDetection(filePath);
        const labels = result.labelAnnotations.map(label => label.description).join(', ');
        return `Labels detected: ${labels}`;
    } catch (error) {
        return `Error analyzing image: ${error.message}`;
    }
}

module.exports = { analyzeImage };
