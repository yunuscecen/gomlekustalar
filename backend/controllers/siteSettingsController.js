const SiteSettings = require("../models/SiteSettings");

const getPublicSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne({
      key: "main",
    }).select("-__v");

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Site ayarları bulunamadı.",
      });
    }

    settings.navigation.sort((firstItem, secondItem) => {
      return firstItem.order - secondItem.order;
    });

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Site ayarları alınamadı:", error);

    return res.status(500).json({
      success: false,
      message: "Site ayarları alınırken bir hata oluştu.",
    });
  }
};

module.exports = {
  getPublicSiteSettings,
};