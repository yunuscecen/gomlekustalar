const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "İstenen API adresi bulunamadı.",
  });
};

const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message =
    error.message ||
    "Sunucu tarafında beklenmeyen bir hata oluştu.";

  if (error.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(error.errors)
      .map((validationError) => validationError.message)
      .join(" ");
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Geçersiz kayıt bilgisi gönderildi.";
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = "Bu bilgilerle daha önce bir kayıt oluşturulmuş.";
  }

  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    message = "Yönetici oturumu geçersiz veya süresi dolmuş.";
  }

  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler,
};