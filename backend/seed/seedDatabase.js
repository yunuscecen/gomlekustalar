const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const connectDB = require("../config/db");
const Page = require("../models/Page");
const SiteSettings = require("../models/SiteSettings");
const Admin = require("../models/Admin");

const pages = [
  {
    slug: "anasayfa",
    navLabel: "Anasayfa",
    title: "Anasayfa",
    order: 0,
    isPublished: true,
    hero: {
      eyebrow: "USTALAR GÖMLEK",
      title: "Gömleğin her aşamasında ustalık.",
      description:
        "Tasarımdan üretime, kalite kontrolden paketlemeye kadar markalara özel gömlek üretimi.",
      image: "/hero.jpg",
      imageAlt: "Ustalar Gömlek üretim ve gömlek detayları",
      primaryButtonLabel: "Üretim Gücümüz",
      primaryButtonLink: "/uretim",
      secondaryButtonLabel: "Bizimle İletişime Geçin",
      secondaryButtonLink: "/iletisim",
      overlayOpacity: 0.52,
    },
    sections: [
      {
        key: "home-about",
        type: "imageText",
        eyebrow: "HAKKIMIZDA",
        title: "Markalar için güvenilir üretim ortaklığı",
        paragraphs: [
          "2022 yılında İstanbul’da kurulan Ustalar Gömlek, kalite ve güveni temel alan modern bir üretim anlayışıyla faaliyet göstermektedir.",
          "Uzman ekibimiz ve aylık 20.000 adet üretim kapasitemizle yerli ve uluslararası markalara yüksek standartlarda üretim hizmeti sunuyoruz.",
        ],
        image: "/images/home/home-about.webp",
        imageAlt: "Gömlek kumaşı ve üretim detayları",
        imagePosition: "left",
        cta: {
          label: "Bizi Tanıyın",
          href: "/hakkimizda",
        },
        order: 1,
        isVisible: true,
      },
      {
        key: "home-services",
        type: "cards",
        eyebrow: "UZMANLIK ALANLARIMIZ",
        title: "Fikirden teslimata bütüncül yaklaşım",
        description:
          "Markaların koleksiyon ihtiyaçlarını tasarım, üretim ve ihracat süreçlerinde bütüncül olarak ele alıyoruz.",
        items: [
          {
            title: "Tasarım",
            description:
              "Marka kimliğine, sezona ve hedef kitleye uygun ürün geliştirme çalışmaları.",
            image: "/tasarim.jpg",
            linkLabel: "Tasarımı İnceleyin",
            link: "/tasarim",
          },
          {
            title: "Üretim",
            description:
              "Kesimden dikime, kalite kontrolden paketlemeye kadar kontrollü üretim.",
            image: "/uretim.jpg",
            linkLabel: "Üretimi İnceleyin",
            link: "/uretim",
          },
          {
            title: "İhracat",
            description:
              "Avrupa ülkelerindeki markalara düzenli iletişim ve planlı teslimat yaklaşımı.",
            image: "/ihracat.jpg",
            linkLabel: "İhracatı İnceleyin",
            link: "/ihracat",
          },
        ],
        order: 2,
        isVisible: true,
      },
      {
        key: "home-products",
        type: "cards",
        eyebrow: "ÜRÜN GRUPLARI",
        title: "Farklı koleksiyonlara özel üretim",
        items: [
          {
            title: "Klasik",
            description: "Zamansız ve özenli gömlek koleksiyonları.",
          },
          {
            title: "Spor",
            description: "Günlük kullanıma uygun modern ürünler.",
          },
          {
            title: "Casual",
            description: "Konfor ve görünümü bir araya getiren modeller.",
          },
          {
            title: "Overshirt",
            description: "Katmanlı kullanım için güçlü ve işlevsel parçalar.",
          },
          {
            title: "Örme",
            description: "Esnek yapı ve konfor odaklı örme ürünler.",
          },
        ],
        order: 3,
        isVisible: true,
      },
      {
        key: "home-process",
        type: "steps",
        eyebrow: "ÜRETİM SÜRECİ",
        title: "Her adımda aynı özen",
        items: [
          {
            value: "01",
            title: "Tasarım",
            description: "Ürün fikri ve teknik detayların belirlenmesi.",
          },
          {
            value: "02",
            title: "Numune",
            description: "Model, kalıp ve ölçülerin üretim öncesi test edilmesi.",
          },
          {
            value: "03",
            title: "Kesim",
            description: "Planlanan ölçülere göre kontrollü kumaş kesimi.",
          },
          {
            value: "04",
            title: "Dikim",
            description: "Deneyimli ekip tarafından gerçekleştirilen üretim.",
          },
          {
            value: "05",
            title: "Kalite Kontrol",
            description: "Ürünlerin belirlenen standartlara göre incelenmesi.",
          },
          {
            value: "06",
            title: "Paketleme",
            description: "Sevkiyata hazır, düzenli ve güvenli paketleme.",
          },
        ],
        order: 4,
        isVisible: true,
      },
      {
        key: "home-contact-cta",
        type: "cta",
        eyebrow: "YENİ BİR KOLEKSİYON MU PLANLIYORSUNUZ?",
        title: "Üretim ihtiyaçlarınızı birlikte değerlendirelim.",
        description:
          "Projeniz, ürün grubunuz ve üretim adetleriniz hakkında ekibimizle iletişime geçebilirsiniz.",
        cta: {
          label: "İletişime Geçin",
          href: "/iletisim",
        },
        order: 5,
        isVisible: true,
      },
    ],
    seo: {
      title: "Ustalar Gömlek | Gömlek Üretimi",
      description:
        "Ustalar Gömlek; tasarım, numune, kesim, dikim, kalite kontrol ve paketleme süreçlerinde markalara özel üretim hizmeti sunar.",
      keywords: [
        "gömlek üretimi",
        "gömlek imalatı",
        "İstanbul gömlek üreticisi",
        "özel üretim gömlek",
      ],
    },
  },
  {
    slug: "hakkimizda",
    navLabel: "Hakkımızda",
    title: "Hakkımızda",
    order: 1,
    isPublished: true,
    hero: {
      eyebrow: "01 / HAKKIMIZDA",
      title: "Güvene dayalı üretim ortaklığı.",
      description:
        "Kaliteli işçilik, planlı üretim ve uzun vadeli iş birlikleri.",
      image: "/title.jpg",
      imageAlt: "Ustalar Gömlek ekibi ve üretim detayları",
      overlayOpacity: 0.55,
    },
    sections: [
      {
        key: "about-story",
        type: "imageText",
        eyebrow: "BİZ KİMİZ?",
        title: "Her projeye aynı özen ve hassasiyet",
        paragraphs: [
          "2022 yılında İstanbul’da kurulan firmamız, gömlek üretiminde kalite ve güveni temel alan modern bir üretim anlayışıyla faaliyet göstermektedir.",
          "Kuruluşumuzdan bu yana birçok Avrupa ülkesindeki markalarla iş birliği yaparak uluslararası kalite beklentilerini karşılayan üretim süreçleri geliştirdik.",
          "Uzman ekibimiz ve aylık 20.000 adet üretim kapasitemizle yerli ve uluslararası markalara yüksek standartlarda üretim hizmeti sunuyoruz.",
          "Spor, klasik, örme, overshirt ve casual başta olmak üzere geniş bir ürün yelpazesinde hizmet vermekteyiz.",
          "Tasarımdan kesime, dikimden kalite kontrole ve paketlemeye kadar tüm üretim süreçlerini titizlikle yönetiyoruz. Esnek üretim yapımız sayesinde markalarımızın ihtiyaçlarına özel çözümler sunuyoruz.",
          "Müşterilerimiz için yalnızca bir üretici değil, güvenilir ve uzun vadeli bir iş ortağı olmayı hedefliyoruz. Kaliteli işçilik, zamanında teslimat ve müşteri memnuniyetini ön planda tutuyoruz.",
        ],
        image: "/hakkimizda.jpg",
        imageAlt: "Gömlek üretiminde işçilik detayı",
        imagePosition: "right",
        order: 1,
        isVisible: true,
      },
      {
        key: "about-numbers",
        type: "stats",
        eyebrow: "USTALAR GÖMLEK",
        title: "Üretim gücümüz",
        items: [
          {
            value: "2022",
            label: "Kuruluş yılı",
          },
          {
            value: "20.000",
            label: "Aylık üretim kapasitesi",
          },
          {
            value: "5+",
            label: "Ana ürün grubu",
          },
          {
            value: "Avrupa",
            label: "Uluslararası iş birlikleri",
          },
        ],
        order: 2,
        isVisible: true,
      },
      {
        key: "about-values",
        type: "cards",
        eyebrow: "ÇALIŞMA YAKLAŞIMIMIZ",
        title: "İşimizin temelinde güven var",
        items: [
          {
            title: "Kaliteli İşçilik",
            description:
              "Üretimin her aşamasında detaylara önem veren kontrollü çalışma.",
          },
          {
            title: "Zamanında Teslimat",
            description:
              "Planlama ve süreç takibiyle termin hedeflerine bağlı üretim.",
          },
          {
            title: "Esnek Üretim",
            description:
              "Farklı ürün grupları ve marka ihtiyaçlarına uygun çözümler.",
          },
          {
            title: "Uzun Vadeli İş Ortaklığı",
            description:
              "Açık iletişim ve karşılıklı güvene dayalı iş birliği.",
          },
        ],
        order: 3,
        isVisible: true,
      },
    ],
    seo: {
      title: "Hakkımızda | Ustalar Gömlek",
      description:
        "Ustalar Gömlek’in üretim yaklaşımı, uzmanlığı ve gömlek üretim kapasitesi hakkında bilgi alın.",
      keywords: [
        "Ustalar Gömlek",
        "gömlek üreticisi",
        "gömlek imalat firması",
      ],
    },
  },
  {
    slug: "tasarim",
    navLabel: "Tasarım",
    title: "Tasarım",
    order: 2,
    isPublished: true,
    hero: {
      eyebrow: "02 / TASARIM",
      title: "Fikirleri üretilebilir ürünlere dönüştürüyoruz.",
      description:
        "Marka kimliği, kullanım amacı ve koleksiyon ihtiyaçlarına özel ürün geliştirme.",
      image: "/title.jpg",
      imageAlt: "Gömlek tasarım ve ürün geliştirme çalışmaları",
      overlayOpacity: 0.48,
    },
    sections: [
      {
        key: "design-intro",
        type: "imageText",
        eyebrow: "TASARIM VE ÜRÜN GELİŞTİRME",
        title: "Tasarımdan ürüne bütüncül yaklaşım",
        paragraphs: [
          "Ustalar Gömlek, tasarım ve ürün geliştirme sürecini markaların kimliği, hedef kitlesi ve koleksiyon ihtiyaçları doğrultusunda planlamaktadır. Spor, klasik, örme, overshirt ve casual gömlek gruplarında farklı kullanım alanlarına uygun ürünler geliştiriyoruz.",
          "Model detaylarından kumaş seçimine, renk alternatiflerinden aksesuar kullanımına kadar her aşamayı müşteri beklentileriyle birlikte değerlendiriyoruz. Tasarım sürecini üretilebilirlik, kullanım konforu ve kalite standartlarıyla birlikte ele alıyoruz.",
          "Hazırlanan tasarımlar numune süreciyle test edilerek kalıp, ölçü, dikiş ve malzeme detayları üretim öncesinde netleştirilir.",
        ],
        image: "/tasarim.jpg",
        imageAlt: "Gömlek kalıbı, kumaş ve tasarım detayları",
        imagePosition: "left",
        order: 1,
        isVisible: true,
      },
      {
        key: "design-services",
        type: "cards",
        eyebrow: "NELER YAPIYORUZ?",
        title: "Kontrollü ürün geliştirme süreci",
        items: [
          {
            title: "Koleksiyon Geliştirme",
            description:
              "Markanın tarzına ve sezon ihtiyaçlarına uygun ürün fikirleri.",
          },
          {
            title: "Kumaş ve Aksesuar",
            description:
              "Ürünün kullanım amacına uygun malzeme alternatifleri.",
          },
          {
            title: "Kalıp ve Model",
            description:
              "Ölçü, form ve ürün detaylarının teknik olarak hazırlanması.",
          },
          {
            title: "Numune Hazırlama",
            description:
              "Seri üretim öncesinde görünüm ve uygulanabilirlik kontrolü.",
          },
        ],
        order: 2,
        isVisible: true,
      },
    ],
    seo: {
      title: "Tasarım ve Ürün Geliştirme | Ustalar Gömlek",
      description:
        "Markalara özel gömlek tasarımı, ürün geliştirme, kumaş seçimi, kalıp ve numune süreçleri.",
      keywords: [
        "gömlek tasarımı",
        "ürün geliştirme",
        "gömlek numunesi",
        "koleksiyon geliştirme",
      ],
    },
  },
  {
    slug: "uretim",
    navLabel: "Üretim",
    title: "Üretim",
    order: 3,
    isPublished: true,
    hero: {
      eyebrow: "03 / ÜRETİM",
      title: "Her aşamada kontrollü üretim.",
      description:
        "Aylık 20.000 adet kapasiteyle planlı, esnek ve özenli gömlek üretimi.",
      image: "/title.jpg",
      imageAlt: "Ustalar Gömlek üretim alanı",
      overlayOpacity: 0.5,
    },
    sections: [
      {
        key: "production-intro",
        type: "imageText",
        eyebrow: "ÜRETİM GÜCÜ",
        title: "Kaliteli işçilik ve planlı üretim",
        paragraphs: [
          "Ustalar Gömlek, aylık 20.000 adet üretim kapasitesiyle yerli ve uluslararası markalara gömlek üretim hizmeti sunmaktadır. Üretim sürecimiz planlama, kesim, dikim, kalite kontrol, ütü ve paketleme aşamalarından oluşmaktadır.",
          "Her proje; ürün tipi, kumaş özelliği, adet, teslimat planı ve kalite beklentileri dikkate alınarak ayrı şekilde değerlendirilir.",
          "Esnek üretim yapımız sayesinde spor, klasik, örme, overshirt ve casual ürün gruplarında markaların farklı koleksiyon ihtiyaçlarına uygun çözümler sunuyoruz.",
        ],
        image: "/uretim.jpg",
        imageAlt: "Gömlek dikim ve üretim süreci",
        imagePosition: "right",
        order: 1,
        isVisible: true,
      },
      {
        key: "production-steps",
        type: "steps",
        eyebrow: "ADIM ADIM ÜRETİM",
        title: "Fikirden paketlemeye",
        items: [
          {
            value: "01",
            title: "Planlama",
            description:
              "Ürün özellikleri, adet ve teslimat planının belirlenmesi.",
          },
          {
            value: "02",
            title: "Numune",
            description:
              "Kalıp, ölçü ve model detaylarının üretim öncesi kontrolü.",
          },
          {
            value: "03",
            title: "Kesim",
            description:
              "Kumaşların belirlenen ölçü ve yerleşime göre hazırlanması.",
          },
          {
            value: "04",
            title: "Dikim",
            description:
              "Ürün detaylarına uygun, kontrollü birleştirme ve işçilik.",
          },
          {
            value: "05",
            title: "Kalite Kontrol",
            description:
              "Ölçü, dikiş, görünüm ve ürün detaylarının incelenmesi.",
          },
          {
            value: "06",
            title: "Paketleme",
            description:
              "Onaylanan ürünlerin sevkiyata uygun şekilde hazırlanması.",
          },
        ],
        order: 2,
        isVisible: true,
      },
    ],
    seo: {
      title: "Gömlek Üretimi | Ustalar Gömlek",
      description:
        "Aylık 20.000 adet kapasiteyle tasarım, numune, kesim, dikim, kalite kontrol ve paketleme hizmetleri.",
      keywords: [
        "gömlek üretimi",
        "gömlek fabrikası",
        "özel üretim gömlek",
        "gömlek dikimi",
      ],
    },
  },
  {
    slug: "ihracat",
    navLabel: "İhracat",
    title: "İhracat",
    order: 4,
    isPublished: true,
    hero: {
      eyebrow: "04 / İHRACAT",
      title: "Sınırların ötesinde güvenilir iş ortaklığı.",
      description:
        "Avrupa ülkelerindeki markalar için planlı üretim ve düzenli iletişim.",
      image: "/title.jpg",
      imageAlt: "Gömlek ihracatı ve sevkiyat hazırlığı",
      overlayOpacity: 0.52,
    },
    sections: [
      {
        key: "export-intro",
        type: "imageText",
        eyebrow: "ULUSLARARASI ÜRETİM",
        title: "Avrupa markaları için güvenilir üretim ortağı",
        paragraphs: [
          "Kuruluşumuzdan bu yana farklı Avrupa ülkelerindeki markalarla çalışarak uluslararası kalite beklentilerine uygun üretim süreçleri geliştirdik.",
          "İhracat projelerinde yalnızca ürünün üretimine değil; doğru planlamaya, düzenli iletişime, termin takibine, kalite kontrolüne ve sevkiyat hazırlığına da önem veriyoruz.",
          "Amacımız, markaların koleksiyonlarını güvenle hayata geçirebilecekleri uzun vadeli bir üretim iş ortaklığı oluşturmaktır.",
        ],
        image: "/ihracat.jpg",
        imageAlt: "İhracata hazır paketlenmiş gömlekler",
        imagePosition: "left",
        order: 1,
        isVisible: true,
      },
      {
        key: "export-services",
        type: "cards",
        eyebrow: "İHRACAT YAKLAŞIMIMIZ",
        title: "Üretimden teslimata düzenli takip",
        items: [
          {
            title: "Süreç Bilgilendirmesi",
            description:
              "Üretimin mevcut durumu hakkında düzenli iletişim.",
          },
          {
            title: "Termin Takibi",
            description:
              "Planlanan üretim ve teslimat tarihlerinin kontrollü takibi.",
          },
          {
            title: "Kalite Kontrol",
            description:
              "Sevkiyat öncesinde ürünlerin belirlenen standartlara göre incelenmesi.",
          },
          {
            title: "Uzun Vadeli İş Birliği",
            description:
              "Markalarla açık iletişime ve karşılıklı güvene dayalı çalışma.",
          },
        ],
        order: 2,
        isVisible: true,
      },
    ],
    seo: {
      title: "Gömlek İhracatı | Ustalar Gömlek",
      description:
        "Avrupa ülkelerindeki markalar için gömlek üretimi, kalite kontrolü, termin takibi ve sevkiyat hazırlığı.",
      keywords: [
        "gömlek ihracatı",
        "Avrupa gömlek üreticisi",
        "tekstil ihracatı",
        "gömlek tedarikçisi",
      ],
    },
  },
  {
    slug: "iletisim",
    navLabel: "İletişim",
    title: "İletişim",
    order: 5,
    isPublished: true,
    hero: {
      eyebrow: "05 / İLETİŞİM",
      title: "Yeni projeleri birlikte konuşalım.",
      description:
        "Ürün, koleksiyon ve üretim talepleriniz için ekibimizle iletişime geçin.",
      image: "/title.jpg",
      imageAlt: "Ustalar Gömlek iletişim",
      overlayOpacity: 0.58,
    },
   sections: [
  {
    key: "contact-location",
    type: "contactForm",
    eyebrow: "İLETİŞİM",
    title: "",
    description: "",
    order: 1,
    isVisible: true,
  },
],
    seo: {
      title: "İletişim | Ustalar Gömlek",
      description:
        "Gömlek üretimi, koleksiyon geliştirme ve ihracat projeleriniz için Ustalar Gömlek ile iletişime geçin.",
      keywords: [
        "Ustalar Gömlek iletişim",
        "gömlek üretim teklifi",
        "gömlek üreticisi iletişim",
      ],
    },
  },
];

