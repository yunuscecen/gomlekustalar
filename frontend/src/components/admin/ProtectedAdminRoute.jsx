import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router";

import { useAdminAuth } from "../../context/AdminAuthContext";

const AdminSessionLoader = () => {
  return (
    <div className="admin-session-loader" role="status">
      <div className="admin-session-loader__spinner" />

      <p>Yönetici oturumu kontrol ediliyor</p>
    </div>
  );
};

const ProtectedAdminRoute = () => {
  const {
    isAuthenticated,
    isCheckingAuth,
  } = useAdminAuth();

  const location = useLocation();

  if (isCheckingAuth) {
    return <AdminSessionLoader />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/giris"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;