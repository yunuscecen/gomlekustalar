import {
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Container from "../components/common/Container";

const galleryImages = Array.from(
  { length: 7 },
  (_, index) => ({
    id: index + 1,
    src: `/galeri${index + 1}.jpg`,
    alt: `Ustalar Gömlek galeri görseli ${index + 1}`,
  })
);

const GalleryPage = () => {
  const [activeIndex, setActiveIndex] =
    useState(null);

  const isLightboxOpen = activeIndex !== null;

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPreviousImage = useCallback(() => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) {
        return null;
      }

      return currentIndex === 0
        ? galleryImages.length - 1
        : currentIndex - 1;
    });
  }, []);

  const showNextImage = useCallback(() => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) {
        return null;
      }

      return currentIndex ===
        galleryImages.length - 1
        ? 0
        : currentIndex + 1;
    });
  }, []);

  useEffect(() => {
    document.title = "Galeri | Ustalar Gömlek";

    let metaDescription = document.querySelector(
      'meta[name="description"]'
    );

    if (!metaDescription) {
      metaDescription =
        document.createElement("meta");

      metaDescription.setAttribute(
        "name",
        "description"
      );

      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute(
      "content",
      "Ustalar Gömlek üretim, ürün ve işçilik detaylarından oluşan galeri."
    );
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    closeLightbox,
    isLightboxOpen,
    showNextImage,
    showPreviousImage,
  ]);

  return (
    <main className="gallery-page">
      <section className="gallery-page__hero">
        <Container>
          <div className="gallery-page__hero-content">
            <span>USTALAR GÖMLEK</span>

            <h1>Galeri</h1>

            <p>
              Üretim, ürün ve işçilik
              detaylarımızdan seçilmiş kareler.
            </p>
          </div>
        </Container>
      </section>

      <section className="gallery-page__content">
        <Container>
          <div className="gallery-grid">
            {galleryImages.map(
              (image, imageIndex) => (
                <button
                  key={image.id}
                  type="button"
                  className="gallery-card"
                  onClick={() =>
                    setActiveIndex(imageIndex)
                  }
                  aria-label={`${image.alt} görselini büyüt`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading={
                      imageIndex < 4
                        ? "eager"
                        : "lazy"
                    }
                  />

                  <span className="gallery-card__overlay">
                    <span>
                      <Expand size={18} />
                    </span>
                  </span>

                  <span className="gallery-card__number">
                    {String(
                      imageIndex + 1
                    ).padStart(2, "0")}
                  </span>
                </button>
              )
            )}
          </div>
        </Container>
      </section>

      {isLightboxOpen && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Galeri görseli"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeLightbox();
            }
          }}
        >
          <div className="gallery-lightbox__top">
            <span>
              {String(
                activeIndex + 1
              ).padStart(2, "0")}
              {" / "}
              {String(
                galleryImages.length
              ).padStart(2, "0")}
            </span>

            <button
              type="button"
              className="gallery-lightbox__close"
              onClick={closeLightbox}
              aria-label="Galeriyi kapat"
            >
              <X size={25} />
            </button>
          </div>

          <button
            type="button"
            className="gallery-lightbox__navigation gallery-lightbox__navigation--previous"
            onClick={showPreviousImage}
            aria-label="Önceki görsel"
          >
            <ChevronLeft size={31} />
          </button>

          <div className="gallery-lightbox__image-wrapper">
            <img
              src={
                galleryImages[activeIndex].src
              }
              alt={
                galleryImages[activeIndex].alt
              }
            />
          </div>

          <button
            type="button"
            className="gallery-lightbox__navigation gallery-lightbox__navigation--next"
            onClick={showNextImage}
            aria-label="Sonraki görsel"
          >
            <ChevronRight size={31} />
          </button>

          <div className="gallery-lightbox__bottom">
            <p>
              {
                galleryImages[activeIndex]
                  .alt
              }
            </p>

            <span>
              Görseller arasında gezinmek için
              ok tuşlarını kullanabilirsiniz.
            </span>
          </div>
        </div>
      )}
    </main>
  );
};

export default GalleryPage;