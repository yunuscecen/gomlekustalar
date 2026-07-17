const ContactMessage = require("../models/ContactMessage");
const asyncHandler = require("../middleware/asyncHandler");

const normalizeText = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const createContactMessage = asyncHandler(
  async (req, res) => {
    const {
      name,
      email,
      phone,
      company,
      subject,
      message,
      website,
    } = req.body;

    /*
      website alanı formda kullanıcıya görünmeyen
      honeypot alanı olarak kullanılacak.

      Bot bu alanı doldurursa veritabanına
      kayıt yapılmadan başarılı cevap döndürülür.
    */
    if (typeof website === "string" && website.trim()) {
      return res.status(201).json({
        success: true,
        message:
          "Mesajınız başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.",
      });
    }

    const normalizedData = {
      name: normalizeText(name),
      email: normalizeText(email).toLowerCase(),
      phone: normalizeText(phone),
      company: normalizeText(company),
      subject: normalizeText(subject),
      message: normalizeText(message),
    };

    if (
      !normalizedData.name ||
      !normalizedData.email ||
      !normalizedData.subject ||
      !normalizedData.message
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Ad soyad, e-posta, konu ve mesaj alanları zorunludur.",
      });
    }

    if (!isValidEmail(normalizedData.email)) {
      return res.status(400).json({
        success: false,
        message: "Geçerli bir e-posta adresi yazmalısınız.",
      });
    }

    const contactMessage = await ContactMessage.create(
      normalizedData
    );

    return res.status(201).json({
      success: true,
      message:
        "Mesajınız başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.",
      data: {
        messageId: contactMessage._id,
      },
    });
  }
);

module.exports = {
  createContactMessage,
};