import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router";

import { useAdminAuth } from "../../context/AdminAuthContext";

const AdminLoginPage = () => {
  const {
    admin,
    isCheckingAuth,
    login,
  } = useAdminAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const previousLocation =
        location.state?.from?.pathname;

      navigate(previousLocation || "/admin", {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError.message ||
          "Yönetici girişi gerçekleştirilemedi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="admin-session-loader">
        <div className="admin-session-loader__spinner" />
        <p>Oturum kontrol ediliyor</p>
      </div>
    );
  }

  if (admin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-page__visual">
        <div className="admin-login-page__visual-overlay" />

        <Link
          to="/"
          className="admin-login-page__brand"
        >
          <span>UG</span>

          <div>
            <strong>USTALAR</strong>
            <small>GÖMLEK</small>
          </div>
        </Link>

        <div className="admin-login-page__visual-content">
          <span className="admin-login-page__eyebrow">
            YÖNETİM SİSTEMİ
          </span>

          <h1>
            İçeriklerinizi tek merkezden yönetin.
          </h1>

          <p>
            Sayfaları, iletişim bilgilerini ve müşteri
            mesajlarını güvenli yönetim panelinden
            kontrol edin.
          </p>
        </div>

        <span className="admin-login-page__watermark">
          UG
        </span>
      </section>

      <section className="admin-login-page__form-area">
        <div className="admin-login-card">
          <div className="admin-login-card__heading">
            <span>YÖNETİCİ GİRİŞİ</span>

            <h2>Tekrar hoş geldiniz.</h2>

            <p>
              Yönetim paneline ulaşmak için giriş
              bilgilerinizi kullanın.
            </p>
          </div>

          <form
            className="admin-login-form"
            onSubmit={handleSubmit}
          >
            <label className="admin-login-field">
              <span>E-posta adresi</span>

              <div className="admin-login-field__control">
                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@ustalargomlek.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="admin-login-field">
              <span>Şifre</span>

              <div className="admin-login-field__control">
                <LockKeyhole size={18} />

                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Şifrenizi yazın"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (currentValue) => !currentValue
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Şifreyi gizle"
                      : "Şifreyi göster"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </label>

            {error && (
              <div
                className="admin-login-error"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="admin-login-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="admin-button-spinner" />
                  Giriş yapılıyor
                </>
              ) : (
                <>
                  Yönetim Paneline Gir
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <Link
            to="/"
            className="admin-login-card__back"
          >
            Siteye geri dön
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AdminLoginPage;