import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRouter from "./router/authRouter.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config(); // penghubung antara .env dan app.js

const app = express();
const port = 3000;

// == MIDDLEWARE ==
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_DEV === "development") {
  app.use(morgan("dev"));
}
// == END MIDDLEWARE ==

// == PARENT ROUTER ==
app.use("/api/v1/auth", authRouter);

app.use("/api/auth", authRouter);

app.use(notFound);
app.use(errorHandler);
// == END PARENT ROUTER ==

app.use((err, req, res, next) => {
  // Tangani error di sini
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });

  next();
});

// == ENTPOINT / ENTRY POINT ==

// app.get("/", (req, res) => {
//   res.send("Selamat Hello World! HEHEHE");
// });

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Message dari Express JS | Saya tambah!!",
  });
  next();
});

app.listen(port, () => {
  console.log(`Aplikasi berjalan di port : ${port}`);
});

// == END ENTPOINT / ENTRY POINT ==

// == KONEKSI KE DATABASE ==
mongoose.connect(process.env.DATABASE, {}).then(() => {
  console.log("Database Connected"); // menampilkan pesan jika berhasil connect
});
// == END KONEKSI KE DATABASE ==

/* */
