const express = require("express");
const app = express();
const crypto = require("crypto");
const absensiRoute = express.Router();
const mongoose = require("mongoose");
const Absensi = require("../models/absensi.model");
const { response } = require("express");
const { encrypt, decrypt } = require("../utils/helpers/crypto");

// Get All
absensiRoute.route("/").get(async (req, res, next) => {
  try {
    let data = await Absensi.find().lean().exec();
    res.data = data;
    return next();
  } catch (error) {
    return next(error);
  }
});

absensiRoute.route("/chiper").get((req, res, next) => {
  let text = req.query.text;
  let encryptedText = req.query.enc;

  res.data = {
    encrypted: text ? encrypt(text) : "'",
    decrypted: encryptedText ? decrypt(encryptedText) : "",
  };

  return next();
});
// Get Single Data
absensiRoute.route("/id/:id").get(async (req, res, next) => {
  try {
    if (mongoose.isValidObjectId(req.params.id)) {
      let data = await Absensi.findById(req.params.id).lean().exec();
      if (data) {
        res.data = data;
        return next();
      } else {
        let error = new Error("Data absensi tidak ditemukan.");
        error.statusCode = 404;
        return next(error);
      }
    } else {
      let error = new Error("Invalid ID.");
      error.statusCode = 404;
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
});

// Check In / Checkout
absensiRoute.route("/inout").get(async (req, res, next) => {
  let now = new Date();
  let now_date = now.toISOString().split("T")[0];

  try {
    let decryptedText = decrypt(req.query.enc);
    let absensi = await Absensi.findOne({
      email: decryptedText,
      date: now_date,
    })
      .lean()
      .exec();

    if (absensi) {
      if (absensi.out) {
        let error = `${absensi.email} sudah absen masuk dan keluar hari ini`;
        error.statusCode = 500;
        throw new Error(error);
      } else {
        absensi.out = now;
        res.data = await Absensi.findByIdAndUpdate(absensi._id, {
          $set: absensi,
        });
        res.data = res.data.toObject();
        res.data.out = absensi.out;
        res.data.type = "out";
        return next();
      }
    } else {
      res.data = await Absensi.create({
        email: decryptedText,
        in: now,
        date: now_date,
      });
      res.data = res.data.toObject();
      res.data.type = "in";
      return next();
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = absensiRoute;
