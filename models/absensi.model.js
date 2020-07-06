const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AbsensiSchema = new Schema(
  {
    name: { type: String },
    email: {
      type: String,
      required: [true, "Email tidak boleh kosong"],
    },
    in: { type: Date, default: "" },
    out: { type: Date, default: "" },
    date: { type: String },
  },
  {
    collection: "absensi",
    timestamps: true,
  }
);

module.exports = mongoose.model("Absensi", AbsensiSchema);
