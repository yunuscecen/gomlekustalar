import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router";

import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
} from "../services/authService";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const location = useLocation();

  const [admin, setAdmin] = useState(null);
  const [sessionChecked, setSessionChecked] =
    useState(false);
  const [isCheckingAuth, setIsCheckingAuth] =
    useState(false);

  const isAdminArea =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/");

  const checkAdminSession = useCallback(async () => {
    try {
      setIsCheckingAuth(true);

      const currentAdmin = await getCurrentAdmin();

      setAdmin(currentAdmin);
    } catch (requestError) {
      /*
        Kullanıcı giriş yapmamışsa /auth/me isteğinin
        401 dönmesi normaldir.
      */
      if (requestError.status !== 401) {
        console.error(
          "Yönetici oturumu kontrol edilemedi:",
          requestError
        );
      }

      setAdmin(null);
    } finally {
      setSessionChecked(true);
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdminArea || sessionChecked) {
      return;
    }

    checkAdminSession();
  }, [
    isAdminArea,
    sessionChecked,
    checkAdminSession,
  ]);

  const login = useCallback(async (credentials) => {
    const loggedInAdmin = await loginAdmin(credentials);

    setAdmin(loggedInAdmin);
    setSessionChecked(true);

    return loggedInAdmin;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAdmin();
    } finally {
      setAdmin(null);
      setSessionChecked(true);
    }
  }, []);

  const refreshAdmin = useCallback(async () => {
    await checkAdminSession();
  }, [checkAdminSession]);

  const contextValue = useMemo(
    () => ({
      admin,
      isAuthenticated: Boolean(admin),
      isCheckingAuth:
        isAdminArea &&
        (!sessionChecked || isCheckingAuth),
      login,
      logout,
      refreshAdmin,
    }),
    [
      admin,
      isAdminArea,
      sessionChecked,
      isCheckingAuth,
      login,
      logout,
      refreshAdmin,
    ]
  );

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth yalnızca AdminAuthProvider içerisinde kullanılabilir."
    );
  }

  return context;
};