import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router";

import { useSite } from "../../context/SiteContext";
import Container from "../common/Container";

const Footer = () => {
  const { settings, visibleNavigation } = useSite();

  const contact = settings.contact || {};
  const footer = settings.footer || {};

  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__top">
          <div className="site-footer__brand-column">
            <Link
              to="/"
              className="brand brand--footer"
            >
              

              <span className="brand__text">
                <strong>USTALAR GÖMLEK</strong>
              </span>
            </Link>

            <p className="site-footer__description">
              {footer.description}
            </p>
          </div>

          <div className="site-footer__cta">
            <span>YENİ BİR PROJE</span>

            <h2>
              Koleksiyonunuzu birlikte üretime dönüştürelim.
            </h2>

            <Link
              to="/iletisim"
              className="footer-cta-link"
            >
              Projenizi Anlatın
              <ArrowUpRight size={22} />
            </Link>
          </div>
        </div>

        <div className="site-footer__grid">
          <div className="footer-column">
            <span className="footer-column__title">
              SAYFALAR
            </span>

            <div className="footer-links">
              <Link to="/">Anasayfa</Link>

              {visibleNavigation.map((item) => (
                <Link
                  key={`${item.path}-${item.label}`}
                  to={item.path}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-column">
            <span className="footer-column__title">
              İLETİŞİM
            </span>

            <div className="footer-contact-list">
              {contact.phone && (
                <a href={`tel:${contact.phone}`}>
                  <Phone size={16} />
                  {contact.phone}
                </a>
              )}

              {contact.email && (
                <a href={`mailto:${contact.email}`}>
                  <Mail size={16} />
                  {contact.email}
                </a>
              )}

              {contact.address && (
                <div>
                  <MapPin size={16} />
                  <span>{contact.address}</span>
                </div>
              )}

              {!contact.phone &&
                !contact.email &&
                !contact.address && (
                  <p>
                    İletişim bilgileri yönetim panelinden
                    eklenecektir.
                  </p>
                )}
            </div>
          </div>

          <div className="footer-column">
            <span className="footer-column__title">
              ÇALIŞMA ALANLARI
            </span>

            <div className="footer-links">
              <Link to="/tasarim">Ürün Geliştirme</Link>
              <Link to="/uretim">Gömlek Üretimi</Link>
              <Link to="/ihracat">İhracat</Link>
              <Link to="/iletisim">Üretim Talebi</Link>
            </div>
          </div>
        </div>

     
                <div className="site-footer__bottom">
  <p>
    © {new Date().getFullYear()}{" "}
    {footer.copyright ||
      "Ustalar Gömlek. Tüm hakları saklıdır."}
  </p>
 <img
      src="/index.png"
      alt="Digital is Moon"
      className="site-footer__agency-logo"
      loading="lazy"
    />
  <a
    href="https://digitalismoon.com"
    target="_blank"
    rel="noopener noreferrer"
    className="site-footer__agency"
    aria-label="Digital is Moon web sitesini yeni sekmede aç"
  >
   

    <span className="site-footer__agency-text">
      <span>Software Agency :</span>
      <strong>Digital is Moon</strong>
    </span>
  </a>

  <button
    type="button"
    onClick={() =>
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  >
    Yukarı Dön
    <ArrowUpRight size={15} />
  </button>
</div>

      </Container>
    </footer>
  );
};

export default Footer;