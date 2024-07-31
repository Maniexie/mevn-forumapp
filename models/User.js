import validator from "validator";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Mohon Masukkan Username Anda"],
    unique: [true, "Username Sudah Digunakan"],
  },
  email: {
    type: String,
    required: [true, "Mohon Masukkan Email Anda"],
    validate: {
      validator: validator.isEmail,
      message: "Email Tidak Valid | example@gmail.com",
    },
  },
  password: {
    type: String,
    required: [true, "Mohon Masukkan Password Anda"],
    minlength: [
      8,
      "Password Minimal 8 karakter | Terdiri dari huruf dan angka",
    ],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// userSchema.pre("save", async function () {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  console.log("Password Match:", isMatch); // Debug log
  return isMatch;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// export default User = mongoose.model("User", userSchema);
const User = mongoose.model("User", userSchema);

export default User;
