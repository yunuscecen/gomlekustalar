const express = require("express");

const {
  getAdminSiteSettings,
  updateAdminSiteSettings,
} = require("../controllers/adminSettingsController");

const {
  protectAdmin,
  requireAdminWriteHeader,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protectAdmin);

router.get("/", getAdminSiteSettings);

router.put(
  "/",
  requireAdminWriteHeader,
  updateAdminSiteSettings
);

module.exports = router;