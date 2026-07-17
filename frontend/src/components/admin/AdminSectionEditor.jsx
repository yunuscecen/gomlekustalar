import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const sectionTypeLabels = {
  text: "Metin Alanı",
  imageText: "Görsel ve Metin",
  cards: "Kartlar",
  steps: "Üretim Adımları",
  stats: "İstatistikler",
  cta: "Çağrı Alanı",
  contactForm: "Harita ve İletişim Bilgileri",
};

const createEmptyItem = (sectionType) => {
  if (sectionType === "stats") {
    return {
      value: "",
      label: "",
    };
  }

  if (sectionType === "steps") {
    return {
      value: "",
      title: "",
      description: "",
    };
  }

  return {
    title: "",
    description: "",
    value: "",
    label: "",
    image: "",
    linkLabel: "",
    link: "",
  };
};

const AdminField = ({
  label,
  children,
  description = "",
  className = "",
}) => {
  return (
    <label
      className={`admin-editor-field ${className}`.trim()}
    >
      <span>{label}</span>

      {description && <small>{description}</small>}

      {children}
    </label>
  );
};

const AdminSectionEditor = ({
  section,
  sectionIndex,
  totalSections,
  onFieldChange,
  onParagraphChange,
  onAddParagraph,
  onRemoveParagraph,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onCtaChange,
  onMove,
}) => {
  const [isOpen, setIsOpen] = useState(
    sectionIndex === 0
  );

  const supportsParagraphs = [
    "text",
    "imageText",
  ].includes(section.type);

  const supportsItems = [
    "cards",
    "steps",
    "stats",
  ].includes(section.type);

  const supportsImage = section.type === "imageText";

  const supportsCta = [
    "imageText",
    "cta",
  ].includes(section.type);

  return (
    <article
      className={`admin-section-editor ${
        section.isVisible === false
          ? "admin-section-editor--hidden"
          : ""
      }`}
    >
      <header className="admin-section-editor__heading">
        <button
          type="button"
          className="admin-section-editor__toggle"
          onClick={() =>
            setIsOpen((currentValue) => !currentValue)
          }
        >
          <span className="admin-section-editor__number">
            {String(sectionIndex + 1).padStart(2, "0")}
          </span>

          <div>
            <strong>
              {section.title ||
                sectionTypeLabels[section.type] ||
                "İçerik Bölümü"}
            </strong>

            <small>
              {sectionTypeLabels[section.type] ||
                section.type}{" "}
              · {section.key}
            </small>
          </div>

          {isOpen ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </button>

        <div className="admin-section-editor__heading-actions">
          <button
            type="button"
            onClick={() =>
              onFieldChange(
                sectionIndex,
                "isVisible",
                section.isVisible === false
              )
            }
            title={
              section.isVisible === false
                ? "Bölümü göster"
                : "Bölümü gizle"
            }
          >
            {section.isVisible === false ? (
              <EyeOff size={17} />
            ) : (
              <Eye size={17} />
            )}
          </button>

          <button
            type="button"
            disabled={sectionIndex === 0}
            onClick={() => onMove(sectionIndex, -1)}
            title="Yukarı taşı"
          >
            <ArrowUp size={17} />
          </button>

          <button
            type="button"
            disabled={sectionIndex === totalSections - 1}
            onClick={() => onMove(sectionIndex, 1)}
            title="Aşağı taşı"
          >
            <ArrowDown size={17} />
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="admin-section-editor__body">
          <div className="admin-editor-grid">
            <AdminField label="Bölüm etiketi">
              <input
                type="text"
                value={section.eyebrow || ""}
                onChange={(event) =>
                  onFieldChange(
                    sectionIndex,
                    "eyebrow",
                    event.target.value
                  )
                }
                placeholder="Örneğin: ÜRETİM GÜCÜ"
              />
            </AdminField>

            <AdminField label="Bölüm anahtarı">
              <input
                type="text"
                value={section.key || ""}
                readOnly
                disabled
              />
            </AdminField>
          </div>

          <AdminField label="Bölüm başlığı">
            <input
              type="text"
              value={section.title || ""}
              onChange={(event) =>
                onFieldChange(
                  sectionIndex,
                  "title",
                  event.target.value
                )
              }
              placeholder="Bölüm başlığı"
            />
          </AdminField>

          {section.type !== "stats" &&
            section.type !== "steps" && (
              <AdminField label="Kısa açıklama">
                <textarea
                  rows={3}
                  value={section.description || ""}
                  onChange={(event) =>
                    onFieldChange(
                      sectionIndex,
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Bölümün kısa açıklaması"
                />
              </AdminField>
            )}

          {supportsImage && (
            <div className="admin-editor-panel">
              <div className="admin-editor-panel__heading">
                <div>
                  <strong>Görsel ayarları</strong>

                  <small>
                    Görsel yüklenmez; proje içindeki dosya
                    yolu yazılır.
                  </small>
                </div>
              </div>

              <div className="admin-editor-grid">
                <AdminField
                  label="Görsel yolu"
                  description="Örnek: /images/pages/about-story.webp"
                >
                  <input
                    type="text"
                    value={section.image || ""}
                    onChange={(event) =>
                      onFieldChange(
                        sectionIndex,
                        "image",
                        event.target.value
                      )
                    }
                    placeholder="/images/pages/gorsel.webp"
                  />
                </AdminField>

                <AdminField label="Görsel açıklaması">
                  <input
                    type="text"
                    value={section.imageAlt || ""}
                    onChange={(event) =>
                      onFieldChange(
                        sectionIndex,
                        "imageAlt",
                        event.target.value
                      )
                    }
                    placeholder="Görseli açıklayan kısa metin"
                  />
                </AdminField>

                <AdminField label="Görsel konumu">
                  <select
                    value={section.imagePosition || "right"}
                    onChange={(event) =>
                      onFieldChange(
                        sectionIndex,
                        "imagePosition",
                        event.target.value
                      )
                    }
                  >
                    <option value="left">Solda</option>
                    <option value="right">Sağda</option>
                    <option value="full">Tam genişlik</option>
                  </select>
                </AdminField>
              </div>
            </div>
          )}

          {supportsParagraphs && (
            <div className="admin-editor-panel">
              <div className="admin-editor-panel__heading">
                <div>
                  <strong>Paragraflar</strong>

                  <small>
                    Metinleri sıralı biçimde düzenleyin.
                  </small>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onAddParagraph(sectionIndex)
                  }
                >
                  <Plus size={16} />
                  Paragraf Ekle
                </button>
              </div>

              <div className="admin-repeatable-list">
                {(section.paragraphs || []).map(
                  (paragraph, paragraphIndex) => (
                    <div
                      key={`${section.key}-paragraph-${paragraphIndex}`}
                      className="admin-repeatable-row"
                    >
                      <span>
                        {String(paragraphIndex + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <textarea
                        rows={4}
                        value={paragraph}
                        onChange={(event) =>
                          onParagraphChange(
                            sectionIndex,
                            paragraphIndex,
                            event.target.value
                          )
                        }
                        placeholder="Paragraf metni"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          onRemoveParagraph(
                            sectionIndex,
                            paragraphIndex
                          )
                        }
                        aria-label="Paragrafı sil"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {supportsItems && (
            <div className="admin-editor-panel">
              <div className="admin-editor-panel__heading">
                <div>
                  <strong>
                    {section.type === "cards"
                      ? "Kartlar"
                      : section.type === "steps"
                        ? "Adımlar"
                        : "İstatistikler"}
                  </strong>

                  <small>
                    Bu bölümde gösterilecek içerikleri
                    düzenleyin.
                  </small>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onAddItem(
                      sectionIndex,
                      createEmptyItem(section.type)
                    )
                  }
                >
                  <Plus size={16} />
                  Yeni Ekle
                </button>
              </div>

              <div className="admin-items-list">
                {(section.items || []).map(
                  (item, itemIndex) => (
                    <article
                      key={
                        item._id ||
                        `${section.key}-item-${itemIndex}`
                      }
                      className="admin-item-editor"
                    >
                      <header>
                        <strong>
                          {section.type === "stats"
                            ? item.label ||
                              `İstatistik ${itemIndex + 1}`
                            : item.title ||
                              `İçerik ${itemIndex + 1}`}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            onRemoveItem(
                              sectionIndex,
                              itemIndex
                            )
                          }
                          aria-label="İçeriği sil"
                        >
                          <Trash2 size={17} />
                        </button>
                      </header>

                      {section.type === "stats" && (
                        <div className="admin-editor-grid">
                          <AdminField label="Değer">
                            <input
                              type="text"
                              value={item.value || ""}
                              onChange={(event) =>
                                onItemChange(
                                  sectionIndex,
                                  itemIndex,
                                  "value",
                                  event.target.value
                                )
                              }
                              placeholder="20.000"
                            />
                          </AdminField>

                          <AdminField label="Açıklama">
                            <input
                              type="text"
                              value={item.label || ""}
                              onChange={(event) =>
                                onItemChange(
                                  sectionIndex,
                                  itemIndex,
                                  "label",
                                  event.target.value
                                )
                              }
                              placeholder="Aylık üretim kapasitesi"
                            />
                          </AdminField>
                        </div>
                      )}

                      {section.type === "steps" && (
                        <>
                          <div className="admin-editor-grid">
                            <AdminField label="Sıra değeri">
                              <input
                                type="text"
                                value={item.value || ""}
                                onChange={(event) =>
                                  onItemChange(
                                    sectionIndex,
                                    itemIndex,
                                    "value",
                                    event.target.value
                                  )
                                }
                                placeholder="01"
                              />
                            </AdminField>

                            <AdminField label="Adım başlığı">
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(event) =>
                                  onItemChange(
                                    sectionIndex,
                                    itemIndex,
                                    "title",
                                    event.target.value
                                  )
                                }
                                placeholder="Kesim"
                              />
                            </AdminField>
                          </div>

                          <AdminField label="Adım açıklaması">
                            <textarea
                              rows={3}
                              value={item.description || ""}
                              onChange={(event) =>
                                onItemChange(
                                  sectionIndex,
                                  itemIndex,
                                  "description",
                                  event.target.value
                                )
                              }
                              placeholder="Adımın kısa açıklaması"
                            />
                          </AdminField>
                        </>
                      )}

                      {section.type === "cards" && (
                        <>
                          <AdminField label="Kart başlığı">
                            <input
                              type="text"
                              value={item.title || ""}
                              onChange={(event) =>
                                onItemChange(
                                  sectionIndex,
                                  itemIndex,
                                  "title",
                                  event.target.value
                                )
                              }
                              placeholder="Kart başlığı"
                            />
                          </AdminField>

                          <AdminField label="Kart açıklaması">
                            <textarea
                              rows={3}
                              value={item.description || ""}
                              onChange={(event) =>
                                onItemChange(
                                  sectionIndex,
                                  itemIndex,
                                  "description",
                                  event.target.value
                                )
                              }
                              placeholder="Kart açıklaması"
                            />
                          </AdminField>

                          <div className="admin-editor-grid">
                            <AdminField label="Görsel yolu">
                              <input
                                type="text"
                                value={item.image || ""}
                                onChange={(event) =>
                                  onItemChange(
                                    sectionIndex,
                                    itemIndex,
                                    "image",
                                    event.target.value
                                  )
                                }
                                placeholder="/images/home/gorsel.webp"
                              />
                            </AdminField>

                            <AdminField label="Buton metni">
                              <input
                                type="text"
                                value={item.linkLabel || ""}
                                onChange={(event) =>
                                  onItemChange(
                                    sectionIndex,
                                    itemIndex,
                                    "linkLabel",
                                    event.target.value
                                  )
                                }
                                placeholder="Detayları İnceleyin"
                              />
                            </AdminField>

                            <AdminField label="Buton bağlantısı">
                              <input
                                type="text"
                                value={item.link || ""}
                                onChange={(event) =>
                                  onItemChange(
                                    sectionIndex,
                                    itemIndex,
                                    "link",
                                    event.target.value
                                  )
                                }
                                placeholder="/uretim"
                              />
                            </AdminField>
                          </div>
                        </>
                      )}
                    </article>
                  )
                )}
              </div>
            </div>
          )}

          {supportsCta && (
            <div className="admin-editor-panel">
              <div className="admin-editor-panel__heading">
                <div>
                  <strong>Buton ayarları</strong>

                  <small>
                    Bölümde kullanılacak bağlantıyı düzenleyin.
                  </small>
                </div>
              </div>

              <div className="admin-editor-grid">
                <AdminField label="Buton metni">
                  <input
                    type="text"
                    value={section.cta?.label || ""}
                    onChange={(event) =>
                      onCtaChange(
                        sectionIndex,
                        "label",
                        event.target.value
                      )
                    }
                    placeholder="İletişime Geçin"
                  />
                </AdminField>

                <AdminField label="Buton bağlantısı">
                  <input
                    type="text"
                    value={section.cta?.href || ""}
                    onChange={(event) =>
                      onCtaChange(
                        sectionIndex,
                        "href",
                        event.target.value
                      )
                    }
                    placeholder="/iletisim"
                  />
                </AdminField>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default AdminSectionEditor;