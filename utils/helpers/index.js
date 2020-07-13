const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config({ path: "./.env" });

const crypto = require("crypto");
const algorithm = "aes-192-cbc";
const password = process.env.SECRET_CRYPTO;
const key = crypto.scryptSync(password, "salt", 24);
const iv = Buffer.alloc(16, 0);

module.exports = {
  response: (res, response) => {
    if (response.status >= 200 && response.status < 300) {
      message = "Success";
    } else if (response.status >= 400 && response.status < 500) {
      message = "Error";
    } else {
      message = "Internal Server Error";
    }
    res.status(response.status).json({
      status: response.status || 400,
      message: response.message || message,
      data: response.data || {},
    });
  },
  encrypt: (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    return cipher.update(text, "utf8", "hex") + cipher.final("hex");
  },
  decrypt: (encryptedText) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    return decipher.update(encryptedText, "hex", "utf8") + decipher.final("utf8");
  },
  makeDir: (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return;
  },
  formatValidationError: (errors) => {
    if (typeof errors === "object") {
      Object.keys(errors).map(function (key, index) {
        errors[key] = errors[key].properties.message;
      });

      return errors;
    }

    return;
  },
};
