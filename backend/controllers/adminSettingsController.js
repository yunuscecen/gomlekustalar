const SiteSettings = require("../models/SiteSettings");
const asyncHandler = require("../middleware/asyncHandler");

const SOCIAL_PLATFORMS = [
  "instagram",
  "linkedin",
  "facebook",
  "youtube",
];

const cleanString = (value, fallback = "") => {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim();
};

const getSocialUrl = (socialLinks, platform) => {
  if (!Array.isArray(socialLinks)) {
    return "";
  }

  const socialLink = socialLinks.find(
    (item) =>
      String(item.platform || "").toLowerCase() ===
      platform
  );

  return socialLink?.url || "";
};

const formatSettingsForAdmin = (settingsDocument) => {
  const settings =
    typeof settingsDocument.toObject === "function"
      ? settingsDocument.toObject()
      : settingsDocument;

  return {
    _id: settings._id,
    key: settings.key,

    brand: {
      name:
        settings.brandName || "Ustalar Gömlek",

      shortName:
        settings.brandShortName || "UG",

      tagline:
        settings.brandTagline || "",
    },

    logo: {
      dark: settings.logo || "",
      light: settings.logoLight || "",
      favicon: settings.favicon || "",
    },

    navigation: Array.isArray(settings.navigation)
      ? settings.navigation
      : [],

    contact: {
      address:
        settings.contact?.address || "",

      phone:
        settings.contact?.phone || "",

      secondaryPhone:
        settings.contact?.secondaryPhone || "",

      email:
        settings.contact?.email || "",

      workingHours:
        settings.contact?.workingHours || "",

      mapUrl:
        settings.contact?.mapLink ||
        settings.contact?.mapEmbedUrl ||
        "",
    },

    socialLinks: {
      instagram: getSocialUrl(
        settings.socialLinks,
        "instagram"
      ),

      linkedin: getSocialUrl(
        settings.socialLinks,
        "linkedin"
      ),

      facebook: getSocialUrl(
        settings.socialLinks,
        "facebook"
      ),

      youtube: getSocialUrl(
        settings.socialLinks,
        "youtube"
      ),
    },

    footer: {
      description:
        settings.footer?.description || "",

      copyright:
        settings.footer?.copyright || "",

      legalLinks: Array.isArray(
        settings.footer?.legalLinks
      )
        ? settings.footer.legalLinks
        : [],
    },

    defaultSeo: {
      title:
        settings.defaultSeo?.title || "",

      description:
        settings.defaultSeo?.description || "",

      keywords: Array.isArray(
        settings.defaultSeo?.keywords
      )
        ? settings.defaultSeo.keywords
        : [],
    },

    createdAt: settings.createdAt,
    updatedAt: settings.updatedAt,
  };
};

