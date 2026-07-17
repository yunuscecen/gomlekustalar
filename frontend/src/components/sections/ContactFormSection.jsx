import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

import { useSite } from "../../context/SiteContext";
import { sendContactMessage } from "../../services/contactService";
import Container from "../common/Container";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  subject: "",
  message: "",
  website: "",
};

const ContactFormSection = ({ section }) => {
  const { settings } = useSite();

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback({
        type: "",
        message: "",
      });

      const response = await sendContactMessage(formData);

      setFeedback({
        type: "success",
        message: response.message,
      });

      setFormData(initialFormState);
    } catch (requestError) {
      setFeedback({
        type: "error",
        message:
          requestError.message ||
          "Mesajınız gönderilemedi. Lütfen tekrar deneyin.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contact = settings.contact || {};

  return (
    <section className="content-section contact-section">
      <Container>
        <div className="contact-section__grid">
          <div className="contact-section__information">
            <span className="section-kicker">
              İLETİŞİM
            </span>

            <h2>{section.title}</h2>

            {section.description && (
              <p>{section.description}</p>
            )}

            <div className="contact-details">
              {contact.phone && (
                <a href={`tel:${contact.phone}`}>
                  <span>TELEFON</span>
                  <strong>{contact.phone}</strong>
                </a>
              )}

              {contact.email && (
                <a href={`mailto:${contact.email}`}>
                  <span>E-POSTA</span>
                  <strong>{contact.email}</strong>
                </a>
              )}

              {contact.address && (
                <div>
                  <span>ADRES</span>
                  <strong>{contact.address}</strong>
                </div>
              )}

              {!contact.phone &&
                !contact.email &&
                !contact.address && (
                  <div className="contact-details__placeholder">
                    <span>İLETİŞİM BİLGİLERİ</span>
                    <strong>
                      Yönetim panelinden eklenecektir.
                    </strong>
                  </div>
                )}
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >
            <div
              className="contact-form__honeypot"
              aria-hidden="true"
            >
              <label htmlFor="website">
                Web sitesi
              </label>

              <input
                id="website"
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                tabIndex="-1"
                autoComplete="off"
              />
            </div>

            <div className="form-grid">
              <label className="form-field">
                <span>Ad Soyad *</span>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Adınız ve soyadınız"
                />
              </label>

              <label className="form-field">
                <span>E-posta *</span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  placeholder="ornek@marka.com"
                />
              </label>

              <label className="form-field">
                <span>Telefon</span>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={30}
                  placeholder="+90"
                />
              </label>

              <label className="form-field">
                <span>Firma</span>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  maxLength={150}
                  placeholder="Firma veya marka adı"
                />
              </label>
            </div>

            <label className="form-field">
              <span>Konu *</span>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="Örneğin: Yeni koleksiyon üretimi"
              />
            </label>

            <label className="form-field">
              <span>Mesajınız *</span>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                maxLength={3000}
                rows={6}
                placeholder="Ürün grubu, tahmini adet ve teslimat planı hakkında bilgi verebilirsiniz."
              />
            </label>

            {feedback.message && (
              <div
                className={`form-feedback form-feedback--${feedback.type}`}
                role="alert"
              >
                {feedback.type === "success" && (
                  <CheckCircle2 size={18} />
                )}

                <span>{feedback.message}</span>
              </div>
            )}

            <button
              type="submit"
              className="button button--dark contact-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="button-loader" />
                  Gönderiliyor
                </>
              ) : (
                <>
                  Mesajı Gönder
                  <ArrowUpRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default ContactFormSection;