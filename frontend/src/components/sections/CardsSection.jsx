import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

import Container from "../common/Container";

const CardsSection = ({ section }) => {
  const items = section.items || [];
  const hasImages = items.some((item) => item.image);

  return (
    <section
      className={`content-section cards-section ${
        hasImages
          ? "cards-section--visual"
          : "cards-section--minimal"
      }`}
    >
      <Container>
        <div className="section-heading">
          <div>
            {section.eyebrow && (
              <span className="section-kicker">
                {section.eyebrow}
              </span>
            )}

            <h2>{section.title}</h2>
          </div>

          {section.description && (
            <p>{section.description}</p>
          )}
        </div>

        <div
          className={`cards-grid cards-grid--${Math.min(
            items.length,
            5
          )}`}
        >
          {items.map((item, index) => {
            const cardContent = (
              <>
                {item.image && (
                  <div className="content-card__media">
                    <img
                      src={item.image}
                      alt={item.title || ""}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />

                    <span>UG</span>
                  </div>
                )}

                <div className="content-card__body">
                  <span className="content-card__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>{item.title}</h3>

                  {item.description && (
                    <p>{item.description}</p>
                  )}

                  {item.linkLabel && (
                    <span className="content-card__link">
                      {item.linkLabel}
                      <ArrowUpRight size={17} />
                    </span>
                  )}
                </div>
              </>
            );

            if (item.link) {
              return (
                <Link
                  key={`${section.key}-${item.title}-${index}`}
                  to={item.link}
                  className="content-card content-card--link"
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <article
                key={`${section.key}-${item.title}-${index}`}
                className="content-card"
              >
                {cardContent}
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default CardsSection;