const normalizeSocialLinks = (socialLinks) => {
  /*
    Eski liste yapısı gönderilirse onu da kabul ediyoruz.
  */
  if (Array.isArray(socialLinks)) {
    return socialLinks
      .map((item) => ({
        platform: cleanString(
          item?.platform
        ).toLowerCase(),

        url: cleanString(item?.url),

        isVisible:
          item?.isVisible !== false,
      }))
      .filter(
        (item) =>
          item.platform &&
          item.url
      );
  }

  /*
    Admin frontend'inin gönderdiği nesne yapısı:
    {
      instagram: "",
      linkedin: "",
      facebook: "",
      youtube: ""
    }
  */
  if (
    socialLinks &&
    typeof socialLinks === "object"
  ) {
    return SOCIAL_PLATFORMS.map(
      (platform) => ({
        platform,
        url: cleanString(
          socialLinks[platform]
        ),
        isVisible: true,
      })
    ).filter((item) => item.url);
  }

  /*
    Alan boş veya null gönderilirse sosyal medya
    bağlantılarını boş liste yapıyoruz.
  */
  return [];
};

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
      data: formatSettingsForAdmin(settings),
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
        message:
          "Güncellenecek site ayarları bulunamadı.",
      });
    }

    const currentSettings = settings.toObject();

    const {
      brand,
      brandName,
      brandShortName,
      brandTagline,

      logo,
      logoLight,
      favicon,

      navigation,
      contact,
      socialLinks,
      footer,
      defaultSeo,
    } = req.body;

    /*
      MARKA BİLGİLERİ

      Yeni admin frontend'i:
      brand: {
        name,
        shortName,
        tagline
      }

      Eski düz alanları da destekliyoruz.
    */
    if (brand !== undefined) {
      if (
        !brand ||
        typeof brand !== "object" ||
        Array.isArray(brand)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Marka bilgileri geçerli bir nesne olmalıdır.",
        });
      }

      if (brand.name !== undefined) {
        settings.brandName = cleanString(
          brand.name,
          settings.brandName
        );
      }

      if (brand.shortName !== undefined) {
        settings.brandShortName = cleanString(
          brand.shortName,
          settings.brandShortName
        );
      }

      if (brand.tagline !== undefined) {
        settings.brandTagline = cleanString(
          brand.tagline
        );
      }
    }

    if (brandName !== undefined) {
      settings.brandName = cleanString(
        brandName,
        settings.brandName
      );
    }

    if (brandShortName !== undefined) {
      settings.brandShortName = cleanString(
        brandShortName,
        settings.brandShortName
      );
    }

    if (brandTagline !== undefined) {
      settings.brandTagline =
        cleanString(brandTagline);
    }

    /*
      LOGO BİLGİLERİ

      Yeni frontend:
      logo: {
        dark,
        light,
        favicon
      }

      Eski string logo alanını da destekliyoruz.
    */
    if (logo !== undefined) {
      if (typeof logo === "string") {
        settings.logo = cleanString(logo);
      } else if (
        logo &&
        typeof logo === "object" &&
        !Array.isArray(logo)
      ) {
        if (logo.dark !== undefined) {
          settings.logo = cleanString(
            logo.dark
          );
        }

        if (logo.light !== undefined) {
          settings.logoLight = cleanString(
            logo.light
          );
        }

        if (logo.favicon !== undefined) {
          settings.favicon = cleanString(
            logo.favicon
          );
        }
      } else {
        return res.status(400).json({
          success: false,
          message:
            "Logo bilgileri geçerli bir nesne veya metin olmalıdır.",
        });
      }
    }

    if (logoLight !== undefined) {
      settings.logoLight =
        cleanString(logoLight);
    }

    if (favicon !== undefined) {
      settings.favicon =
        cleanString(favicon);
    }

    /*
      MENÜ
    */
    if (navigation !== undefined) {
      if (!Array.isArray(navigation)) {
        return res.status(400).json({
          success: false,
          message:
            "Menü bağlantıları bir liste olmalıdır.",
        });
      }

      const invalidNavigationItem =
        navigation.find(
          (item) =>
            !cleanString(item?.label) ||
            !cleanString(item?.path)
        );

      if (invalidNavigationItem) {
        return res.status(400).json({
          success: false,
          message:
            "Menü bağlantılarının adı ve yolu boş bırakılamaz.",
        });
      }

      settings.navigation = navigation.map(
        (item, index) => ({
          label: cleanString(item.label),
          path: cleanString(item.path),

          order:
            Number.isFinite(Number(item.order))
              ? Number(item.order)
              : index + 1,

          isVisible:
            item.isVisible !== false,
        })
      );
    }

    /*
      İLETİŞİM
    */
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

      const currentContact =
        currentSettings.contact || {};

      settings.contact = {
        address:
          contact.address !== undefined
            ? cleanString(contact.address)
            : currentContact.address || "",

        phone:
          contact.phone !== undefined
            ? cleanString(contact.phone)
            : currentContact.phone || "",

        secondaryPhone:
          contact.secondaryPhone !== undefined
            ? cleanString(
                contact.secondaryPhone
              )
            : currentContact.secondaryPhone ||
              "",

        email:
          contact.email !== undefined
            ? cleanString(contact.email)
            : currentContact.email || "",

        mapLink:
          contact.mapUrl !== undefined
            ? cleanString(contact.mapUrl)
            : contact.mapLink !== undefined
              ? cleanString(contact.mapLink)
              : currentContact.mapLink || "",

        mapEmbedUrl:
          contact.mapEmbedUrl !== undefined
            ? cleanString(
                contact.mapEmbedUrl
              )
            : currentContact.mapEmbedUrl ||
              "",

        workingHours:
          contact.workingHours !== undefined
            ? cleanString(
                contact.workingHours
              )
            : currentContact.workingHours ||
              "",
      };
    }

    /*
      SOSYAL MEDYA

      Hiçbir sosyal medya hesabı zorunlu değildir.
      Bütün alanlar boş gönderilirse [] kaydedilir.
    */
    if (socialLinks !== undefined) {
      settings.socialLinks =
        normalizeSocialLinks(socialLinks);
    }

    /*
      FOOTER
    */
    if (footer !== undefined) {
      if (
        !footer ||
        typeof footer !== "object" ||
        Array.isArray(footer)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Footer alanı geçerli bir nesne olmalıdır.",
        });
      }

      const currentFooter =
        currentSettings.footer || {};

      settings.footer = {
        description:
          footer.description !== undefined
            ? cleanString(
                footer.description
              )
            : currentFooter.description || "",

        copyright:
          footer.copyright !== undefined
            ? cleanString(
                footer.copyright
              )
            : currentFooter.copyright || "",

        legalLinks: Array.isArray(
          footer.legalLinks
        )
          ? footer.legalLinks
          : currentFooter.legalLinks || [],
      };
    }

    /*
      VARSAYILAN SEO
    */
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

      const currentSeo =
        currentSettings.defaultSeo || {};

      settings.defaultSeo = {
        title:
          defaultSeo.title !== undefined
            ? cleanString(defaultSeo.title)
            : currentSeo.title || "",

        description:
          defaultSeo.description !== undefined
            ? cleanString(
                defaultSeo.description
              )
            : currentSeo.description || "",

        keywords: Array.isArray(
          defaultSeo.keywords
        )
          ? defaultSeo.keywords
              .map((keyword) =>
                cleanString(keyword)
              )
              .filter(Boolean)
          : currentSeo.keywords || [],
      };
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message:
        "Site ayarları başarıyla güncellendi.",
      data: formatSettingsForAdmin(settings),
    });
  }
);

module.exports = {
  getAdminSiteSettings,
  updateAdminSiteSettings,
};