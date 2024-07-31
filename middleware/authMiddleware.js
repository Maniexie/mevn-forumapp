import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;
  if (!token) {
    console.log("Cek token:", req.body.token);
    return next(
      res.status(400).json({
        message: "Anda tidak boleh mengakses halaman ini | Unauthorized",
      })
    );
  }

  let decoded;

  try {
    decoded = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(
      res.status(400).json({
        message: "token yang di input tidak valid ",
      })
    );
  }

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      res.status(400).json({
        message: "user tidak ditemukan",
      })
    );
  }

  req.user = currentUser;

  next();
};
