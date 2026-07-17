import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Save,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useParams,
} from "react-router";

import AdminSectionEditor from "../../components/admin/AdminSectionEditor";
import {
  getAdminPageBySlug,
  updateAdminPage,
} from "../../services/adminPageService";

const cloneData = (value) => {
  return JSON.parse(JSON.stringify(value));
};

const normalizePage = (page) => {
  return {
    ...page,
    navLabel: page.navLabel || "",
    title: page.title || "",
    order: page.order || 0,
    isPublished: page.isPublished !== false,
    hero: {
      eyebrow: "",
      title: "",
      description: "",
      image: "",
      imageAlt: "",
      primaryButtonLabel: "",
      primaryButtonLink: "",
      secondaryButtonLabel: "",
      secondaryButtonLink: "",
      overlayOpacity: 0.5,
      ...(page.hero || {}),
    },
    sections: (page.sections || []).map(
      (section, index) => ({
        ...section,
        key: section.key || `section-${index + 1}`,
        title: section.title || "",
        eyebrow: section.eyebrow || "",
        subtitle: section.subtitle || "",
        description: section.description || "",
        paragraphs: section.paragraphs || [],
        items: section.items || [],
        cta: {
          label: "",
          href: "",
          ...(section.cta || {}),
        },
        order:
          typeof section.order === "number"
            ? section.order
            : index + 1,
        isVisible: section.isVisible !== false,
      })
    ),
    seo: {
      title: "",
      description: "",
      keywords: [],
      ...(page.seo || {}),
    },
  };
};

const getPublicPath = (slug) => {
  return slug === "anasayfa" ? "/" : `/${slug}`;
};

