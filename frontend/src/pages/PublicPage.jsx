import { useEffect, useMemo } from "react";

import ErrorState from "../components/common/ErrorState";
import PageLoader from "../components/common/PageLoader";
import PageHero from "../components/sections/PageHero";
import SectionRenderer from "../components/sections/SectionRenderer";
import { useSite } from "../context/SiteContext";
import { usePage } from "../hooks/usePage";

const updateMetaDescription = (description) => {
  let metaDescription = document.querySelector(
    'meta[name="description"]'
  );

  if (!metaDescription) {
    metaDescription = document.createElement("meta");
    metaDescription.setAttribute("name", "description");
    document.head.appendChild(metaDescription);
  }

  metaDescription.setAttribute("content", description || "");
};

const PublicPage = ({ slug }) => {
  const { settings } = useSite();

  const {
    page,
    isLoading,
    error,
    reloadPage,
  } = usePage(slug);

  const sections = useMemo(() => {
    return [...(page?.sections || [])]
      .filter((section) => section.isVisible !== false)
      .sort((firstSection, secondSection) => {
        return (
          (firstSection.order || 0) -
          (secondSection.order || 0)
        );
      });
  }, [page?.sections]);

  useEffect(() => {
    if (!page) {
      return;
    }

    const fallbackTitle =
      settings.defaultSeo?.title || "Ustalar Gömlek";

    document.title =
      page.seo?.title ||
      `${page.title} | ${fallbackTitle}`;

    updateMetaDescription(
      page.seo?.description ||
        settings.defaultSeo?.description ||
        ""
    );
  }, [page, settings.defaultSeo]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !page) {
    return (
      <ErrorState
        message={error}
        onRetry={reloadPage}
      />
    );
  }

  return (
    <div
      className={`public-page public-page--${page.slug}`}
    >
      <PageHero
        hero={page.hero}
        isHome={page.slug === "anasayfa"}
      />

      <div className="public-page__sections">
        {sections.map((section) => (
          <SectionRenderer
            key={section._id || section.key}
            section={section}
          />
        ))}
      </div>
    </div>
  );
};

export default PublicPage;