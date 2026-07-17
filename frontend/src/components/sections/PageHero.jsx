import {
  ArrowDown,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router";

import Container from "../common/Container";

const HeroImage = ({ src, alt }) => {
  if (!src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt || ""}
      className="page-hero__image"
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  );
};

const PageHero = ({ hero, isHome = false }) => {
  const overlayOpacity =
    typeof hero?.overlayOpacity === "number"
      ? hero.overlayOpacity
      : 0.5;

  return (
    <section
      className={`page-hero ${
        isHome ? "page-hero--home" : "page-hero--inner"
      }`}
      style={{
        "--hero-overlay-opacity": overlayOpacity,
      }}
    >
      <HeroImage
        src={hero?.image}
        alt={hero?.imageAlt}
      />

      <div className="page-hero__fallback" />
      <div className="page-hero__overlay" />
      <div className="page-hero__grain" />

      <div className="page-hero__watermark">
        {isHome ? "UG" : "USTALAR"}
      </div>

      <Container className="page-hero__content">
        <div className="page-hero__content-inner">
          {hero?.eyebrow && (
            <span className="page-hero__eyebrow">
              {hero.eyebrow}
            </span>
          )}

          <h1>{hero?.title}</h1>

          {hero?.description && (
            <p>{hero.description}</p>
          )}

          {(hero?.primaryButtonLabel ||
            hero?.secondaryButtonLabel) && (
            <div className="page-hero__buttons">
              {hero.primaryButtonLabel &&
                hero.primaryButtonLink && (
                  <Link
                    to={hero.primaryButtonLink}
                    className="button button--light"
                  >
                    {hero.primaryButtonLabel}
                    <ArrowUpRight size={18} />
                  </Link>
                )}

              {hero.secondaryButtonLabel &&
                hero.secondaryButtonLink && (
                  <Link
                    to={hero.secondaryButtonLink}
                    className="button button--ghost-light"
                  >
                    {hero.secondaryButtonLabel}
                  </Link>
                )}
            </div>
          )}
        </div>

        {isHome && (
          <div className="page-hero__aside">
            <span>İSTANBUL · TÜRKİYE</span>
            <span>GÖMLEK ÜRETİMİ</span>
          </div>
        )}
      </Container>

      {isHome && (
        <button
          type="button"
          className="page-hero__scroll"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }}
        >
          <span>Keşfet</span>
          <ArrowDown size={17} />
        </button>
      )}

      {!isHome && (
        <div className="page-hero__index-line">
          <span />
        </div>
      )}
    </section>
  );
};

export default PageHero;