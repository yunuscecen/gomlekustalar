const mongoose = require("mongoose");

const ContactMessage = require("../models/ContactMessage");
const asyncHandler = require("../middleware/asyncHandler");

const allowedStatuses = ["new", "read", "replied"];

const escapeRegExp = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getAdminMessages = asyncHandler(
  async (req, res) => {
    const requestedPage = Number.parseInt(req.query.page, 10);
    const requestedLimit = Number.parseInt(
      req.query.limit,
      10
    );

    const page =
      Number.isInteger(requestedPage) && requestedPage > 0
        ? requestedPage
        : 1;

    const limit =
      Number.isInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 50)
        : 10;

    const filter = {};

    if (
      req.query.status &&
      allowedStatuses.includes(req.query.status)
    ) {
      filter.status = req.query.status;
    }

    if (
      typeof req.query.search === "string" &&
      req.query.search.trim()
    ) {
      const safeSearch = escapeRegExp(
        req.query.search.trim()
      );

      filter.$or = [
        {
          name: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          email: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          company: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          subject: {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      ContactMessage.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),
      ContactMessage.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  }
);

const getAdminMessageById = asyncHandler(
  async (req, res) => {
    const { messageId } = req.params;

    if (!mongoose.isValidObjectId(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz mesaj bilgisi.",
      });
    }

    const message = await ContactMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "İletişim mesajı bulunamadı.",
      });
    }

    if (message.status === "new") {
      message.status = "read";
      await message.save();
    }

    return res.status(200).json({
      success: true,
      data: message,
    });
  }
);

const updateAdminMessage = asyncHandler(
  async (req, res) => {
    const { messageId } = req.params;
    const { status, adminNote } = req.body;

    if (!mongoose.isValidObjectId(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz mesaj bilgisi.",
      });
    }

    const message = await ContactMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Güncellenecek mesaj bulunamadı.",
      });
    }

    if (status !== undefined) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Mesaj durumu new, read veya replied olmalıdır.",
        });
      }

      message.status = status;
    }

    if (adminNote !== undefined) {
      if (typeof adminNote !== "string") {
        return res.status(400).json({
          success: false,
          message: "Yönetici notu metin olmalıdır.",
        });
      }

      message.adminNote = adminNote.trim();
    }

    await message.save();

    return res.status(200).json({
      success: true,
      message: "İletişim mesajı güncellendi.",
      data: message,
    });
  }
);

const deleteAdminMessage = asyncHandler(
  async (req, res) => {
    const { messageId } = req.params;

    if (!mongoose.isValidObjectId(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz mesaj bilgisi.",
      });
    }

    const message = await ContactMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Silinecek mesaj bulunamadı.",
      });
    }

    await message.deleteOne();

    return res.status(200).json({
      success: true,
      message: "İletişim mesajı silindi.",
    });
  }
);

module.exports = {
  getAdminMessages,
  getAdminMessageById,
  updateAdminMessage,
  deleteAdminMessage,
};