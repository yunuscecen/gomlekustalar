import {
  FileText,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftClose,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router";

import { useAdminAuth } from "../context/AdminAuthContext";

const adminNavigation = [
  {
    label: "Genel Bakış",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Sayfalar",
    path: "/admin/sayfalar",
    icon: FileText,
  },
  {
    label: "Site Ayarları",
    path: "/admin/site-ayarlari",
    icon: Settings,
  },
  {
    label: "Mesajlar",
    path: "/admin/mesajlar",
    icon: MessageSquare,
  },
  {
    label: "Şifre Değiştir",
    path: "/admin/sifre",
    icon: KeyRound,
  },
];

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);
  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);
      await logout();

      navigate("/admin/giris", {
        replace: true,
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className={`admin-shell ${
        sidebarCollapsed
          ? "admin-shell--collapsed"
          : ""
      }`}
    >
      <aside
        className={`admin-sidebar ${
          mobileMenuOpen
            ? "admin-sidebar--mobile-open"
            : ""
        }`}
      >
        <div className="admin-sidebar__heading">
          <NavLink
            to="/admin"
            className="admin-sidebar__brand"
          >
            <span>UG</span>

            <div>
              <strong>USTALAR</strong>
              <small>YÖNETİM PANELİ</small>
            </div>
          </NavLink>

          <button
            type="button"
            className="admin-sidebar__mobile-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Yönetim menüsünü kapat"
          >
            <X size={22} />
          </button>
        </div>

        <nav
          className="admin-sidebar__navigation"
          aria-label="Yönetim menüsü"
        >
          <span className="admin-sidebar__navigation-title">
            YÖNETİM
          </span>

          {adminNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `admin-navigation-link ${
                    isActive
                      ? "admin-navigation-link--active"
                      : ""
                  }`
                }
                title={
                  sidebarCollapsed
                    ? item.label
                    : undefined
                }
              >
                <Icon size={19} />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__profile">
            <span className="admin-sidebar__avatar">
              {admin?.name?.charAt(0)?.toUpperCase() ||
                "A"}
            </span>

            <div>
              <strong>{admin?.name}</strong>
              <small>{admin?.email}</small>
            </div>
          </div>

          <button
            type="button"
            className="admin-sidebar__logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut size={18} />

            <span>
              {isLoggingOut
                ? "Çıkış yapılıyor"
                : "Çıkış Yap"}
            </span>
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Yönetim menüsünü kapat"
        />
      )}

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button
              type="button"
              className="admin-mobile-menu-button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Yönetim menüsünü aç"
            >
              <Menu size={22} />
            </button>

            <button
              type="button"
              className="admin-sidebar-collapse-button"
              onClick={() =>
                setSidebarCollapsed(
                  (currentValue) => !currentValue
                )
              }
              aria-label={
                sidebarCollapsed
                  ? "Menüyü genişlet"
                  : "Menüyü daralt"
              }
            >
              <PanelLeftClose size={20} />
            </button>

            <div>
              <span>USTALAR GÖMLEK</span>
              <strong>İçerik Yönetimi</strong>
            </div>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="admin-view-site-link"
          >
            Siteyi Görüntüle
          </a>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;