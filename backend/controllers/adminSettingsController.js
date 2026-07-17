const SiteSettings = require("../models/SiteSettings");
const asyncHandler = require("../middleware/asyncHandler");

const getAdminSiteSettings = asyncHandler(
  async (req, res) => {
    const settings = await SiteSettings.findOne({
      key: "main",
    });

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Site ayarları bulunamadı.",
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  }
);

const updateAdminSiteSettings = asyncHandler(
  async (req, res) => {
    const settings = await SiteSettings.findOne({
      key: "main",
    });

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Güncellenecek site ayarları bulunamadı.",
      });
    }

    const currentSettings = settings.toObject();

    const {
      brandName,
      logo,
      logoLight,
      favicon,
      navigation,
      contact,
      socialLinks,
      footer,
      defaultSeo,
    } = req.body;

    if (brandName !== undefined) {
      settings.brandName = brandName;
    }

    if (logo !== undefined) {
      settings.logo = logo;
    }

    if (logoLight !== undefined) {
      settings.logoLight = logoLight;
    }

    if (favicon !== undefined) {
      settings.favicon = favicon;
    }

    if (navigation !== undefined) {
      if (!Array.isArray(navigation)) {
        return res.status(400).json({
          success: false,
          message: "Menü bağlantıları bir liste olmalıdır.",
        });
      }

      settings.navigation = navigation;
    }

    if (contact !== undefined) {
      if (
        !contact ||
        typeof contact !== "object" ||
        Array.isArray(contact)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "İletişim ayarları geçerli bir nesne olmalıdır.",
        });
      }

      settings.contact = {
        ...currentSettings.contact,
        ...contact,
      };
    }

    if (socialLinks !== undefined) {
      if (!Array.isArray(socialLinks)) {
        return res.status(400).json({
          success: false,
          message:
            "Sosyal medya bağlantıları bir liste olmalıdır.",
        });
      }

      settings.socialLinks = socialLinks;
    }

    if (footer !== undefined) {
      if (
        !footer ||
        typeof footer !== "object" ||
        Array.isArray(footer)
      ) {
        return res.status(400).json({
          success: false,
          message: "Footer alanı geçerli bir nesne olmalıdır.",
        });
      }

      settings.footer = {
        ...currentSettings.footer,
        ...footer,
      };
    }

    if (defaultSeo !== undefined) {
      if (
        !defaultSeo ||
        typeof defaultSeo !== "object" ||
        Array.isArray(defaultSeo)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Varsayılan SEO alanı geçerli bir nesne olmalıdır.",
        });
      }

      settings.defaultSeo = {
        ...currentSettings.defaultSeo,
        ...defaultSeo,
      };
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Site ayarları başarıyla güncellendi.",
      data: settings,
    });
  }
);

module.exports = {
  getAdminSiteSettings,
  updateAdminSiteSettings,
};