const { userUpdate } = require('../../utils/logging');
const { analyzeImage } = require('../../utils/analyzeImage');

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'userUpdate',
    async execute(oldUser, newUser) {
        const changes = [];
        const username = newUser.username.replace(/[^a-zA-Z0-9_-]/g, '');

        const userDir = path.join(__dirname, `../../data/users/${username}`);
        const userJsonPath = path.join(userDir, 'user.json');
        const imageDir = path.join(userDir, 'images');
        let existingUserInfo = {};

        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }

        if (fs.existsSync(userJsonPath)) {
            existingUserInfo = JSON.parse(fs.readFileSync(userJsonPath, 'utf8'));
        }

        const userInfo = {
            username: newUser.username,
            displayName: newUser.displayName,
            globalName: newUser.globalName,
            avatar: newUser.avatarURL(),
            banner: newUser.bannerURL()
        };

        if (oldUser.avatar !== newUser.avatar) {
            changes.push(`${oldUser.username} updated their avatar`);
            await downloadImage(newUser.avatarURL({ size: 4096 }), path.join(imageDir, 'avatar.png'));
            userInfo.avatarLabels = await analyzeImage(path.join(imageDir, 'avatar.png'));
        }

        if (oldUser.banner !== newUser.banner) {
            changes.push(`${oldUser.username} updated their banner`);
            await downloadImage(newUser.bannerURL(), path.join(imageDir, 'banner.png'));
            userInfo.bannerLabels = await analyzeImage(path.join(imageDir, 'banner.png'));
        }

        if (oldUser.displayName !== newUser.displayName) {
            changes.push(`${oldUser.username} changed their display name: ${oldUser.displayName} → ${newUser.displayName}`);
        }

        if (oldUser.globalName !== newUser.globalName) {
            changes.push(`${oldUser.username} changed their global name: ${oldUser.globalName} → ${newUser.globalName}`);
        }

        if (oldUser.username !== newUser.username) {
            changes.push(`${oldUser.username} changed their username: ${oldUser.username} → ${newUser.username}`);
        }

        fs.writeFileSync(userJsonPath, JSON.stringify({ ...existingUserInfo, ...userInfo }, null, 2));

        if (changes.length > 0) {
            userUpdate(`${changes.join(', ')}`);
        }
    }
};

async function downloadImage(url, filepath) {
    if (!url) return;

    const fetch = await import('node-fetch');
    const response = await fetch.default(url);

    if (!response.ok) throw new Error(`Failed to download image: ${response.statusText}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(filepath, buffer);
}