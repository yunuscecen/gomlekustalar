const Page = require("../models/Page");

const getPublishedPages = async (req, res) => {
  try {
    const pages = await Page.find({
      isPublished: true,
    })
      .select("slug navLabel title hero seo order")
      .sort({
        order: 1,
      });

    res.status(200).json({
      success: true,
      count: pages.length,
      data: pages,
    });
  } catch (error) {
    console.error("Sayfalar alınamadı:", error);

    res.status(500).json({
      success: false,
      message: "Sayfalar alınırken bir hata oluştu.",
    });
  }
};

const getPageBySlug = async (req, res) => {
  try {
    const slug = req.params.slug.trim().toLowerCase();

    const page = await Page.findOne({
      slug,
      isPublished: true,
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Sayfa bulunamadı.",
      });
    }

    page.sections.sort((firstSection, secondSection) => {
      return firstSection.order - secondSection.order;
    });

    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error("Sayfa alınamadı:", error);

    return res.status(500).json({
      success: false,
      message: "Sayfa içeriği alınırken bir hata oluştu.",
    });
  }
};

module.exports = {
  getPublishedPages,
  getPageBySlug,
};