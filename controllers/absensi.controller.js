const mongoose = require("mongoose");
const Absensi = require("../models/absensi.model");
const { decrypt, response } = require("../utils/helpers");
const { BadRequestError } = require("../utils/helpers/error");

module.exports = {
  find: async (req, res, next) => {
    try {
      let data = await Absensi.find(req.query).populate("pegawai").lean().exec();
      response(res, { status: 200, data: data });
    } catch (error) {
      next(error);
    }
  },
  findOne: async (req, res, next) => {
    try {
      let data = await Absensi.findById(req.params.id).populate("pegawai").lean().exec();
      response(res, { status: 200, data: data });
    } catch (error) {
      next(error);
    }
  },
  inOut: async (req, res, next) => {
    const now = new Date();
    const now_date = now.toISOString().split("T")[0];

    try {
      const decryptedText = decrypt(req.query.enc);
      let absensi = await Absensi.findOne({
        email: decryptedText,
        date: now_date,
      })
        .populate("pegawai")
        .lean()
        .exec();

      if (absensi) {
        if (absensi.out) {
          throw new BadRequestError(`${absensi.pegawai.nama} sudah absen masuk dan keluar hari ini`);
        } else {
          absensi.out = now;
          let data = await Absensi.findByIdAndUpdate(absensi._id, {
            $set: absensi,
          });
          data = data.toObject();
          data.out = absensi.out;
          data.type = "out";
          response(res, { status: 200, data: data });
        }
      } else {
        let data = await Absensi.create({
          email: decryptedText,
          in: now,
          date: now_date,
        });
        data = data.toObject();
        data.type = "in";
        response(res, { status: 200, data: data });
      }
    } catch (error) {
      next(error);
    }
  },
};