const AdminPageEditorPage = () => {
  const { slug } = useParams();

  const [pageData, setPageData] = useState(null);
  const [initialPageData, setInitialPageData] =
    useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const loadPage = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      setFeedback("");

      const response = await getAdminPageBySlug(slug);
      const normalizedPage = normalizePage(response);

      setPageData(normalizedPage);
      setInitialPageData(cloneData(normalizedPage));
    } catch (requestError) {
      console.error(
        "Düzenlenecek sayfa alınamadı:",
        requestError
      );

      setError(
        requestError.message ||
          "Sayfa içeriği yüklenemedi."
      );
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const hasChanges = useMemo(() => {
    if (!pageData || !initialPageData) {
      return false;
    }

    return (
      JSON.stringify(pageData) !==
      JSON.stringify(initialPageData)
    );
  }, [pageData, initialPageData]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!hasChanges) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [hasChanges]);

  const updateRootField = (field, value) => {
    setPageData((currentData) => ({
      ...currentData,
      [field]: value,
    }));

    setFeedback("");
  };

  const updateHeroField = (field, value) => {
    setPageData((currentData) => ({
      ...currentData,
      hero: {
        ...currentData.hero,
        [field]: value,
      },
    }));

    setFeedback("");
  };

  const updateSeoField = (field, value) => {
    setPageData((currentData) => ({
      ...currentData,
      seo: {
        ...currentData.seo,
        [field]: value,
      },
    }));

    setFeedback("");
  };

  const updateSectionField = (
    sectionIndex,
    field,
    value
  ) => {
    setPageData((currentData) => {
      const sections = [...currentData.sections];

      sections[sectionIndex] = {
        ...sections[sectionIndex],
        [field]: value,
      };

      return {
        ...currentData,
        sections,
      };
    });

    setFeedback("");
  };

  const updateParagraph = (
    sectionIndex,
    paragraphIndex,
    value
  ) => {
    setPageData((currentData) => {
      const sections = [...currentData.sections];
      const paragraphs = [
        ...(sections[sectionIndex].paragraphs || []),
      ];

      paragraphs[paragraphIndex] = value;

      sections[sectionIndex] = {
        ...sections[sectionIndex],
        paragraphs,
      };

      return {
        ...currentData,
        sections,
      };
    });

    setFeedback("");
  };

  const addParagraph = (sectionIndex) => {
    setPageData((currentData) => {
      const sections = [...currentData.sections];

      sections[sectionIndex] = {
        ...sections[sectionIndex],
        paragraphs: [
          ...(sections[sectionIndex].paragraphs || []),
          "",
        ],
      };

      return {
        ...currentData,
        sections,
      };
    });
  };

  const removeParagraph = (
    sectionIndex,
    paragraphIndex
  ) => {
    setPageData((currentData) => {
      const sections = [...currentData.sections];
      const paragraphs = [
        ...(sections[sectionIndex].paragraphs || []),
      ];

      paragraphs.splice(paragraphIndex, 1);

      sections[sectionIndex] = {
        ...sections[sectionIndex],
        paragraphs,
      };

      return {
        ...currentData,
        sections,
      };
    });
  };

  const updateItem = (
    sectionIndex,
    itemIndex,
    field,
    value
  ) => {
    setPageData((currentData) => {
      const sections = [...currentData.sections];
      const items = [
        ...(sections[sectionIndex].items || []),
      ];

      items[itemIndex] = {
        ...items[itemIndex],
        [field]: value,
      };

      sections[sectionIndex] = {
        ...sections[sectionIndex],
        items,
      };

      return {
        ...currentData,
        sections,
      };
    });

    setFeedback("");
  };

  const addItem = (sectionIndex, newItem) => {
    setPageData((currentData) => {
      const sections = [...currentData.sections];

      sections[sectionIndex] = {
        ...sections[sectionIndex],
        items: [
          ...(sections[sectionIndex].items || []),
          newItem,
        ],
      };

      return {
        ...currentData,
        sections,
      };
    });
  };

  const removeItem = (sectionIndex, itemIndex) => {
    setPageData((currentData) => {
      const sections = [...currentData.sections];
      const items = [
        ...(sections[sectionIndex].items || []),
      ];

      items.splice(itemIndex, 1);

      sections[sectionIndex] = {
        ...sections[sectionIndex],
        items,
      };

      return {
        ...currentData,
        sections,
      };
    });
  };

  const updateCta = (
    sectionIndex,
    field,
    value
  ) => {
    setPageData((currentData) => {
      const sections = [...currentData.sections];

      sections[sectionIndex] = {
        ...sections[sectionIndex],
        cta: {
          ...(sections[sectionIndex].cta || {}),
          [field]: value,
        },
      };

      return {
        ...currentData,
        sections,
      };
    });

    setFeedback("");
  };

  const moveSection = (
    sectionIndex,
    direction
  ) => {
    setPageData((currentData) => {
      const sections = [...currentData.sections];
      const targetIndex = sectionIndex + direction;

      if (
        targetIndex < 0 ||
        targetIndex >= sections.length
      ) {
        return currentData;
      }

      const [movedSection] = sections.splice(
        sectionIndex,
        1
      );

      sections.splice(targetIndex, 0, movedSection);

      const orderedSections = sections.map(
        (section, index) => ({
          ...section,
          order: index + 1,
        })
      );

      return {
        ...currentData,
        sections: orderedSections,
      };
    });
  };

  const handleReset = () => {
    if (!initialPageData) {
      return;
    }

    const confirmed = window.confirm(
      "Kaydedilmemiş değişiklikler geri alınacak. Devam edilsin mi?"
    );

    if (!confirmed) {
      return;
    }

    setPageData(cloneData(initialPageData));
    setFeedback("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving || !pageData) {
      return;
    }

    if (!pageData.title.trim()) {
      setError("Sayfa başlığı boş bırakılamaz.");
      return;
    }

    if (!pageData.hero.title.trim()) {
      setError("Hero başlığı boş bırakılamaz.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setFeedback("");

      const payload = {
        navLabel: pageData.navLabel.trim(),
        title: pageData.title.trim(),
        order: Number(pageData.order) || 0,
        isPublished: Boolean(pageData.isPublished),
        hero: {
          ...pageData.hero,
          overlayOpacity:
            Number(pageData.hero.overlayOpacity) || 0,
        },
        sections: pageData.sections.map(
          (section, index) => ({
            ...section,
            order: index + 1,
          })
        ),
        seo: {
          ...pageData.seo,
          keywords: pageData.seo.keywords || [],
        },
      };

      const response = await updateAdminPage(
        slug,
        payload
      );

      const normalizedPage = normalizePage(
        response.data
      );

      setPageData(normalizedPage);
      setInitialPageData(cloneData(normalizedPage));
      setFeedback(response.message);
    } catch (requestError) {
      console.error(
        "Sayfa güncellenemedi:",
        requestError
      );

      setError(
        requestError.message ||
          "Sayfa kaydedilirken bir hata oluştu."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page-loader">
        <div className="admin-session-loader__spinner" />
        <p>Sayfa içeriği hazırlanıyor</p>
      </div>
    );
  }

  if (error && !pageData) {
    return (
      <div className="admin-editor-load-error">
        <strong>Sayfa yüklenemedi.</strong>
        <p>{error}</p>

        <button
          type="button"
          className="admin-primary-button"
          onClick={loadPage}
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <form
      className="admin-page-editor"
      onSubmit={handleSubmit}
    >
      <div className="admin-page-editor__top">
        <div>
          <Link
            to="/admin/sayfalar"
            className="admin-editor-back-link"
          >
            <ArrowLeft size={16} />
            Sayfalara Dön
          </Link>

          <span>İÇERİK DÜZENLEME</span>

          <h1>{pageData.title}</h1>

          <p>
            /{pageData.slug}
            {hasChanges && (
              <strong> · Kaydedilmemiş değişiklik var</strong>
            )}
          </p>
        </div>

        <div className="admin-page-editor__top-actions">
          <a
            href={getPublicPath(pageData.slug)}
            target="_blank"
            rel="noreferrer"
            className="admin-secondary-button"
          >
            <Eye size={17} />
            Sayfayı Gör
          </a>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={isSaving || !hasChanges}
          >
            {isSaving ? (
              <>
                <span className="admin-button-spinner" />
                Kaydediliyor
              </>
            ) : (
              <>
                <Save size={17} />
                Değişiklikleri Kaydet
              </>
            )}
          </button>
        </div>
      </div>

      {error && pageData && (
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

      <div className="admin-page-editor__layout">
        <div className="admin-page-editor__main">
          <section className="admin-editor-card">
            <div className="admin-editor-card__heading">
              <div>
                <span>01</span>

                <div>
                  <h2>Genel sayfa bilgileri</h2>
                  <p>
                    Yönetim panelinde ve menüde kullanılacak
                    temel alanlar.
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-editor-card__body">
              <div className="admin-editor-grid">
                <label className="admin-editor-field">
                  <span>Sayfa adı</span>

                  <input
                    type="text"
                    value={pageData.title}
                    onChange={(event) =>
                      updateRootField(
                        "title",
                        event.target.value
                      )
                    }
                    required
                  />
                </label>

                <label className="admin-editor-field">
                  <span>Menüde görünen ad</span>

                  <input
                    type="text"
                    value={pageData.navLabel}
                    onChange={(event) =>
                      updateRootField(
                        "navLabel",
                        event.target.value
                      )
                    }
                    required
                  />
                </label>

                <label className="admin-editor-field">
                  <span>Sayfa sırası</span>

                  <input
                    type="number"
                    min="0"
                    value={pageData.order}
                    onChange={(event) =>
                      updateRootField(
                        "order",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="admin-editor-switch">
                  <input
                    type="checkbox"
                    checked={pageData.isPublished}
                    onChange={(event) =>
                      updateRootField(
                        "isPublished",
                        event.target.checked
                      )
                    }
                  />

                  <span>
                    <strong>Sayfa yayında</strong>
                    <small>
                      Kapatılırsa ziyaretçiler bu sayfaya
                      erişemez.
                    </small>
                  </span>
                </label>
              </div>
            </div>
          </section>

          <section className="admin-editor-card">
            <div className="admin-editor-card__heading">
              <div>
                <span>02</span>

                <div>
                  <h2>Hero alanı</h2>
                  <p>
                    Sayfanın en üstündeki büyük başlık ve
                    görsel alanı.
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-editor-card__body">
              <div className="admin-editor-grid">
                <label className="admin-editor-field">
                  <span>Üst etiket</span>

                  <input
                    type="text"
                    value={pageData.hero.eyebrow}
                    onChange={(event) =>
                      updateHeroField(
                        "eyebrow",
                        event.target.value
                      )
                    }
                    placeholder="01 / HAKKIMIZDA"
                  />
                </label>

                <label className="admin-editor-field">
                  <span>Karartma oranı</span>
                  <small>
                    0 ile 1 arasında bir değer kullanın.
                  </small>

                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={pageData.hero.overlayOpacity}
                    onChange={(event) =>
                      updateHeroField(
                        "overlayOpacity",
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>

              <label className="admin-editor-field">
                <span>Ana başlık</span>

                <textarea
                  rows={3}
                  value={pageData.hero.title}
                  onChange={(event) =>
                    updateHeroField(
                      "title",
                      event.target.value
                    )
                  }
                  required
                />
              </label>

              <label className="admin-editor-field">
                <span>Kısa açıklama</span>

                <textarea
                  rows={4}
                  value={pageData.hero.description}
                  onChange={(event) =>
                    updateHeroField(
                      "description",
                      event.target.value
                    )
                  }
                />
              </label>

              <div className="admin-editor-grid">
                <label className="admin-editor-field">
                  <span>Hero görsel yolu</span>
                  <small>
                    Örnek:
                    /images/pages/about-hero.webp
                  </small>

                  <input
                    type="text"
                    value={pageData.hero.image}
                    onChange={(event) =>
                      updateHeroField(
                        "image",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="admin-editor-field">
                  <span>Görsel açıklaması</span>

                  <input
                    type="text"
                    value={pageData.hero.imageAlt}
                    onChange={(event) =>
                      updateHeroField(
                        "imageAlt",
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>

              <div className="admin-editor-panel">
                <div className="admin-editor-panel__heading">
                  <div>
                    <strong>Hero butonları</strong>
                    <small>
                      Boş bırakılan butonlar sitede
                      gösterilmez.
                    </small>
                  </div>
                </div>

                <div className="admin-editor-grid">
                  <label className="admin-editor-field">
                    <span>Birinci buton metni</span>

                    <input
                      type="text"
                      value={
                        pageData.hero.primaryButtonLabel
                      }
                      onChange={(event) =>
                        updateHeroField(
                          "primaryButtonLabel",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-editor-field">
                    <span>Birinci buton bağlantısı</span>

                    <input
                      type="text"
                      value={
                        pageData.hero.primaryButtonLink
                      }
                      onChange={(event) =>
                        updateHeroField(
                          "primaryButtonLink",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-editor-field">
                    <span>İkinci buton metni</span>

                    <input
                      type="text"
                      value={
                        pageData.hero.secondaryButtonLabel
                      }
                      onChange={(event) =>
                        updateHeroField(
                          "secondaryButtonLabel",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-editor-field">
                    <span>İkinci buton bağlantısı</span>

                    <input
                      type="text"
                      value={
                        pageData.hero.secondaryButtonLink
                      }
                      onChange={(event) =>
                        updateHeroField(
                          "secondaryButtonLink",
                          event.target.value
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section className="admin-editor-card">
            <div className="admin-editor-card__heading">
              <div>
                <span>03</span>

                <div>
                  <h2>Sayfa bölümleri</h2>
                  <p>
                    Sayfadaki bütün metin, kart, adım ve
                    istatistik alanlarını düzenleyin.
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-editor-card__body admin-editor-card__body--sections">
              {pageData.sections.map(
                (section, sectionIndex) => (
                  <AdminSectionEditor
                    key={
                      section._id ||
                      `${section.key}-${sectionIndex}`
                    }
                    section={section}
                    sectionIndex={sectionIndex}
                    totalSections={
                      pageData.sections.length
                    }
                    onFieldChange={updateSectionField}
                    onParagraphChange={updateParagraph}
                    onAddParagraph={addParagraph}
                    onRemoveParagraph={removeParagraph}
                    onItemChange={updateItem}
                    onAddItem={addItem}
                    onRemoveItem={removeItem}
                    onCtaChange={updateCta}
                    onMove={moveSection}
                  />
                )
              )}
            </div>
          </section>

          <section className="admin-editor-card">
            <div className="admin-editor-card__heading">
              <div>
                <span>04</span>

                <div>
                  <h2>SEO ayarları</h2>
                  <p>
                    Arama sonuçlarında kullanılacak başlık ve
                    açıklamalar.
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-editor-card__body">
              <label className="admin-editor-field">
                <span>SEO başlığı</span>

                <input
                  type="text"
                  value={pageData.seo.title}
                  onChange={(event) =>
                    updateSeoField(
                      "title",
                      event.target.value
                    )
                  }
                  placeholder="Hakkımızda | Ustalar Gömlek"
                />
              </label>

              <label className="admin-editor-field">
                <span>SEO açıklaması</span>

                <textarea
                  rows={4}
                  value={pageData.seo.description}
                  onChange={(event) =>
                    updateSeoField(
                      "description",
                      event.target.value
                    )
                  }
                />
              </label>

              <label className="admin-editor-field">
                <span>Anahtar kelimeler</span>
                <small>
                  Kelimeleri virgülle ayırın.
                </small>

                <input
                  type="text"
                  value={(pageData.seo.keywords || []).join(
                    ", "
                  )}
                  onChange={(event) =>
                    updateSeoField(
                      "keywords",
                      event.target.value
                        .split(",")
                        .map((keyword) => keyword.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="gömlek üretimi, gömlek imalatı"
                />
              </label>
            </div>
          </section>
        </div>

        <aside className="admin-page-editor__sidebar">
          <section className="admin-editor-summary">
            <span>YAYIN DURUMU</span>

            <strong>
              {pageData.isPublished
                ? "Sayfa yayında"
                : "Sayfa taslakta"}
            </strong>

            <p>
              Son değişiklikleri ziyaretçilere göstermek için
              kaydetmelisiniz.
            </p>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={isSaving || !hasChanges}
            >
              {isSaving ? (
                <>
                  <span className="admin-button-spinner" />
                  Kaydediliyor
                </>
              ) : (
                <>
                  <Save size={17} />
                  Kaydet
                </>
              )}
            </button>

            <button
              type="button"
              className="admin-secondary-button"
              onClick={handleReset}
              disabled={!hasChanges || isSaving}
            >
              Değişiklikleri Geri Al
            </button>
          </section>

          <section className="admin-editor-help">
            <span>GÖRSEL KULLANIMI</span>

            <p>
              Admin panelinden dosya yüklenmez. Görselleri
              aşağıdaki klasörlere ekleyin:
            </p>

            <code>frontend/public/images/home/</code>
            <code>frontend/public/images/pages/</code>

            <p>
              Daha sonra formdaki görsel yolu alanına örneğin
              şunu yazın:
            </p>

            <code>/images/pages/about-hero.webp</code>
          </section>
        </aside>
      </div>
    </form>
  );
};

export default AdminPageEditorPage;