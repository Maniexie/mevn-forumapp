import User from "../models/User.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const expiredToken = 6 * 24 * 60 * 60 * 1000;

  const cookieOption = {
    expire: new Date(Date.now() + expiredToken),
    httpOnly: true,
    security: false,
  };
  res.cookie("jwt", token, cookieOption);
  user.password = undefined;
  res.status(statusCode).json({
    data: user,
  });
};

export const RegisterUser = asyncHandler(async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;

  const role = isFirstAccount ? "admin" : "user";

  const createUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role,
  });
  createSendToken(createUser, 201, res);
});

export const loginUser = asyncHandler(async (req, res) => {
  // Log input untuk debugging
  console.log("Email:", req.body.email);
  console.log("Password:", req.body.password);

  // validasi jika email dan password tidak di isi
  if (!req.body.email && !req.body.password) {
    res.status(400);
    throw new Error("Email dan Password harus di isi");
  }

  // cek jika email yang di input sudah terdaftar di database
  const userData = await User.findOne({
    email: req.body.email,
  });

  if (userData && (await userData.comparePassword(req.body.password))) {
    console.log("Berhasil - User Data:", userData);
    createSendToken(userData, 200, res);
  } else {
    console.log(" Gagal - User Data:", userData);
    res.status(400);
    throw new Error("Email / Password salah");
  }
});

export const logoutUser = (req, res) => {
  res.send("Logout User Berhasil");
};

export const getUser = (req, res) => {
  res.send("Get user Berhasil");
};
