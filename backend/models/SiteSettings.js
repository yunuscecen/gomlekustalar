const mongoose = require("mongoose");

const navigationItemSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    path: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: false,
  }
);

const socialLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      trim: true,
      default: "",
    },
    url: {
      type: String,
      trim: true,
      default: "",
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: false,
  }
);

const legalLinkSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      default: "",
    },
    path: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: false,
  }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "main",
    },
    brandName: {
      type: String,
      trim: true,
      default: "Ustalar Gömlek",
    },
    logo: {
      type: String,
      trim: true,
      default: "/images/logo.svg",
    },
    logoLight: {
      type: String,
      trim: true,
      default: "/images/logo-light.svg",
    },
    favicon: {
      type: String,
      trim: true,
      default: "/favicon.svg",
    },
    navigation: {
      type: [navigationItemSchema],
      default: [],
    },
    contact: {
      address: {
        type: String,
        trim: true,
        default: "",
      },
      phone: {
        type: String,
        trim: true,
        default: "",
      },
      secondaryPhone: {
        type: String,
        trim: true,
        default: "",
      },
      email: {
        type: String,
        trim: true,
        default: "",
      },
      mapLink: {
        type: String,
        trim: true,
        default: "",
      },
      mapEmbedUrl: {
        type: String,
        trim: true,
        default: "",
      },
      workingHours: {
        type: String,
        trim: true,
        default: "",
      },
    },
    socialLinks: {
      type: [socialLinkSchema],
      default: [],
    },
    footer: {
      description: {
        type: String,
        trim: true,
        default: "",
      },
      copyright: {
        type: String,
        trim: true,
        default: "",
      },
      legalLinks: {
        type: [legalLinkSchema],
        default: [],
      },
    },
    defaultSeo: {
      title: {
        type: String,
        trim: true,
        default: "",
      },
      description: {
        type: String,
        trim: true,
        default: "",
      },
      keywords: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);