import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getSiteSettings } from "../services/settingsService";

const SiteContext = createContext(null);

const fallbackSettings = {
  brandName: "Ustalar Gömlek",
  logo: "",
  logoLight: "",
  navigation: [
    {
      label: "Hakkımızda",
      path: "/hakkimizda",
      order: 1,
      isVisible: true,
    },
    {
      label: "Tasarım",
      path: "/tasarim",
      order: 2,
      isVisible: true,
    },
    {
      label: "Üretim",
      path: "/uretim",
      order: 3,
      isVisible: true,
    },
    {
      label: "İhracat",
      path: "/ihracat",
      order: 4,
      isVisible: true,
    },
    {
      label: "İletişim",
      path: "/iletisim",
      order: 5,
      isVisible: true,
    },
  ],
  contact: {
    address: "",
    phone: "",
    secondaryPhone: "",
    email: "",
    mapLink: "",
    workingHours: "",
  },
  socialLinks: [],
  footer: {
    description:
      "Markalara özel tasarım, üretim ve ihracat çözümleri.",
    copyright: "Ustalar Gömlek. Tüm hakları saklıdır.",
    legalLinks: [],
  },
  defaultSeo: {
    title: "Ustalar Gömlek",
    description: "",
    keywords: [],
  },
};

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(fallbackSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getSiteSettings();

      setSettings({
        ...fallbackSettings,
        ...response,
        contact: {
          ...fallbackSettings.contact,
          ...(response.contact || {}),
        },
        footer: {
          ...fallbackSettings.footer,
          ...(response.footer || {}),
        },
        defaultSeo: {
          ...fallbackSettings.defaultSeo,
          ...(response.defaultSeo || {}),
        },
      });
    } catch (requestError) {
      console.error("Site ayarları alınamadı:", requestError);

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

  const visibleNavigation = useMemo(() => {
    return [...(settings.navigation || [])]
      .filter((item) => item.isVisible !== false)
      .sort((firstItem, secondItem) => {
        return (firstItem.order || 0) - (secondItem.order || 0);
      });
  }, [settings.navigation]);

  const contextValue = useMemo(
    () => ({
      settings,
      visibleNavigation,
      isLoading,
      error,
      refreshSettings: loadSettings,
    }),
    [
      settings,
      visibleNavigation,
      isLoading,
      error,
      loadSettings,
    ]
  );

  return (
    <SiteContext.Provider value={contextValue}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);

  if (!context) {
    throw new Error(
      "useSite yalnızca SiteProvider içerisinde kullanılabilir."
    );
  }

  return context;
};