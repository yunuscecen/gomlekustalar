import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

import Container from "../common/Container";

const ImageTextSection = ({ section }) => {
  const imageIsLeft = section.imagePosition === "left";

  return (
    <section
      className={`content-section image-text-section ${
        imageIsLeft ? "image-text-section--image-left" : ""
      }`}
    >
      <Container>
        <div className="image-text-section__grid">
          <div className="image-text-section__content">
            {section.eyebrow && (
              <span className="section-kicker">
                {section.eyebrow}
              </span>
            )}

            <h2>{section.title}</h2>

            {section.subtitle && (
              <p className="section-subtitle">
                {section.subtitle}
              </p>
            )}

            <div className="rich-text">
              {(section.paragraphs || []).map(
                (paragraph, index) => (
                  <p key={`${section.key}-paragraph-${index}`}>
                    {paragraph}
                  </p>
                )
              )}
            </div>

            {section.cta?.label && section.cta?.href && (
              <Link
                to={section.cta.href}
                className="text-link"
              >
                {section.cta.label}
                <ArrowUpRight size={18} />
              </Link>
            )}
          </div>

          <div className="image-text-section__media">
            <div className="media-frame">
              {section.image && (
                <img
                  src={section.image}
                  alt={section.imageAlt || ""}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              )}

              <span className="media-frame__placeholder">
                USTALAR
                <strong>GÖMLEK</strong>
              </span>

              <span className="media-frame__index">
                {String(section.order || 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ImageTextSection;