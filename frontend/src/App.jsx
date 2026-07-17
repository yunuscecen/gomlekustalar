import {
  Route,
  Routes,
} from "react-router";

import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import NotFoundPage from "./pages/NotFoundPage";
import PublicPage from "./pages/PublicPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
// import AdminPlaceholderPage from "./pages/admin/AdminPlaceholderPage";
import AdminPageEditorPage from "./pages/admin/AdminPageEditorPage";
import AdminPagesPage from "./pages/admin/AdminPagesPage";
import AdminMessageDetailPage from "./pages/admin/AdminMessageDetailPage";
import AdminMessagesPage from "./pages/admin/AdminMessagesPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import GalleryPage from "./pages/GalleryPage";
import AdminPasswordPage from "./pages/admin/AdminPasswordPage";

const App = () => {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route
          index
          element={<PublicPage slug="anasayfa" />}
        />

        <Route
          path="hakkimizda"
          element={<PublicPage slug="hakkimizda" />}
        />

        <Route
          path="tasarim"
          element={<PublicPage slug="tasarim" />}
        />

        <Route
          path="uretim"
          element={<PublicPage slug="uretim" />}
        />

       <Route
  path="ihracat"
  element={<PublicPage slug="ihracat" />}
/>

<Route
  path="galeri"
  element={<GalleryPage />}
/>

<Route
  path="iletisim"
  element={<PublicPage slug="iletisim" />}
/>
      </Route>

      {/* Admin giriş */}
      <Route
        path="admin/giris"
        element={<AdminLoginPage />}
      />

      {/* Korumalı admin paneli */}
      <Route element={<ProtectedAdminRoute />}>
        <Route
          path="admin"
          element={<AdminLayout />}
        >
          <Route
            index
            element={<AdminDashboardPage />}
          />

         <Route
  path="sayfalar"
  element={<AdminPagesPage />}
/>

<Route
  path="sayfalar/:slug"
  element={<AdminPageEditorPage />}
/>

         <Route
  path="site-ayarlari"
  element={<AdminSettingsPage />}
/>

          <Route
  path="mesajlar"
  element={<AdminMessagesPage />}
/>

<Route
  path="mesajlar/:messageId"
  element={<AdminMessageDetailPage />}
/>

         <Route
  path="sifre"
  element={<AdminPasswordPage />}
/>
        </Route>
      </Route>

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
};

export default App;