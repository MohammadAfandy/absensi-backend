const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const crypto = require("crypto");
const algorithm = "aes-192-cbc";
const password = process.env.SECRET_CRYPTO;
const key = crypto.scryptSync(password, "salt", 24);
const iv = Buffer.alloc(16, 0);

module.exports = {
  encrypt: (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    return cipher.update(text, "utf8", "hex") + cipher.final("hex");
  },
  decrypt: (encryptedText) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    return (
      decipher.update(encryptedText, "hex", "utf8") + decipher.final("utf8")
    );
  },
};