const siteSettings = {
  key: "main",
  brandName: "Ustalar Gömlek",
  logo: "/images/logo.svg",
  logoLight: "/images/logo-light.svg",
  favicon: "/favicon.svg",
  navigation: [
    {
      label: "Hakkımızda",
      path: "/hakkimizda",
      order: 1,
      isVisible: true,
    },
    {
      label: "Tasarım",
      path: "/tasarim",
      order: 2,
      isVisible: true,
    },
    {
      label: "Üretim",
      path: "/uretim",
      order: 3,
      isVisible: true,
    },
    {
      label: "İhracat",
      path: "/ihracat",
      order: 4,
      isVisible: true,
    },
    {
      label: "İletişim",
      path: "/iletisim",
      order: 5,
      isVisible: true,
    },
  ],
  contact: {
    address: "",
    phone: "",
    secondaryPhone: "",
    email: "info@ustalargomlek.com",
    mapLink: "",
    mapEmbedUrl: "",
    workingHours: "",
  },
  socialLinks: [],
  footer: {
    description:
      "Tasarımdan üretime, kalite kontrolden paketlemeye kadar markalara özel gömlek üretimi.",
    copyright: "Ustalar Gömlek. Tüm hakları saklıdır.",
    legalLinks: [],
  },
  defaultSeo: {
    title: "Ustalar Gömlek | Gömlek Üretimi",
    description:
      "Yerli ve uluslararası markalara tasarım, üretim ve ihracat hizmetleri sunan gömlek üreticisi.",
    keywords: [
      "gömlek üretimi",
      "gömlek imalatı",
      "Ustalar Gömlek",
    ],
  },
};

const seedDatabase = async () => {
  try {
    await connectDB();

    const pageOperations = pages.map((page) => ({
      updateOne: {
        filter: {
          slug: page.slug,
        },
        update: {
          $set: page,
        },
        upsert: true,
      },
    }));

    await Page.bulkWrite(pageOperations);

    console.log(`${pages.length} sayfa başarıyla oluşturuldu.`);

    await SiteSettings.findOneAndUpdate(
      {
        key: "main",
      },
      {
        $set: siteSettings,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log("Site ayarları başarıyla oluşturuldu.");

    const adminName = process.env.ADMIN_NAME;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminName || !adminEmail || !adminPassword) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL veya ADMIN_PASSWORD .env dosyasında bulunamadı."
      );
    }

    const existingAdmin = await Admin.findOne({
      email: adminEmail.trim().toLowerCase(),
    });

    if (!existingAdmin) {
      await Admin.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "superadmin",
        isActive: true,
      });

      console.log("İlk yönetici hesabı oluşturuldu.");
    } else {
      console.log("Yönetici hesabı daha önce oluşturulmuş.");
    }

    console.log("Başlangıç verileri başarıyla tamamlandı.");
  } catch (error) {
    console.error("Başlangıç verileri oluşturulamadı:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();