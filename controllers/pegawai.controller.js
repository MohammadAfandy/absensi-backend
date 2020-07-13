const mongoose = require("mongoose");
const Pegawai = require("../models/pegawai.model");
const { response } = require("../utils/helpers");

module.exports = {
  find: async (req, res, next) => {
    try {
      let data = await Pegawai.find(req.query).lean().exec();
      response(res, { status: 200, data: data });
    } catch (error) {
      next(error);
    }
  },
  findOne: async (req, res, next) => {
    try {
      if (mongoose.isValidObjectId(req.params.id)) {
        let data = await Pegawai.findById(req.params.id).populate("absensi").lean().exec();
        response(res, { status: 200, data: data });
      } else {
        let error = new Error("Invalid ID.");
        error.statusCode = 404;
        next(error);
      }
    } catch (error) {
      next(error);
    }
  },
  store: async (req, res, next) => {
    try {
      let data = await Pegawai.create(req.body);
      response(res, { status: 200, data: data });
    } catch (error) {
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    try {
      let data = await Pegawai.findByIdAndDelete(req.params.id);
      response(res, { status: 200, data: data });
    } catch (error) {
      next(error);
    }
  },
};
