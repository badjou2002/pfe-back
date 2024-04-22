const crypto = require('crypto');

function generateRandomString(length) {
    const buffer = crypto.randomBytes(length / 2);
    return buffer.toString('hex');
}

module.exports = { generateRandomString }