import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import {
  deleteAdminMessage,
  getAdminMessageById,
  updateAdminMessage,
} from "../../services/adminMessageService";

const statusOptions = [
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

  return labels[status] || status;
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

const normalizeMessage = (response) => {
  const message =
    response?.message ||
    response?.data?.message ||
    response?.data ||
    response;

  return {
    ...message,
    name: message?.name || "",
    email: message?.email || "",
    phone: message?.phone || "",
    company: message?.company || "",
    subject: message?.subject || "",
    message: message?.message || "",
    status: message?.status || "read",
    adminNote: message?.adminNote || "",
  };
};

const AdminMessageDetailPage = () => {
  const { messageId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [initialMessage, setInitialMessage] =
    useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const loadMessage = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      setFeedback("");

      const response =
        await getAdminMessageById(messageId);

      const normalizedMessage =
        normalizeMessage(response);

      setMessage(normalizedMessage);
      setInitialMessage(normalizedMessage);
    } catch (requestError) {
      console.error(
        "Mesaj detayı alınamadı:",
        requestError
      );

      setError(
        requestError.message ||
          "Mesaj detayı yüklenemedi."
      );
    } finally {
      setIsLoading(false);
    }
  }, [messageId]);

  useEffect(() => {
    loadMessage();
  }, [loadMessage]);

  const hasChanges = useMemo(() => {
    if (!message || !initialMessage) {
      return false;
    }

    return (
      message.status !== initialMessage.status ||
      message.adminNote !== initialMessage.adminNote
    );
  }, [message, initialMessage]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!hasChanges) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [hasChanges]);

  const handleFieldChange = (field, value) => {
    setMessage((currentMessage) => ({
      ...currentMessage,
      [field]: value,
    }));

    setFeedback("");
    setError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!message || isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setFeedback("");

      const response = await updateAdminMessage(
        messageId,
        {
          status: message.status,
          adminNote: message.adminNote.trim(),
        }
      );

      const updatedMessage = normalizeMessage(
        response?.data || response
      );

      setMessage(updatedMessage);
      setInitialMessage(updatedMessage);

      setFeedback(
        response?.message ||
          "Mesaj bilgileri başarıyla güncellendi."
      );
    } catch (requestError) {
      console.error(
        "Mesaj güncellenemedi:",
        requestError
      );

      setError(
        requestError.message ||
          "Mesaj kaydedilirken bir hata oluştu."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      "Bu mesaj kalıcı olarak silinecek. Devam edilsin mi?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setError("");

      await deleteAdminMessage(messageId);

      navigate("/admin/mesajlar", {
        replace: true,
      });
    } catch (requestError) {
      console.error(
        "Mesaj silinemedi:",
        requestError
      );

      setError(
        requestError.message ||
          "Mesaj silinirken bir hata oluştu."
      );

      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page-loader">
        <div className="admin-session-loader__spinner" />
        <p>Mesaj detayı hazırlanıyor</p>
      </div>
    );
  }

  if (error && !message) {
    return (
      <div className="admin-editor-load-error">
        <strong>Mesaj yüklenemedi.</strong>

        <p>{error}</p>

        <button
          type="button"
          className="admin-primary-button"
          onClick={loadMessage}
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  const replySubject = encodeURIComponent(
    `Ynt: ${message.subject || "İletişim talebiniz"}`
  );

  return (
    <form
      className="admin-message-detail-page"
      onSubmit={handleSave}
    >
      <div className="admin-message-detail-heading">
        <div>
          <Link
            to="/admin/mesajlar"
            className="admin-editor-back-link"
          >
            <ArrowLeft size={16} />
            Mesajlara Dön
          </Link>

          <span>MESAJ DETAYI</span>

          <h1>
            {message.subject || "İletişim mesajı"}
          </h1>

          <p>
            {message.name || "İsimsiz kullanıcı"} tarafından
            gönderildi.
          </p>
        </div>

        <div className="admin-message-detail-heading__actions">
          <a
            href={`mailto:${message.email}?subject=${replySubject}`}
            className="admin-secondary-button"
          >
            <Mail size={17} />
            E-posta Gönder
          </a>

          <button
            type="button"
            className="admin-danger-button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 size={17} />

            {isDeleting
              ? "Siliniyor"
              : "Mesajı Sil"}
          </button>
        </div>
      </div>

      {error && message && (
        <div className="admin-error-banner">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
          >
            Kapat
          </button>
        </div>
      )}

      {feedback && (
        <div className="admin-success-banner">
          <CheckCircle2 size={18} />
          <span>{feedback}</span>
        </div>
      )}

      <div className="admin-message-detail-layout">
        <div className="admin-message-detail-main">
          <section className="admin-message-content-card">
            <header>
              <div>
                <MessageSquare size={19} />

                <div>
                  <span>MESAJ İÇERİĞİ</span>

                  <strong>
                    {message.subject ||
                      "Konu belirtilmedi"}
                  </strong>
                </div>
              </div>

              <span
                className={`admin-message-status admin-message-status--${message.status}`}
              >
                {getStatusLabel(message.status)}
              </span>
            </header>

            <div className="admin-message-content-card__body">
              <p>
                {message.message ||
                  "Mesaj içeriği bulunamadı."}
              </p>
            </div>
          </section>

          <section className="admin-editor-card">
            <div className="admin-editor-card__heading">
              <div>
                <span>02</span>

                <div>
                  <h2>Yönetim bilgileri</h2>

                  <p>
                    Mesajın durumunu güncelleyin ve yalnızca
                    yöneticilerin görebileceği bir not
                    ekleyin.
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-editor-card__body">
              <label className="admin-editor-field">
                <span>Mesaj durumu</span>

                <select
                  value={message.status}
                  onChange={(event) =>
                    handleFieldChange(
                      "status",
                      event.target.value
                    )
                  }
                >
                  {statusOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="admin-editor-field">
                <span>Yönetici notu</span>

                <small>
                  Bu not ziyaretçiye gösterilmez.
                </small>

                <textarea
                  rows={8}
                  value={message.adminNote}
                  onChange={(event) =>
                    handleFieldChange(
                      "adminNote",
                      event.target.value
                    )
                  }
                  placeholder="Örneğin: Müşteriyle telefon üzerinden görüşüldü."
                />
              </label>

              <div className="admin-message-save-actions">
                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={
                    isSaving || !hasChanges
                  }
                >
                  {isSaving ? (
                    <>
                      <span className="admin-button-spinner" />
                      Kaydediliyor
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Değişiklikleri Kaydet
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="admin-secondary-button"
                  disabled={
                    isSaving || !hasChanges
                  }
                  onClick={() => {
                    setMessage(initialMessage);
                    setError("");
                    setFeedback("");
                  }}
                >
                  Değişiklikleri Geri Al
                </button>
              </div>
            </div>
          </section>
        </div>

        <aside className="admin-message-detail-sidebar">
          <section className="admin-message-person-card">
            <span className="admin-message-person-card__eyebrow">
              GÖNDEREN BİLGİLERİ
            </span>

            <div className="admin-message-person-card__avatar">
              {message.name
                ?.trim()
                ?.charAt(0)
                ?.toUpperCase() || "M"}
            </div>

            <h2>
              {message.name || "İsimsiz kullanıcı"}
            </h2>

            {message.company && (
              <p>{message.company}</p>
            )}

            <div className="admin-message-contact-list">
              <div>
                <UserRound size={17} />

                <span>
                  {message.name || "Belirtilmedi"}
                </span>
              </div>

              <div>
                <Mail size={17} />

                <a href={`mailto:${message.email}`}>
                  {message.email ||
                    "E-posta belirtilmedi"}
                </a>
              </div>

              <div>
                <Phone size={17} />

                {message.phone ? (
                  <a href={`tel:${message.phone}`}>
                    {message.phone}
                  </a>
                ) : (
                  <span>Telefon belirtilmedi</span>
                )}
              </div>

              <div>
                <Building2 size={17} />

                <span>
                  {message.company ||
                    "Şirket belirtilmedi"}
                </span>
              </div>

              <div>
                <CalendarDays size={17} />

                <span>
                  {formatDate(message.createdAt)}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
};

export default AdminMessageDetailPage;