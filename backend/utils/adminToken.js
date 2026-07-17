const jwt = require("jsonwebtoken");

const ADMIN_COOKIE_NAME = "ustalar_admin_token";

const getJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error(
      "JWT_SECRET bulunamadı. backend/.env dosyasını kontrol edin."
    );
  }

  return jwtSecret;
};

const createAdminToken = (admin) => {
  return jwt.sign(
    {
      sub: admin._id.toString(),
      role: admin.role,
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

const verifyAdminToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
};

const setAdminCookie = (res, token) => {
  res.cookie(
    ADMIN_COOKIE_NAME,
    token,
    getCookieOptions()
  );
};

const clearAdminCookie = (res) => {
  const cookieOptions = getCookieOptions();

  delete cookieOptions.maxAge;

  res.clearCookie(ADMIN_COOKIE_NAME, cookieOptions);
};

module.exports = {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  verifyAdminToken,
  setAdminCookie,
  clearAdminCookie,
};