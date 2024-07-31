// export const loginUser = (req, res) => {
//   res.send("Login User Berhasil");
// };

// export const RegisterUser = (req, res) => {
//   res.send("Register User Berhasil");
// };

// export const logoutUser = (req, res) => {
//   res.send("Logout User Berhasil");
// };

// export const getUser = (req, res) => {
//   res.send("Get user Berhasil");
// };

import express from "express";
import {
  loginUser,
  RegisterUser,
  logoutUser,
  getUser,
} from "../controllers/authController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser", authMiddleware, getUser);

export default router;
