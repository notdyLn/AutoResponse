const colors = require('colors');
const fs = require('fs');
const path = require('path');

function swipeEffect(text, color) {
    const lines = text.split('\n');
    let lineIndex = 0;

    function printLine() {
        const currentLine = lines[lineIndex];

        setTimeout(() => {
            console.log(colors[color](currentLine)); 
            lineIndex++;

            if (lineIndex < lines.length) {
                printLine();
            }
        }, 1);
    }

    printLine();
}

function readFileAndDisplay(filePath, color) {
    fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
            console.error(`Error reading file ${filePath}: ${error.message}`);
        } else {
            swipeEffect(data, color);
        }
    });
}

const fileNames = [
    { name: 'AutoResponse.txt', color: 'blue' }
];

function processFiles(index) {
    if (index < fileNames.length) {
        const fileName = fileNames[index].name;
        const color = fileNames[index].color;
        const filePath = path.join(__dirname, fileName);

        readFileAndDisplay(filePath, color);
        processFiles(index + 1);
    }
}

processFiles(0);
