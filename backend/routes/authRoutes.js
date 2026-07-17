const express = require("express");

const {
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  changeAdminPassword,
} = require("../controllers/authController");

const {
  protectAdmin,
  requireAdminWriteHeader,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);

router.post(
  "/logout",
  requireAdminWriteHeader,
  logoutAdmin
);

router.get("/me", protectAdmin, getCurrentAdmin);

router.patch(
  "/password",
  protectAdmin,
  requireAdminWriteHeader,
  changeAdminPassword
);

module.exports = router;