import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAdminSettings,
  updateAdminSettings,
} from "../../services/adminSettingsService";

const cloneData = (value) => {
  return JSON.parse(JSON.stringify(value));
};

const createNavigationItem = (order) => {
  return {
    label: "Yeni Menü",
    path: "/",
    order,
    isVisible: true,
  };
};

const normalizeSettings = (settings = {}) => {
  const navigationSource =
    settings.navigation || settings.menu || [];

  const socialSource =
    settings.socialLinks || settings.social || {};

  return {
    ...settings,

    brand: {
      name:
        settings.brand?.name ||
        settings.siteName ||
        "Ustalar Gömlek",

      shortName:
        settings.brand?.shortName ||
        settings.shortName ||
        "UG",

      tagline:
        settings.brand?.tagline || "",
    },

    logo: {
      light:
        settings.logo?.light ||
        settings.logoLight ||
        "",

      dark:
        settings.logo?.dark ||
        settings.logoDark ||
        "",

      favicon:
        settings.logo?.favicon ||
        settings.favicon ||
        "",
    },

    navigation: navigationSource.map(
      (item, index) => ({
        ...item,

        label: item.label || "",

        path:
          item.path ||
          item.href ||
          "/",

        order:
          typeof item.order === "number"
            ? item.order
            : index + 1,

        isVisible: item.isVisible !== false,
      })
    ),

    contact: {
      phone: settings.contact?.phone || "",
      email: settings.contact?.email || "",
      address: settings.contact?.address || "",

      workingHours:
        settings.contact?.workingHours || "",

      mapUrl:
        settings.contact?.mapUrl ||
        settings.contact?.mapEmbedUrl ||
        "",
    },

    socialLinks: {
      instagram: socialSource.instagram || "",
      linkedin: socialSource.linkedin || "",
      facebook: socialSource.facebook || "",
      youtube: socialSource.youtube || "",
    },

    footer: {
      description:
        settings.footer?.description || "",

      copyright:
        settings.footer?.copyright || "",
    },

    defaultSeo: {
      title:
        settings.defaultSeo?.title || "",

      description:
        settings.defaultSeo?.description || "",

      keywords:
        Array.isArray(
          settings.defaultSeo?.keywords
        )
          ? settings.defaultSeo.keywords
          : [],
    },
  };
};

const extractSavedSettings = (response) => {
  return (
    response?.data?.settings ||
    response?.settings ||
    response?.data ||
    response
  );
};

const AdminField = ({
  label,
  description = "",
  children,
}) => {
  return (
    <label className="admin-editor-field">
      <span>{label}</span>

      {description && (
        <small>{description}</small>
      )}

      {children}
    </label>
  );
};

