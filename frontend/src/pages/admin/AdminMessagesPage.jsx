import {
  ChevronLeft,
  ChevronRight,
  Mail,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router";

import { getAdminMessages } from "../../services/adminMessageService";

const statusOptions = [
  {
    value: "",
    label: "Tüm Mesajlar",
  },
  {
    value: "new",
    label: "Yeni",
  },
  {
    value: "read",
    label: "Okundu",
  },
  {
    value: "replied",
    label: "Yanıtlandı",
  },
];

const getStatusLabel = (status) => {
  const labels = {
    new: "Yeni",
    read: "Okundu",
    replied: "Yanıtlandı",
  };

  return labels[status] || "Bilinmiyor";
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Tarih bulunamadı";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Tarih bulunamadı";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getMessageInitials = (name = "") => {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (words.length === 0) {
    return "M";
  }

  return words
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getAdminMessages({
        page,
        limit: 10,
        status,
        search: activeSearch,
      });

      const receivedMessages =
        response.data ||
        response.messages ||
        [];

      const receivedPagination =
        response.pagination || {};

      setMessages(
        Array.isArray(receivedMessages)
          ? receivedMessages
          : []
      );

      setPagination({
        page:
          receivedPagination.page ||
          receivedPagination.currentPage ||
          page,
        totalPages:
          receivedPagination.totalPages ||
          receivedPagination.pages ||
          1,
        total:
          receivedPagination.total ||
          receivedPagination.totalItems ||
          receivedMessages.length ||
          0,
        limit: receivedPagination.limit || 10,
      });
    } catch (requestError) {
      console.error(
        "Mesajlar alınırken hata oluştu:",
        requestError
      );

      setMessages([]);

      setError(
        requestError.message ||
          "Mesajlar yüklenirken bir hata oluştu."
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, status, activeSearch]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    setPage(1);
    setActiveSearch(searchInput.trim());
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setActiveSearch("");
    setStatus("");
    setPage(1);
  };

  const hasFilters = Boolean(activeSearch || status);

  const displayedRange = useMemo(() => {
    if (pagination.total === 0) {
      return "0 mesaj";
    }

    const start =
      (pagination.page - 1) * pagination.limit + 1;

    const end = Math.min(
      pagination.page * pagination.limit,
      pagination.total
    );

    return `${start}-${end} / ${pagination.total}`;
  }, [pagination]);

  return (
    <div className="admin-messages-page">
      <div className="admin-page-heading">
        <div>
          <span>İLETİŞİM YÖNETİMİ</span>

          <h1>Mesajlar</h1>

          <p>
            İletişim formundan gelen müşteri taleplerini
            görüntüleyin, durumlarını yönetin ve yönetici
            notları ekleyin.
          </p>
        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={loadMessages}
          disabled={isLoading}
        >
          <RefreshCw size={17} />
          Yenile
        </button>
      </div>

      <section className="admin-message-toolbar">
        <form
          className="admin-message-search"
          onSubmit={handleSearchSubmit}
        >
          <Search size={18} />

          <input
            type="search"
            value={searchInput}
            onChange={(event) =>
              setSearchInput(event.target.value)
            }
            placeholder="Ad, e-posta, şirket veya konu ara"
          />

          <button type="submit">
            Ara
          </button>
        </form>

        <label className="admin-message-filter">
          <SlidersHorizontal size={17} />

          <select
            value={status}
            onChange={handleStatusChange}
          >
            {statusOptions.map((option) => (
              <option
                key={option.value || "all"}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {hasFilters && (
          <button
            type="button"
            className="admin-message-clear-filter"
            onClick={clearFilters}
          >
            Filtreleri Temizle
          </button>
        )}
      </section>

      {error && (
        <div className="admin-error-banner">
          <span>{error}</span>

          <button
            type="button"
            onClick={loadMessages}
          >
            Tekrar dene
          </button>
        </div>
      )}

      <section className="admin-messages-panel">
        <header className="admin-messages-panel__heading">
          <div>
            <span>GELEN KUTUSU</span>

            <strong>
              {pagination.total} mesaj
            </strong>
          </div>

          <small>{displayedRange}</small>
        </header>

        {isLoading ? (
          <div className="admin-messages-loading">
            <div className="admin-session-loader__spinner" />

            <p>Mesajlar yükleniyor</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="admin-message-empty">
            <span>
              <Mail size={30} />
            </span>

            <h2>Mesaj bulunamadı.</h2>

            <p>
              İletişim formundan gönderilen mesajlar burada
              görüntülenecek.
            </p>

            {hasFilters && (
              <button
                type="button"
                className="admin-secondary-button"
                onClick={clearFilters}
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
        ) : (
          <div className="admin-message-table">
            {messages.map((message) => (
              <Link
                key={message._id}
                to={`/admin/mesajlar/${message._id}`}
                className={`admin-message-row ${
                  message.status === "new"
                    ? "admin-message-row--new"
                    : ""
                }`}
              >
                <span className="admin-message-row__avatar">
                  {getMessageInitials(message.name)}
                </span>

                <div className="admin-message-row__sender">
                  <strong>
                    {message.name || "İsimsiz kullanıcı"}
                  </strong>

                  <span>
                    {message.email || "E-posta bulunamadı"}
                  </span>
                </div>

                <div className="admin-message-row__content">
                  <strong>
                    {message.subject || "Konu belirtilmedi"}
                  </strong>

                  <p>
                    {message.message ||
                      "Mesaj içeriği bulunamadı."}
                  </p>
                </div>

                <div className="admin-message-row__meta">
                  <span
                    className={`admin-message-status admin-message-status--${message.status}`}
                  >
                    {getStatusLabel(message.status)}
                  </span>

                  <time>
                    {formatDate(message.createdAt)}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading &&
          pagination.totalPages > 1 && (
            <footer className="admin-message-pagination">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() =>
                  setPage((currentPage) =>
                    Math.max(1, currentPage - 1)
                  )
                }
              >
                <ChevronLeft size={17} />
                Önceki
              </button>

              <span>
                Sayfa {pagination.page} /{" "}
                {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={
                  pagination.page >=
                  pagination.totalPages
                }
                onClick={() =>
                  setPage((currentPage) =>
                    Math.min(
                      pagination.totalPages,
                      currentPage + 1
                    )
                  )
                }
              >
                Sonraki
                <ChevronRight size={17} />
              </button>
            </footer>
          )}
      </section>
    </div>
  );
};

export default AdminMessagesPage;