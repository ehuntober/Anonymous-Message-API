

const crypto = require('crypto');

const encryptMessage = (message, secret) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv);
  const encrypted = cipher.update(message, 'utf8', 'base64') + cipher.final('base64');
  return `${iv.toString('hex')}:${encrypted}`;
};

const decryptMessage = (encryptedMessage, secret) => {
  const [ivHex, encrypted] = encryptedMessage.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', secret, iv);
  const decrypted = decipher.update(encrypted, 'base64', 'utf8') + decipher.final('utf8');
  return decrypted;
};

module.exports = { encryptMessage, decryptMessage };