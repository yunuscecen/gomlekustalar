const Admin = require("../models/Admin");
const asyncHandler = require("../middleware/asyncHandler");

const {
  createAdminToken,
  setAdminCookie,
  clearAdminCookie,
} = require("../utils/adminToken");

const formatAdmin = (admin) => {
  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive,
    lastLoginAt: admin.lastLoginAt,
    createdAt: admin.createdAt,
  };
};

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "E-posta adresi ve şifre zorunludur.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const admin = await Admin.findOne({
    email: normalizedEmail,
    isActive: true,
  }).select("+password");

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: "E-posta adresi veya şifre hatalı.",
    });
  }

  const passwordMatches = await admin.comparePassword(password);

  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: "E-posta adresi veya şifre hatalı.",
    });
  }

  admin.lastLoginAt = new Date();

  await admin.save();

  const token = createAdminToken(admin);

  setAdminCookie(res, token);

  return res.status(200).json({
    success: true,
    message: "Yönetici girişi başarılı.",
    data: {
      admin: formatAdmin(admin),
    },
  });
});

const logoutAdmin = asyncHandler(async (req, res) => {
  clearAdminCookie(res);

  return res.status(200).json({
    success: true,
    message: "Yönetici oturumu kapatıldı.",
  });
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      admin: formatAdmin(req.admin),
    },
  });
});

const changeAdminPassword = asyncHandler(
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Mevcut şifre ve yeni şifre zorunludur.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Yeni şifre en az 8 karakter olmalıdır.",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Yeni şifre mevcut şifreden farklı olmalıdır.",
      });
    }

    const admin = await Admin.findById(
      req.admin._id
    ).select("+password");

    if (!admin || !admin.isActive) {
      return res.status(404).json({
        success: false,
        message: "Yönetici hesabı bulunamadı.",
      });
    }

    const passwordMatches =
      await admin.comparePassword(currentPassword);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Mevcut şifre yanlış.",
      });
    }

    admin.password = newPassword;

    await admin.save();

    const token = createAdminToken(admin);

    setAdminCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Yönetici şifresi başarıyla güncellendi.",
    });
  }
);

module.exports = {
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  changeAdminPassword,
};