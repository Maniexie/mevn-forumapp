// Middleware untuk menangani 404 Not Found
const notFound = (req, res, next) => {
  const error = new Error("Not Found - " + req.originalUrl);
  error.statusCode = 404;
  next(error); // Pindahkan next(error) ke sini, dan hapus res.status(404)
};

// Middleware untuk menangani kesalahan
const errorHandler = (err, req, res, next) => {
  // Gunakan statusCode dari error atau default ke 500 jika tidak ada
  let statusCode = err.statusCode || 500;

  // Pesan kesalahan
  let message = err.message || "Internal Server Error";

  // Sesuaikan statusCode untuk CastError
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(404).json({
      message: "Resource not found",
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }

  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    statusCode = 400;
  }

  // Kirim respons kesalahan
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
