import {
  ArrowRight,
  Eye,
  FileText,
  RefreshCw,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link } from "react-router";

import { getAdminPages } from "../../services/adminPageService";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Henüz güncellenmedi";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
};

const getPublicPath = (slug) => {
  if (slug === "anasayfa") {
    return "/";
  }

  return `/${slug}`;
};

const AdminPagesPage = () => {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getAdminPages();

      setPages(response);
    } catch (requestError) {
      console.error("Sayfalar alınamadı:", requestError);

      setError(
        requestError.message ||
          "Sayfalar yüklenirken bir hata oluştu."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  if (isLoading) {
    return (
      <div className="admin-page-loader">
        <div className="admin-session-loader__spinner" />
        <p>Sayfalar hazırlanıyor</p>
      </div>
    );
  }

  return (
    <div className="admin-pages-page">
      <div className="admin-page-heading">
        <div>
          <span>İÇERİK YÖNETİMİ</span>

          <h1>Sayfalar</h1>

          <p>
            Sayfa başlıklarını, metinlerini, kartlarını,
            butonlarını, görsel yollarını ve SEO bilgilerini
            düzenleyin.
          </p>
        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={loadPages}
        >
          <RefreshCw size={17} />
          Yenile
        </button>
      </div>

      {error && (
        <div className="admin-error-banner">
          <span>{error}</span>

          <button type="button" onClick={loadPages}>
            Tekrar dene
          </button>
        </div>
      )}

      <section className="admin-pages-grid">
        {pages.map((page, index) => (
          <article
            key={page._id || page.slug}
            className="admin-page-card"
          >
            <div className="admin-page-card__top">
              <span className="admin-page-card__number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span
                className={`admin-status-badge ${
                  page.isPublished
                    ? "admin-status-badge--published"
                    : "admin-status-badge--draft"
                }`}
              >
                {page.isPublished ? "Yayında" : "Taslak"}
              </span>
            </div>

            <div className="admin-page-card__icon">
              <FileText size={24} />
            </div>

            <div className="admin-page-card__content">
              <span>/{page.slug}</span>

              <h2>{page.title}</h2>

              <p>
                {page.hero?.title ||
                  "Sayfanın hero başlığı bulunmuyor."}
              </p>

              <small>
                Son güncelleme: {formatDate(page.updatedAt)}
              </small>
            </div>

            <div className="admin-page-card__actions">
              <a
                href={getPublicPath(page.slug)}
                target="_blank"
                rel="noreferrer"
                className="admin-page-card__preview"
              >
                <Eye size={16} />
                Görüntüle
              </a>

              <Link
                to={`/admin/sayfalar/${page.slug}`}
                className="admin-page-card__edit"
              >
                Düzenle
                <ArrowRight size={17} />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default AdminPagesPage;