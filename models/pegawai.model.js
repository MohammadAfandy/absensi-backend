const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const PegawaiSchema = new Schema(
  {
    nama: { type: String, required: [true, "{PATH} tidak boleh kosong"], trim: true },
    nik: {
      type: String,
      required: [true, "{PATH} tidak boleh kosong"],
      trim: true,
      unique: true,
      uniqueCaseInsensitive: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "{PATH} tidak boleh kosong"],
      trim: true,
      uniqueCaseInsensitive: true,
      unique: true,
      index: true,
    },
    tempat_lahir: { type: String, default: null },
    tanggal_lahir: { type: Date, default: null },
    tanggal_bergabung: { type: Date, default: null },
    jabatan: { type: String, default: null },
    divisi: { type: String, default: null },
  },
  {
    collection: "pegawai",
    timestamps: true,
    toObject: { virtuals: true },
  }
);

PegawaiSchema.virtual("absensi", {
  ref: "Absensi",
  localField: "email",
  foreignField: "email",
});

PegawaiSchema.plugin(uniqueValidator, { message: "{PATH} sudah terdaftar." });

module.exports = mongoose.model("Pegawai", PegawaiSchema);
