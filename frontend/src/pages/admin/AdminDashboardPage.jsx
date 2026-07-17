import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Mail,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link } from "react-router";

import { useAdminAuth } from "../../context/AdminAuthContext";
import { getAdminMessages } from "../../services/adminMessageService";
import { getAdminPages } from "../../services/adminPageService";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Tarih bulunamadı";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
};

const getMessageStatusLabel = (status) => {
  const labels = {
    new: "Yeni",
    read: "Okundu",
    replied: "Yanıtlandı",
  };

  return labels[status] || status;
};

const AdminDashboardPage = () => {
  const { admin } = useAdminAuth();

  const [dashboardData, setDashboardData] =
    useState({
      pages: [],
      latestMessages: [],
      totalMessages: 0,
      newMessages: 0,
    });

  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const [
        pages,
        messagesResponse,
        newMessagesResponse,
      ] = await Promise.all([
        getAdminPages(),
        getAdminMessages({
          page: 1,
          limit: 5,
        }),
        getAdminMessages({
          page: 1,
          limit: 1,
          status: "new",
        }),
      ]);

      setDashboardData({
        pages,
        latestMessages:
          messagesResponse.data || [],
        totalMessages:
          messagesResponse.pagination?.total || 0,
        newMessages:
          newMessagesResponse.pagination?.total || 0,
      });
    } catch (requestError) {
      console.error(
        "Dashboard verileri alınamadı:",
        requestError
      );

      setError(
        requestError.message ||
          "Yönetim paneli verileri yüklenemedi."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const publishedPages =
    dashboardData.pages.filter(
      (page) => page.isPublished
    ).length;

  if (isLoading) {
    return (
      <div className="admin-page-loader">
        <div className="admin-session-loader__spinner" />
        <p>Yönetim verileri hazırlanıyor</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <span>GENEL BAKIŞ</span>

          <h1>
            Hoş geldiniz,{" "}
            {admin?.name?.split(" ")[0] || "Yönetici"}.
          </h1>

          <p>
            Site içeriklerini ve müşteri mesajlarını
            buradan takip edebilirsiniz.
          </p>
        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={loadDashboard}
        >
          <RefreshCw size={17} />
          Yenile
        </button>
      </div>

      {error && (
        <div className="admin-error-banner">
          <span>{error}</span>

          <button
            type="button"
            onClick={loadDashboard}
          >
            Tekrar dene
          </button>
        </div>
      )}

      <section className="admin-metric-grid">
        <article className="admin-metric-card">
          <div className="admin-metric-card__icon">
            <FileText size={21} />
          </div>

          <div>
            <span>Toplam Sayfa</span>
            <strong>
              {dashboardData.pages.length}
            </strong>
          </div>
        </article>

        <article className="admin-metric-card">
          <div className="admin-metric-card__icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Yayındaki Sayfa</span>
            <strong>{publishedPages}</strong>
          </div>
        </article>

        <article className="admin-metric-card">
          <div className="admin-metric-card__icon">
            <MessageSquare size={21} />
          </div>

          <div>
            <span>Toplam Mesaj</span>
            <strong>
              {dashboardData.totalMessages}
            </strong>
          </div>
        </article>

        <article className="admin-metric-card admin-metric-card--accent">
          <div className="admin-metric-card__icon">
            <Mail size={21} />
          </div>

          <div>
            <span>Yeni Mesaj</span>
            <strong>
              {dashboardData.newMessages}
            </strong>
          </div>
        </article>
      </section>

      <div className="admin-dashboard-grid">
        <section className="admin-panel-card">
          <div className="admin-panel-card__heading">
            <div>
              <span>SAYFALAR</span>
              <h2>Site içerikleri</h2>
            </div>

            <Link to="/admin/sayfalar">
              Tümünü Gör
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="admin-page-list">
            {dashboardData.pages.map((page) => (
              <article
                key={page._id || page.slug}
                className="admin-page-list-item"
              >
                <div>
                  <span className="admin-page-list-item__mark">
                    {page.title
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </span>

                  <div>
                    <strong>{page.title}</strong>
                    <small>/{page.slug}</small>
                  </div>
                </div>

                <span
                  className={`admin-status-badge ${
                    page.isPublished
                      ? "admin-status-badge--published"
                      : "admin-status-badge--draft"
                  }`}
                >
                  {page.isPublished
                    ? "Yayında"
                    : "Taslak"}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-panel-card">
          <div className="admin-panel-card__heading">
            <div>
              <span>İLETİŞİM</span>
              <h2>Son mesajlar</h2>
            </div>

            <Link to="/admin/mesajlar">
              Tümünü Gör
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="admin-message-preview-list">
            {dashboardData.latestMessages.length ===
            0 ? (
              <div className="admin-empty-state">
                <MessageSquare size={28} />

                <strong>Henüz mesaj bulunmuyor.</strong>

                <p>
                  İletişim formundan gönderilen mesajlar
                  burada görüntülenecek.
                </p>
              </div>
            ) : (
              dashboardData.latestMessages.map(
                (message) => (
                  <article
                    key={message._id}
                    className="admin-message-preview"
                  >
                    <div className="admin-message-preview__top">
                      <div>
                        <strong>{message.name}</strong>
                        <small>{message.email}</small>
                      </div>

                      <span
                        className={`admin-message-status admin-message-status--${message.status}`}
                      >
                        {getMessageStatusLabel(
                          message.status
                        )}
                      </span>
                    </div>

                    <h3>{message.subject}</h3>

                    <p>{message.message}</p>

                    <time>
                      {formatDate(message.createdAt)}
                    </time>
                  </article>
                )
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;