import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Save,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

import { changeAdminPassword } from "../../services/authService";

const initialFormData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const calculatePasswordStrength = (password) => {
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (password.length >= 12) {
    score += 1;
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  }

  if (/\d/.test(password)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  if (score <= 1) {
    return {
      score,
      label: "Zayıf",
    };
  }

  if (score <= 3) {
    return {
      score,
      label: "Orta",
    };
  }

  return {
    score,
    label: "Güçlü",
  };
};

const PasswordField = ({
  label,
  name,
  value,
  placeholder,
  autoComplete,
  isVisible,
  onToggleVisibility,
  onChange,
}) => {
  return (
    <label className="admin-password-field">
      <span>{label}</span>

      <div className="admin-password-field__control">
        <LockKeyhole size={18} />

        <input
          type={isVisible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
        />

        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={
            isVisible
              ? `${label} alanını gizle`
              : `${label} alanını göster`
          }
        >
          {isVisible ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
    </label>
  );
};

const AdminPasswordPage = () => {
  const [formData, setFormData] = useState(
    initialFormData
  );

  const [visibleFields, setVisibleFields] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const passwordStrength = useMemo(
    () => calculatePasswordStrength(formData.newPassword),
    [formData.newPassword]
  );

  const canSubmit =
    formData.currentPassword.length > 0 &&
    formData.newPassword.length >= 8 &&
    formData.confirmPassword.length > 0 &&
    !isSubmitting;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setError("");
    setFeedback("");
  };

  const toggleVisibility = (fieldName) => {
    setVisibleFields((currentFields) => ({
      ...currentFields,
      [fieldName]: !currentFields[fieldName],
    }));
  };

  const validateForm = () => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      return "Bütün şifre alanlarını doldurun.";
    }

    if (formData.newPassword.length < 8) {
      return "Yeni şifre en az 8 karakter olmalıdır.";
    }

    if (
      formData.currentPassword === formData.newPassword
    ) {
      return "Yeni şifre mevcut şifreden farklı olmalıdır.";
    }

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      return "Yeni şifre ile şifre tekrarı eşleşmiyor.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setFeedback("");

      const response = await changeAdminPassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setFeedback(
        response?.message ||
          "Yönetici şifresi başarıyla değiştirildi."
      );

      setFormData(initialFormData);

      setVisibleFields({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
    } catch (requestError) {
      console.error(
        "Yönetici şifresi değiştirilemedi:",
        requestError
      );

      setError(
        requestError.message ||
          "Şifre değiştirilirken bir hata oluştu."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-password-page">
      <div className="admin-page-heading">
        <div>
          <span>HESAP GÜVENLİĞİ</span>

          <h1>Şifre Değiştir</h1>

          <p>
            Yönetici hesabınız için güçlü ve benzersiz bir
            şifre belirleyin.
          </p>
        </div>
      </div>

      {error && (
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

      <div className="admin-password-layout">
        <form
          className="admin-password-form-card"
          onSubmit={handleSubmit}
        >
          <header className="admin-password-form-card__heading">
            <span>
              <KeyRound size={21} />
            </span>

            <div>
              <h2>Yeni şifrenizi belirleyin</h2>

              <p>
                İşlemi tamamlamak için önce mevcut
                şifrenizi doğrulamalısınız.
              </p>
            </div>
          </header>

          <div className="admin-password-form-card__body">
            <PasswordField
              label="Mevcut şifre"
              name="currentPassword"
              value={formData.currentPassword}
              placeholder="Mevcut şifrenizi yazın"
              autoComplete="current-password"
              isVisible={visibleFields.currentPassword}
              onToggleVisibility={() =>
                toggleVisibility("currentPassword")
              }
              onChange={handleChange}
            />

            <div className="admin-password-divider" />

            <PasswordField
              label="Yeni şifre"
              name="newPassword"
              value={formData.newPassword}
              placeholder="Yeni şifrenizi yazın"
              autoComplete="new-password"
              isVisible={visibleFields.newPassword}
              onToggleVisibility={() =>
                toggleVisibility("newPassword")
              }
              onChange={handleChange}
            />

            {formData.newPassword && (
              <div className="admin-password-strength">
                <div className="admin-password-strength__heading">
                  <span>Şifre gücü</span>

                  <strong>
                    {passwordStrength.label}
                  </strong>
                </div>

                <div className="admin-password-strength__bars">
                  {Array.from({ length: 5 }).map(
                    (_, index) => (
                      <span
                        key={index}
                        className={
                          index < passwordStrength.score
                            ? "admin-password-strength__bar--active"
                            : ""
                        }
                      />
                    )
                  )}
                </div>
              </div>
            )}

            <PasswordField
              label="Yeni şifre tekrarı"
              name="confirmPassword"
              value={formData.confirmPassword}
              placeholder="Yeni şifrenizi tekrar yazın"
              autoComplete="new-password"
              isVisible={visibleFields.confirmPassword}
              onToggleVisibility={() =>
                toggleVisibility("confirmPassword")
              }
              onChange={handleChange}
            />

            {formData.confirmPassword &&
              formData.newPassword !==
                formData.confirmPassword && (
                <p className="admin-password-match-error">
                  Şifreler henüz eşleşmiyor.
                </p>
              )}

            {formData.confirmPassword &&
              formData.newPassword ===
                formData.confirmPassword && (
                <p className="admin-password-match-success">
                  <CheckCircle2 size={15} />
                  Şifreler eşleşiyor.
                </p>
              )}

            <button
              type="submit"
              className="admin-primary-button admin-password-submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <>
                  <span className="admin-button-spinner" />
                  Şifre değiştiriliyor
                </>
              ) : (
                <>
                  <Save size={17} />
                  Şifreyi Değiştir
                </>
              )}
            </button>
          </div>
        </form>

        <aside className="admin-password-security-card">
          <span className="admin-password-security-card__icon">
            <ShieldCheck size={30} />
          </span>

          <span className="admin-password-security-card__eyebrow">
            GÜVENLİ ŞİFRE
          </span>

          <h2>
            Hesabınızı güçlü bir şifreyle koruyun.
          </h2>

          <p>
            Yönetici hesabınız sitenin bütün içeriklerine
            erişebilir. Daha önce başka bir hesapta
            kullandığınız şifreyi tercih etmeyin.
          </p>

          <div className="admin-password-rules">
            <div>
              <CheckCircle2 size={16} />
              <span>En az 8 karakter kullanın.</span>
            </div>

            <div>
              <CheckCircle2 size={16} />
              <span>Büyük ve küçük harf ekleyin.</span>
            </div>

            <div>
              <CheckCircle2 size={16} />
              <span>Rakam ve özel karakter ekleyin.</span>
            </div>

            <div>
              <CheckCircle2 size={16} />
              <span>
                Başka hesaplarda kullanmadığınız bir şifre
                seçin.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminPasswordPage;