import { useSite } from "../../context/SiteContext";
import Container from "../common/Container";

const ContactFormSection = ({ section }) => {
  const { settings } = useSite();

  const contact = settings?.contact || {};

  const address =
    typeof contact.address === "string"
      ? contact.address.trim()
      : "";

  const email =
    typeof contact.email === "string" &&
    contact.email.trim()
      ? contact.email.trim()
      : "info@ustalargomlek.com";

  const mapLink =
    contact.mapLink?.trim?.() ||
    contact.mapUrl?.trim?.() ||
    "";

  const sectionTitle =
    section?.eyebrow?.trim() || "İLETİŞİM";

  const mapImage = (
    <img
      src="/map.png"
      alt="Ustalar Gömlek konum haritası"
      loading="lazy"
    />
  );

  return (
    <section className="contact-location-section">
      <Container>
        <div className="contact-location-section__grid">
          <div className="contact-location-section__map">
            {mapLink ? (
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="contact-location-section__map-link"
                aria-label="Konumu haritada görüntüle"
              >
                {mapImage}
              </a>
            ) : (
              <div className="contact-location-section__map-frame">
                {mapImage}
              </div>
            )}
          </div>

          <div className="contact-location-section__information">
            <h2>{sectionTitle}</h2>

            <dl className="contact-location-details">
              <div className="contact-location-details__item">
                <dt>Adres:</dt>

                <dd>
                  {address ? (
                    mapLink ? (
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {address}
                      </a>
                    ) : (
                      <address>{address}</address>
                    )
                  ) : (
                    <span>
                      Açık adres yönetim panelinden
                      eklenecektir.
                    </span>
                  )}
                </dd>
              </div>

              <div className="contact-location-details__item">
                <dt>E-posta:</dt>

                <dd>
                  <a href={`mailto:${email}`}>
                    {email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactFormSection;