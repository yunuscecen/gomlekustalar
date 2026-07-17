const Admin = require("../models/Admin");
const asyncHandler = require("./asyncHandler");

const {
  ADMIN_COOKIE_NAME,
  verifyAdminToken,
} = require("../utils/adminToken");

const createAuthError = (message) => {
  const error = new Error(message);
  error.statusCode = 401;

  return error;
};

const getRequestToken = (req) => {
  const cookieToken = req.cookies?.[ADMIN_COOKIE_NAME];

  if (cookieToken) {
    return cookieToken;
  }

  const authorizationHeader = req.headers.authorization;

  if (
    authorizationHeader &&
    authorizationHeader.startsWith("Bearer ")
  ) {
    return authorizationHeader.split(" ")[1];
  }

  return null;
};

const protectAdmin = asyncHandler(async (req, res, next) => {
  const token = getRequestToken(req);

  if (!token) {
    throw createAuthError(
      "Bu işlem için yönetici girişi yapmalısınız."
    );
  }

  const decodedToken = verifyAdminToken(token);

  const admin = await Admin.findById(decodedToken.sub).select(
    "-password"
  );

  if (!admin || !admin.isActive) {
    throw createAuthError(
      "Yönetici hesabı bulunamadı veya aktif değil."
    );
  }

  req.admin = admin;

  next();
});

const requireAdminWriteHeader = (req, res, next) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];

  if (safeMethods.includes(req.method)) {
    return next();
  }

  const adminRequestHeader = req.get("X-Admin-Request");

  if (adminRequestHeader !== "1") {
    return res.status(403).json({
      success: false,
      message:
        "Yönetim işlemi doğrulanamadı. Lütfen sayfayı yenileyerek tekrar deneyin.",
    });
  }

  return next();
};

module.exports = {
  protectAdmin,
  requireAdminWriteHeader,
};