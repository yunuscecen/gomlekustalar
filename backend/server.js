const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const connectDB = require("./config/db");
const pageRoutes = require("./routes/pageRoutes");
const siteSettingsRoutes = require("./routes/siteSettingsRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim());

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Bu adresten gelen isteğe izin verilmiyor.")
      );
    },
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Ustalar Gömlek API çalışıyor.",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

app.use("/api/pages", pageRoutes);
app.use("/api/settings", siteSettingsRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "İstenen API adresi bulunamadı.",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.statusCode || 500).json({
    success: false,
    message:
      error.message ||
      "Sunucu tarafında beklenmeyen bir hata oluştu.",
  });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `API http://localhost:${PORT} adresinde çalışıyor.`
      );
    });
  } catch (error) {
    console.error("Sunucu başlatılamadı:");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();