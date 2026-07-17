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
const siteSettingsRoutes = require(
  "./routes/siteSettingsRoutes"
);
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminPageRoutes = require(
  "./routes/adminPageRoutes"
);
const adminSettingsRoutes = require(
  "./routes/adminSettingsRoutes"
);
const adminMessageRoutes = require(
  "./routes/adminMessageRoutes"
);

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const normalizeOrigin = (origin) => {
  return origin.trim().replace(/\/$/, "");
};

const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      /*
        Postman, Thunder Client ve sunucudan sunucuya
        gönderilen isteklerde origin bulunmayabilir.
      */
      if (!origin) {
        return callback(null, true);
      }

      const normalizedRequestOrigin =
        normalizeOrigin(origin);

      if (
        allowedOrigins.includes(normalizedRequestOrigin)
      ) {
        return callback(null, true);
      }

      const corsError = new Error(
        "Bu adresten gelen isteğe izin verilmiyor."
      );

      corsError.statusCode = 403;

      return callback(corsError);
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
    limit: "1mb",
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

/*
  Public API adresleri
*/
app.use("/api/pages", pageRoutes);
app.use("/api/settings", siteSettingsRoutes);
app.use("/api/contact", contactRoutes);

/*
  Admin kimlik doğrulama
*/
app.use("/api/auth", authRoutes);

/*
  Korumalı admin API adresleri
*/
app.use("/api/admin/pages", adminPageRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
app.use("/api/admin/messages", adminMessageRoutes);

/*
  Route ve genel hata yönetimi her zaman en sonda olmalı.
*/
app.use(notFound);
app.use(errorHandler);

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