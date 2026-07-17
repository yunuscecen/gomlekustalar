const express = require("express");

const {
  getAdminPages,
  getAdminPageBySlug,
  updateAdminPage,
} = require("../controllers/adminPageController");

const {
  protectAdmin,
  requireAdminWriteHeader,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protectAdmin);

router.get("/", getAdminPages);

router.get("/:slug", getAdminPageBySlug);

router.put(
  "/:slug",
  requireAdminWriteHeader,
  updateAdminPage
);

module.exports = router;