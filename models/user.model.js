const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "{PATH} tidak boleh kosong"],
      trim: true,
      unique: true,
      uniqueCaseInsensitive: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "{PATH} tidak boleh kosong"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "public"],
    },
  },
  {
    collection: "user",
    timestamps: true,
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

UserSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.statics.validateUser = async function ({ username, password }) {
  let user = await this.findOne({ username });
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      let userObject = user.toObject();
      return {
        username: userObject.username,
        role: userObject.role,
      };
    }
  }
  return false;
};

UserSchema.virtual("pegawai", {
  ref: "Pegawai",
  localField: "username",
  foreignField: "email",
});

UserSchema.plugin(uniqueValidator, { message: "{PATH} sudah terdaftar." });

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  this.password = this.generateHash(this.password);
  next();
});
module.exports = mongoose.model("User", UserSchema);
