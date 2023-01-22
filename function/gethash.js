const crypto = require('crypto');


function getHash(password) { 
    const hash = crypto.createHash('sha256')
    hash.update(password);
    return hash.digest('hex');
 }

 function randomChars(l) {
    // Character Length
    let password = '';
    for (let i = 0; i < l; i++) {
        const num = Math.floor(Math.random() * 62);
        if (num < 26) {
            // Generate a lowercase letter
            password += String.fromCharCode(num + 'a'.charCodeAt(0));
        } else if (num < 52) {
            // Generate an uppercase letter
            password += String.fromCharCode(num - 26 + 'A'.charCodeAt(0));
        } else {
            // Generate a digit
            password += String.fromCharCode(num - 52 + '0'.charCodeAt(0));
        }
    }
    return password;
}


module.exports = {randomChars, getHash}