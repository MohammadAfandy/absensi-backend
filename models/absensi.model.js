const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Pegawai = require("./pegawai.model");

const AbsensiSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email tidak boleh kosong"],
      validate: {
        validator: async (val) => {
          let pegawai = await Pegawai.findOne({ email: val });
          return pegawai;
        },
        message: "{PATH} tidak terdaftar",
      },
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

AbsensiSchema.virtual("pegawai", {
  ref: "Pegawai",
  localField: "email",
  foreignField: "email",
  justOne: true,
});

module.exports = mongoose.model("Absensi", AbsensiSchema);