const SettingsImagePreview = ({
  path,
  label,
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [path]);

  return (
    <div className="admin-settings-image-preview">
      <span>{label}</span>

      {path && !hasError ? (
        <img
          src={path}
          alt={label}
          onError={() => setHasError(true)}
        />
      ) : (
        <div>
          <strong>Ön izleme yok</strong>

          <small>
            Geçerli bir görsel yolu yazın.
          </small>
        </div>
      )}
    </div>
  );
};

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState(null);

  const [initialSettings, setInitialSettings] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      setFeedback("");

      const response = await getAdminSettings();

      const normalizedSettings =
        normalizeSettings(response);

      setSettings(normalizedSettings);

      setInitialSettings(
        cloneData(normalizedSettings)
      );
    } catch (requestError) {
      console.error(
        "Site ayarları alınamadı:",
        requestError
      );

      setError(
        requestError.message ||
          "Site ayarları yüklenirken bir hata oluştu."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const hasChanges = useMemo(() => {
    if (!settings || !initialSettings) {
      return false;
    }

    return (
      JSON.stringify(settings) !==
      JSON.stringify(initialSettings)
    );
  }, [settings, initialSettings]);

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

  const updateNestedField = (
    group,
    field,
    value
  ) => {
    setSettings((currentSettings) => ({
      ...currentSettings,

      [group]: {
        ...currentSettings[group],
        [field]: value,
      },
    }));

    setFeedback("");
    setError("");
  };

  const updateNavigationItem = (
    itemIndex,
    field,
    value
  ) => {
    setSettings((currentSettings) => {
      const navigation = [
        ...currentSettings.navigation,
      ];

      navigation[itemIndex] = {
        ...navigation[itemIndex],
        [field]: value,
      };

      return {
        ...currentSettings,
        navigation,
      };
    });

    setFeedback("");
  };

  const addNavigationItem = () => {
    setSettings((currentSettings) => ({
      ...currentSettings,

      navigation: [
        ...currentSettings.navigation,

        createNavigationItem(
          currentSettings.navigation.length + 1
        ),
      ],
    }));

    setFeedback("");
  };

  const removeNavigationItem = (itemIndex) => {
    const confirmed = window.confirm(
      "Bu menü bağlantısı kaldırılacak. Devam edilsin mi?"
    );

    if (!confirmed) {
      return;
    }

    setSettings((currentSettings) => {
      const navigation =
        currentSettings.navigation
          .filter(
            (_, index) => index !== itemIndex
          )
          .map((item, index) => ({
            ...item,
            order: index + 1,
          }));

      return {
        ...currentSettings,
        navigation,
      };
    });

    setFeedback("");
  };

  const moveNavigationItem = (
    itemIndex,
    direction
  ) => {
    setSettings((currentSettings) => {
      const navigation = [
        ...currentSettings.navigation,
      ];

      const targetIndex =
        itemIndex + direction;

      if (
        targetIndex < 0 ||
        targetIndex >= navigation.length
      ) {
        return currentSettings;
      }

      const [movedItem] = navigation.splice(
        itemIndex,
        1
      );

      navigation.splice(
        targetIndex,
        0,
        movedItem
      );

      const orderedNavigation =
        navigation.map((item, index) => ({
          ...item,
          order: index + 1,
        }));

      return {
        ...currentSettings,
        navigation: orderedNavigation,
      };
    });

    setFeedback("");
  };

  const handleReset = () => {
    if (!initialSettings || !hasChanges) {
      return;
    }

    const confirmed = window.confirm(
      "Kaydedilmemiş bütün değişiklikler geri alınacak. Devam edilsin mi?"
    );

    if (!confirmed) {
      return;
    }

    setSettings(cloneData(initialSettings));
    setError("");
    setFeedback("");
  };

  const validateSettings = () => {
    if (!settings.brand.name.trim()) {
      return "Marka adı boş bırakılamaz.";
    }

    if (!settings.brand.shortName.trim()) {
      return "Marka kısa adı boş bırakılamaz.";
    }

    const invalidNavigationItem =
      settings.navigation.find(
        (item) =>
          !item.label.trim() ||
          !item.path.trim()
      );

    if (invalidNavigationItem) {
      return "Menü bağlantılarının adı ve yolu boş bırakılamaz.";
    }

    if (
      settings.contact.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        settings.contact.email
      )
    ) {
      return "Geçerli bir iletişim e-posta adresi yazın.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!settings || isSaving) {
      return;
    }

    const validationError =
      validateSettings();

    if (validationError) {
      setError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setFeedback("");

      const payload = {
        brand: {
          name: settings.brand.name.trim(),

          shortName:
            settings.brand.shortName.trim(),

          tagline:
            settings.brand.tagline.trim(),
        },

        logo: {
          light: settings.logo.light.trim(),
          dark: settings.logo.dark.trim(),

          favicon:
            settings.logo.favicon.trim(),
        },

        navigation:
          settings.navigation.map(
            (item, index) => ({
              ...item,

              label: item.label.trim(),
              path: item.path.trim(),
              order: index + 1,

              isVisible:
                item.isVisible !== false,
            })
          ),

        contact: {
          phone:
            settings.contact.phone.trim(),

          email:
            settings.contact.email.trim(),

          address:
            settings.contact.address.trim(),

          workingHours:
            settings.contact.workingHours.trim(),

          mapUrl:
            settings.contact.mapUrl.trim(),
        },

        socialLinks: {
          instagram:
            settings.socialLinks.instagram.trim(),

          linkedin:
            settings.socialLinks.linkedin.trim(),

          facebook:
            settings.socialLinks.facebook.trim(),

          youtube:
            settings.socialLinks.youtube.trim(),
        },

        footer: {
          description:
            settings.footer.description.trim(),

          copyright:
            settings.footer.copyright.trim(),
        },

        defaultSeo: {
          title:
            settings.defaultSeo.title.trim(),

          description:
            settings.defaultSeo.description.trim(),

          keywords:
            settings.defaultSeo.keywords,
        },
      };

      const response =
        await updateAdminSettings(payload);

      const savedSettings =
        normalizeSettings(
          extractSavedSettings(response)
        );

      setSettings(savedSettings);

      setInitialSettings(
        cloneData(savedSettings)
      );

      setFeedback(
        response?.message ||
          "Site ayarları başarıyla güncellendi."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (requestError) {
      console.error(
        "Site ayarları güncellenemedi:",
        requestError
      );

      setError(
        requestError.message ||
          "Site ayarları kaydedilirken bir hata oluştu."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page-loader">
        <div className="admin-session-loader__spinner" />

        <p>Site ayarları hazırlanıyor</p>
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="admin-editor-load-error">
        <strong>
          Site ayarları yüklenemedi.
        </strong>

        <p>{error}</p>

        <button
          type="button"
          className="admin-primary-button"
          onClick={loadSettings}
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <form
      className="admin-settings-page"
      onSubmit={handleSubmit}
    >
      <div className="admin-page-heading">
        <div>
          <span>GENEL AYARLAR</span>

          <h1>Site Ayarları</h1>

          <p>
            Marka, menü, iletişim, sosyal medya,
            footer ve varsayılan SEO bilgilerini
            tek merkezden yönetin.
          </p>

          {hasChanges && (
            <strong className="admin-unsaved-label">
              Kaydedilmemiş değişiklikler var.
            </strong>
          )}
        </div>

        <div className="admin-settings-heading-actions">
          <button
            type="button"
            className="admin-secondary-button"
            onClick={loadSettings}
            disabled={isLoading || isSaving}
          >
            <RefreshCw size={17} />
            Yenile
          </button>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? (
              <>
                <span className="admin-button-spinner" />
                Kaydediliyor
              </>
            ) : (
              <>
                <Save size={17} />
                Ayarları Kaydet
              </>
            )}
          </button>
        </div>
      </div>

      {error && settings && (
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

      <div className="admin-settings-layout">
        <div className="admin-settings-main">
          <section className="admin-editor-card">
            <div className="admin-editor-card__heading">
              <div>
                <span>01</span>

                <div>
                  <h2>Marka bilgileri</h2>

                  <p>
                    Sitede kullanılacak marka adı ve
                    kısa tanımlama.
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-editor-card__body">
              <div className="admin-editor-grid">
                <AdminField label="Marka adı">
                  <input
                    type="text"
                    value={settings.brand.name}
                    onChange={(event) =>
                      updateNestedField(
                        "brand",
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="Ustalar Gömlek"
                  />
                </AdminField>

                <AdminField
                  label="Kısa marka adı"
                  description="Logo kullanılamadığında gösterilir."
                >
                  <input
                    type="text"
                    value={
                      settings.brand.shortName
                    }
                    onChange={(event) =>
                      updateNestedField(
                        "brand",
                        "shortName",
                        event.target.value
                      )
                    }
                    placeholder="UG"
                  />
                </AdminField>
              </div>

              <AdminField label="Marka sloganı">
                <input
                  type="text"
                  value={settings.brand.tagline}
                  onChange={(event) =>
                    updateNestedField(
                      "brand",
                      "tagline",
                      event.target.value
                    )
                  }
                  placeholder="Gömlek üretiminde güvenilir çözüm ortağınız"
                />
              </AdminField>
            </div>
          </section>

          <section className="admin-editor-card">
            <div className="admin-editor-card__heading">
              <div>
                <span>02</span>

                <div>
                  <h2>Logo ve favicon</h2>

                  <p>
                    Görseller yüklenmez; public
                    klasöründeki dosya yolları yazılır.
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-editor-card__body">
              <div className="admin-editor-grid">
                <AdminField
                  label="Açık zemin logosu"
                  description="Örnek: /images/brand/logo-dark.svg"
                >
                  <input
                    type="text"
                    value={settings.logo.dark}
                    onChange={(event) =>
                      updateNestedField(
                        "logo",
                        "dark",
                        event.target.value
                      )
                    }
                    placeholder="/images/brand/logo-dark.svg"
                  />
                </AdminField>

                <AdminField
                  label="Koyu zemin logosu"
                  description="Örnek: /images/brand/logo-light.svg"
                >
                  <input
                    type="text"
                    value={settings.logo.light}
                    onChange={(event) =>
                      updateNestedField(
                        "logo",
                        "light",
                        event.target.value
                      )
                    }
                    placeholder="/images/brand/logo-light.svg"
                  />
                </AdminField>
              </div>

              <AdminField
                label="Favicon yolu"
                description="Örnek: /favicon.svg"
              >
                <input
                  type="text"
                  value={settings.logo.favicon}
                  onChange={(event) =>
                    updateNestedField(
                      "logo",
                      "favicon",
                      event.target.value
                    )
                  }
                  placeholder="/favicon.svg"
                />
              </AdminField>

              <div className="admin-settings-preview-grid">
                <SettingsImagePreview
                  path={settings.logo.dark}
                  label="Açık zemin logosu"
                />

                <SettingsImagePreview
                  path={settings.logo.light}
                  label="Koyu zemin logosu"
                />
              </div>
            </div>
          </section>

          <section className="admin-editor-card">
            <div className="admin-editor-card__heading">
              <div>
                <span>03</span>

                <div>
                  <h2>Site menüsü</h2>

                  <p>
                    Menü bağlantılarını sıralayın,
                    gizleyin veya düzenleyin.
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-editor-card__body">
              <div className="admin-editor-panel__heading">
                <div>
                  <strong>
                    Menü bağlantıları
                  </strong>

                  <small>
                    Sürdürülebilirlik bağlantısını
                    yeniden eklemeyin.
                  </small>
                </div>

                <button
                  type="button"
                  onClick={addNavigationItem}
                >
                  <Plus size={16} />
                  Menü Ekle
                </button>
              </div>

              <div className="admin-settings-navigation-list">
                {settings.navigation.map(
                  (item, itemIndex) => (
                    <article
                      key={
                        item._id ||
                        `${item.path}-${itemIndex}`
                      }
                      className={`admin-settings-navigation-item ${
                        item.isVisible === false
                          ? "admin-settings-navigation-item--hidden"
                          : ""
                      }`}
                    >
                      <header>
                        <span>
                          {String(
                            itemIndex + 1
                          ).padStart(2, "0")}
                        </span>

                        <strong>
                          {item.label ||
                            "İsimsiz bağlantı"}
                        </strong>

                        <div>
                          <button
                            type="button"
                            title={
                              item.isVisible === false
                                ? "Menüde göster"
                                : "Menüde gizle"
                            }
                            onClick={() =>
                              updateNavigationItem(
                                itemIndex,
                                "isVisible",
                                item.isVisible ===
                                  false
                              )
                            }
                          >
                            {item.isVisible ===
                            false ? (
                              <EyeOff size={17} />
                            ) : (
                              <Eye size={17} />
                            )}
                          </button>

                          <button
                            type="button"
                            title="Yukarı taşı"
                            disabled={
                              itemIndex === 0
                            }
                            onClick={() =>
                              moveNavigationItem(
                                itemIndex,
                                -1
                              )
                            }
                          >
                            <ArrowUp size={17} />
                          </button>

                          <button
                            type="button"
                            title="Aşağı taşı"
                            disabled={
                              itemIndex ===
                              settings.navigation
                                .length -
                                1
                            }
                            onClick={() =>
                              moveNavigationItem(
                                itemIndex,
                                1
                              )
                            }
                          >
                            <ArrowDown size={17} />
                          </button>

                          <button
                            type="button"
                            className="admin-settings-delete-button"
                            title="Menü bağlantısını sil"
                            onClick={() =>
                              removeNavigationItem(
                                itemIndex
                              )
                            }
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </header>

                      <div className="admin-editor-grid">
                        <AdminField label="Menü adı">
                          <input
                            type="text"
                            value={item.label}
                            onChange={(event) =>
                              updateNavigationItem(
                                itemIndex,
                                "label",
                                event.target.value
                              )
                            }
                            placeholder="Hakkımızda"
                          />
                        </AdminField>

                        <AdminField
                          label="Bağlantı yolu"
                          description="Örnek: /hakkimizda"
                        >
                          <input
                            type="text"
                            value={item.path}
                            onChange={(event) =>
                              updateNavigationItem(
                                itemIndex,
                                "path",
                                event.target.value
                              )
                            }
                            placeholder="/hakkimizda"
                          />
                        </AdminField>
                      </div>
                    </article>
                  )
                )}
              </div>
            </div>
          </section>

          <section className="admin-editor-card">
            <div className="admin-editor-card__heading">
              <div>
                <span>04</span>

                <div>
                  <h2>İletişim bilgileri</h2>

                  <p>
                    Header, footer ve iletişim
                    sayfasında kullanılan bilgiler.
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-editor-card__body">
              <div className="admin-editor-grid">
                <AdminField label="Telefon">
                  <input
                    type="text"
                    value={settings.contact.phone}
                    onChange={(event) =>
                      updateNestedField(
                        "contact",
                        "phone",
                        event.target.value
                      )
                    }
                    placeholder="+90 212 000 00 00"
                  />
                </AdminField>

                <AdminField label="E-posta">
                  <input
                    type="email"
                    value={settings.contact.email}
                    onChange={(event) =>
                      updateNestedField(
                        "contact",
                        "email",
                        event.target.value
                      )
                    }
                    placeholder="info@ustalargomlek.com"
                  />
                </AdminField>
              </div>

              <AdminField label="Adres">
                <textarea
                  rows={4}
                  value={settings.contact.address}
                  onChange={(event) =>
                    updateNestedField(
                      "contact",
                      "address",
                      event.target.value
                    )
                  }
                  placeholder="İstanbul, Türkiye"
                />
              </AdminField>

              <div className="admin-editor-grid">
                <AdminField label="Çalışma saatleri">
                  <input
                    type="text"
                    value={
                      settings.contact.workingHours
                    }
                    onChange={(event) =>
                      updateNestedField(
                        "contact",
                        "workingHours",
                        event.target.value
                      )
                    }
                    placeholder="Pazartesi - Cuma / 09:00 - 18:00"
                  />
                </AdminField>

                <AdminField
                  label="Harita bağlantısı"
                  description="Google Maps bağlantısı yazılabilir."
                >
                  <input
                    type="url"
                    value={settings.contact.mapUrl}
                    onChange={(event) =>
                      updateNestedField(
                        "contact",
                        "mapUrl",
                        event.target.value
                      )
                    }
                    placeholder="https://maps.google.com/..."
                  />
                </AdminField>
              </div>
            </div>
          </section>

          <section className="admin-editor-card">
            <div className="admin-editor-card__heading">
              <div>
                <span>05</span>

                <div>
                  <h2>Sosyal medya</h2>

                  <p>
                    Boş bırakılan sosyal medya
                    bağlantıları sitede gösterilmez.
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-editor-card__body">
              <div className="admin-editor-grid">
                <AdminField label="Instagram">
                  <input
                    type="url"
                    value={
                      settings.socialLinks
                        .instagram
                    }
                    onChange={(event) =>
                      updateNestedField(
                        "socialLinks",
                        "instagram",
                        event.target.value
                      )
                    }
                    placeholder="https://instagram.com/..."
                  />
                </AdminField>

                <AdminField label="LinkedIn">
                  <input
                    type="url"
                    value={
                      settings.socialLinks.linkedin
                    }
                    onChange={(event) =>
                      updateNestedField(
                        "socialLinks",
                        "linkedin",
                        event.target.value
                      )
                    }
                    placeholder="https://linkedin.com/company/..."
                  />
                </AdminField>

                <AdminField label="Facebook">
                  <input
                    type="url"
                    value={
                      settings.socialLinks.facebook
                    }
                    onChange={(event) =>
                      updateNestedField(
                        "socialLinks",
                        "facebook",
                        event.target.value
                      )
                    }
                    placeholder="https://facebook.com/..."
                  />
                </AdminField>

                <AdminField label="YouTube">
                  <input
                    type="url"
                    value={
                      settings.socialLinks.youtube
                    }
                    onChange={(event) =>
                      updateNestedField(
                        "socialLinks",
                        "youtube",
                        event.target.value
                      )
                    }
                    placeholder="https://youtube.com/..."
                  />
                </AdminField>
              </div>
            </div>
          </section>

          <section className="admin-editor-card">
            <div className="admin-editor-card__heading">
              <div>
                <span>06</span>

                <div>
                  <h2>Footer bilgileri</h2>

                  <p>
                    Sitenin en altında gösterilecek
                    açıklama ve telif metni.
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-editor-card__body">
              <AdminField label="Footer açıklaması">
                <textarea
                  rows={5}
                  value={
                    settings.footer.description
                  }
                  onChange={(event) =>
                    updateNestedField(
                      "footer",
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Modern üretim anlayışıyla gömlek tasarımı ve üretimi."
                />
              </AdminField>

              <AdminField label="Telif metni">
                <input
                  type="text"
                  value={
                    settings.footer.copyright
                  }
                  onChange={(event) =>
                    updateNestedField(
                      "footer",
                      "copyright",
                      event.target.value
                    )
                  }
                  placeholder="© 2026 Ustalar Gömlek. Tüm hakları saklıdır."
                />
              </AdminField>
            </div>
          </section>

          <section className="admin-editor-card">
            <div className="admin-editor-card__heading">
              <div>
                <span>07</span>

                <div>
                  <h2>Varsayılan SEO</h2>

                  <p>
                    Özel SEO bilgisi olmayan sayfalarda
                    kullanılacak değerler.
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-editor-card__body">
              <AdminField label="Varsayılan SEO başlığı">
                <input
                  type="text"
                  value={
                    settings.defaultSeo.title
                  }
                  onChange={(event) =>
                    updateNestedField(
                      "defaultSeo",
                      "title",
                      event.target.value
                    )
                  }
                  placeholder="Ustalar Gömlek | Gömlek Üretimi"
                />
              </AdminField>

              <AdminField label="Varsayılan SEO açıklaması">
                <textarea
                  rows={5}
                  value={
                    settings.defaultSeo
                      .description
                  }
                  onChange={(event) =>
                    updateNestedField(
                      "defaultSeo",
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="İstanbul merkezli gömlek tasarım ve üretim firması."
                />
              </AdminField>

              <AdminField
                label="Anahtar kelimeler"
                description="Kelimeleri virgülle ayırın."
              >
                <input
                  type="text"
                  value={
                    settings.defaultSeo.keywords.join(
                      ", "
                    )
                  }
                  onChange={(event) =>
                    updateNestedField(
                      "defaultSeo",
                      "keywords",
                      event.target.value
                        .split(",")
                        .map((keyword) =>
                          keyword.trim()
                        )
                        .filter(Boolean)
                    )
                  }
                  placeholder="gömlek üretimi, gömlek imalatı, İstanbul"
                />
              </AdminField>
            </div>
          </section>
        </div>

        <aside className="admin-settings-sidebar">
          <section className="admin-editor-summary">
            <span>DEĞİŞİKLİK DURUMU</span>

            <strong>
              {hasChanges
                ? "Kaydedilmemiş değişiklik var"
                : "Bütün ayarlar güncel"}
            </strong>

            <p>
              Değişikliklerin ziyaretçilere
              yansıması için ayarları kaydetmeniz
              gerekir.
            </p>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? (
                <>
                  <span className="admin-button-spinner" />
                  Kaydediliyor
                </>
              ) : (
                <>
                  <Save size={17} />
                  Ayarları Kaydet
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
            <span>GÖRSEL KLASÖRLERİ</span>

            <p>
              Marka görsellerini aşağıdaki klasöre
              ekleyebilirsiniz:
            </p>

            <code>
              frontend/public/images/brand/
            </code>

            <p>
              Form alanlarında dosya yolu şu şekilde
              yazılmalıdır:
            </p>

            <code>
              /images/brand/logo-dark.svg
            </code>
          </section>
        </aside>
      </div>
    </form>
  );
};

export default AdminSettingsPage;