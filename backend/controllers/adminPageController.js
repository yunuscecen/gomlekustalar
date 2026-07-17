const Page = require("../models/Page");
const asyncHandler = require("../middleware/asyncHandler");

const getAdminPages = asyncHandler(async (req, res) => {
  const pages = await Page.find()
    .select(
      "slug navLabel title hero.title hero.image order isPublished updatedAt"
    )
    .sort({
      order: 1,
    });

  return res.status(200).json({
    success: true,
    count: pages.length,
    data: pages,
  });
});

const getAdminPageBySlug = asyncHandler(
  async (req, res) => {
    const slug = req.params.slug.trim().toLowerCase();

    const page = await Page.findOne({
      slug,
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Düzenlenecek sayfa bulunamadı.",
      });
    }

    page.sections.sort((firstSection, secondSection) => {
      return firstSection.order - secondSection.order;
    });

    return res.status(200).json({
      success: true,
      data: page,
    });
  }
);

const updateAdminPage = asyncHandler(async (req, res) => {
  const slug = req.params.slug.trim().toLowerCase();

  const page = await Page.findOne({
    slug,
  });

  if (!page) {
    return res.status(404).json({
      success: false,
      message: "Güncellenecek sayfa bulunamadı.",
    });
  }

  const {
    navLabel,
    title,
    hero,
    sections,
    seo,
    order,
    isPublished,
  } = req.body;

  if (navLabel !== undefined) {
    page.navLabel = navLabel;
  }

  if (title !== undefined) {
    page.title = title;
  }

  if (hero !== undefined) {
    if (
      !hero ||
      typeof hero !== "object" ||
      Array.isArray(hero)
    ) {
      return res.status(400).json({
        success: false,
        message: "Hero alanı geçerli bir nesne olmalıdır.",
      });
    }

    const currentHero = page.hero
      ? page.hero.toObject()
      : {};

    page.hero = {
      ...currentHero,
      ...hero,
    };
  }

  if (sections !== undefined) {
    if (!Array.isArray(sections)) {
      return res.status(400).json({
        success: false,
        message: "Sayfa bölümleri bir liste olmalıdır.",
      });
    }

    page.sections = sections;
  }

  if (seo !== undefined) {
    if (
      !seo ||
      typeof seo !== "object" ||
      Array.isArray(seo)
    ) {
      return res.status(400).json({
        success: false,
        message: "SEO alanı geçerli bir nesne olmalıdır.",
      });
    }

    const currentSeo = page.seo
      ? page.seo.toObject()
      : {};

    page.seo = {
      ...currentSeo,
      ...seo,
    };
  }

  if (order !== undefined) {
    const parsedOrder = Number(order);

    if (!Number.isFinite(parsedOrder)) {
      return res.status(400).json({
        success: false,
        message: "Sayfa sırası geçerli bir sayı olmalıdır.",
      });
    }

    page.order = parsedOrder;
  }

  if (isPublished !== undefined) {
    page.isPublished = Boolean(isPublished);
  }

  await page.save();

  return res.status(200).json({
    success: true,
    message: `${page.title} sayfası başarıyla güncellendi.`,
    data: page,
  });
});

module.exports = {
  getAdminPages,
  getAdminPageBySlug,
  updateAdminPage,
};