const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
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
    value: {
      type: String,
      trim: true,
      default: "",
    },
    label: {
      type: String,
      trim: true,
      default: "",
    },
    icon: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    linkLabel: {
      type: String,
      trim: true,
      default: "",
    },
    link: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: false,
  }
);

const ctaSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      default: "",
    },
    href: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const sectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "text",
        "imageText",
        "cards",
        "steps",
        "stats",
        "cta",
        "contactForm",
      ],
    },
    eyebrow: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    paragraphs: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    imageAlt: {
      type: String,
      trim: true,
      default: "",
    },
    imagePosition: {
      type: String,
      enum: ["left", "right", "full"],
      default: "right",
    },
    items: {
      type: [itemSchema],
      default: [],
    },
    cta: {
      type: ctaSchema,
      default: () => ({
        label: "",
        href: "",
      }),
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

const heroSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    imageAlt: {
      type: String,
      trim: true,
      default: "",
    },
    primaryButtonLabel: {
      type: String,
      trim: true,
      default: "",
    },
    primaryButtonLink: {
      type: String,
      trim: true,
      default: "",
    },
    secondaryButtonLabel: {
      type: String,
      trim: true,
      default: "",
    },
    secondaryButtonLink: {
      type: String,
      trim: true,
      default: "",
    },
    overlayOpacity: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.45,
    },
  },
  {
    _id: false,
  }
);

const seoSchema = new mongoose.Schema(
  {
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
  {
    _id: false,
  }
);

const pageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    navLabel: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    hero: {
      type: heroSchema,
      required: true,
    },
    sections: {
      type: [sectionSchema],
      default: [],
    },
    seo: {
      type: seoSchema,
      default: () => ({
        title: "",
        description: "",
        keywords: [],
      }),
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

pageSchema.index({
  isPublished: 1,
  order: 1,
});

module.exports = mongoose.model("Page", pageSchema);