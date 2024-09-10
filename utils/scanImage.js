const clarifaiPAT = process.env.CLARIFAI_PAT;
const clarifaiUserId = 'clarifai';
const clarifaiAppId = 'main';
const modelId = 'nsfw-recognition';
const modelVersionId = 'aa47919c9a8d4d94bfa283121281bcc4';

async function scanImage(imageUrl) {
    const fetch = await import('node-fetch').then(mod => mod.default);

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": clarifaiUserId,
            "app_id": clarifaiAppId
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": imageUrl
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + clarifaiPAT
        },
        body: raw
    };

    const response = await fetch(`https://api.clarifai.com/v2/models/${modelId}/versions/${modelVersionId}/outputs`, requestOptions);
    const result = await response.json();

    const nsfwScore = result.outputs[0]?.data?.concepts?.find(concept => concept.name === 'nsfw')?.value;
    return nsfwScore > 0.5;
}

module.exports = { scanImage };