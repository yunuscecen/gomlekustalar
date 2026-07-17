const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI bulunamadı. Lütfen backend/.env dosyasını kontrol edin."
    );
  }

  const connection = await mongoose.connect(mongoUri);

  console.log(
    `MongoDB bağlantısı başarılı: ${connection.connection.host}/${connection.connection.name}`
  );
};

module.exports = connectDB;