const mongoose = require("mongoose");
const validator = require("validator");
const bycrypt = require("bcrypt");

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
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password if it is modified
userSchema.pre("save", async function (next) {
  // Only run this function if the password was actually modified
  if (!this.isModified("password")) return next();
  // Hash the password with cost of 10
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);

  // Delete confirmPassword field
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bycrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("User", userSchema);
