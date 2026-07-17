import { useCallback, useEffect, useState } from "react";

import { getPageBySlug } from "../services/pageService";

export const usePage = (slug) => {
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPage = useCallback(async () => {
    if (!slug) {
      setError("Sayfa adresi bulunamadı.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await getPageBySlug(slug);

      setPage(response);
    } catch (requestError) {
      console.error(`${slug} sayfası alınamadı:`, requestError);

      setError(
        requestError.message ||
          "Sayfa içeriği yüklenirken bir hata oluştu."
      );
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  return {
    page,
    isLoading,
    error,
    reloadPage: loadPage,
  };
};