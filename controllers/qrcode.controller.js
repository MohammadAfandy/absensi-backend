const QRCode = require("qrcode");
const { encrypt, response, makeDir } = require("../utils/helpers");
const { BadRequestError } = require("../utils/helpers/error");
const QRCODE_DIR = "public/images/qrcode/";
const ABSENSI_PATH = "/api/v1/absensi/inout/";

module.exports = {
  generate: (req, res, next) => {
    try {
      let { nik, text } = req.body;
      if (nik == null || text == null) throw new BadRequestError("NIK / Text not found");
      let filename = `${nik}.png`;

      makeDir(QRCODE_DIR);
      const pathFile = QRCODE_DIR + filename;
      const url = `${process.env.BASE_URL + ABSENSI_PATH}?enc=${encrypt(text)}`;

      QRCode.toFile(pathFile, url, (err) => {
        if (err) throw err;
      });

      let data = {
        path: process.env.BASE_URL + "/" + pathFile,
      };

      response(res, { status: 200, data: data });
    } catch (error) {
      next(error);
    }
  },
};
