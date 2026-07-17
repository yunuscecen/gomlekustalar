const express = require("express");

const {
  getPublishedPages,
  getPageBySlug,
} = require("../controllers/pageController");

const router = express.Router();

router.get("/", getPublishedPages);
router.get("/:slug", getPageBySlug);

module.exports = router;