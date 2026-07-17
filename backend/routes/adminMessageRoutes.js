const express = require("express");

const {
  getAdminMessages,
  getAdminMessageById,
  updateAdminMessage,
  deleteAdminMessage,
} = require("../controllers/adminMessageController");

const {
  protectAdmin,
  requireAdminWriteHeader,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protectAdmin);

router.get("/", getAdminMessages);

router.get("/:messageId", getAdminMessageById);

router.patch(
  "/:messageId",
  requireAdminWriteHeader,
  updateAdminMessage
);

router.delete(
  "/:messageId",
  requireAdminWriteHeader,
  deleteAdminMessage
);

module.exports = router;