const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Tell us Your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please provide your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  this.confirmPassword = undefined;
  next();
});

module.exports = mongoose.model("User", userSchema);
