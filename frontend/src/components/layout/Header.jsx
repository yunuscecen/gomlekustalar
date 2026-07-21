import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  useLocation,
} from "react-router";

import { useSite } from "../../context/SiteContext";
import Container from "../common/Container";

const Header = () => {
  const { settings, visibleNavigation } = useSite();
  const location = useLocation();

  const [menuIsOpen, setMenuIsOpen] =
    useState(false);

  const [isScrolled, setIsScrolled] =
    useState(false);

  const headerNavigation = useMemo(() => {
    const dynamicNavigation =
      visibleNavigation.filter(
        (item) => item.path !== "/galeri"
      );

    // const galleryNavigationItem = {
    //   label: "Galeri",
    //   path: "/galeri",
    //   isStatic: true,
    // };

    const contactIndex =
      dynamicNavigation.findIndex(
        (item) => item.path === "/iletisim"
      );

    if (contactIndex === -1) {
      return [
        ...dynamicNavigation,
        // galleryNavigationItem,
      ];
    }

    return [
      ...dynamicNavigation.slice(
        0,
        contactIndex
      ),

      // galleryNavigationItem,

      ...dynamicNavigation.slice(
        contactIndex
      ),
    ];
  }, [visibleNavigation]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  useEffect(() => {
    setMenuIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow =
      menuIsOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuIsOpen]);

  return (
    <header
      className={`site-header ${
        isScrolled
          ? "site-header--scrolled"
          : ""
      } ${
        menuIsOpen
          ? "site-header--menu-open"
          : ""
      }`}
    >
      <Container className="site-header__inner">
        <Link
          to="/"
          className="brand"
          aria-label={`${settings.brandName} anasayfa`}
        >
         
          <span className="brand__text">
            <strong>USTALAR GÖMLEK</strong>
            
          </span>
        </Link>

        <nav
          className={`main-navigation ${
            menuIsOpen
              ? "main-navigation--open"
              : ""
          }`}
          aria-label="Ana menü"
        >
          <div className="main-navigation__mobile-heading">
            <span>MENÜ</span>

            <button
              type="button"
              onClick={() =>
                setMenuIsOpen(false)
              }
              aria-label="Menüyü kapat"
            >
              <X size={24} />
            </button>
          </div>

          <div className="main-navigation__links">
            {headerNavigation.map(
              (
                navigationItem,
                index
              ) => (
                <NavLink
                  key={`${navigationItem.path}-${navigationItem.label}`}
                  to={navigationItem.path}
                  className={({
                    isActive,
                  }) =>
                    `navigation-link ${
                      isActive
                        ? "navigation-link--active"
                        : ""
                    }`
                  }
                >
                  {/* <span className="navigation-link__number">
                    {String(
                      index + 1
                    ).padStart(2, "0")}
                  </span> */}

                  <span>
                    {navigationItem.label}
                  </span>
                </NavLink>
              )
            )}
          </div>

          <div className="main-navigation__mobile-footer">
            <p>
              Koleksiyon ve üretim
              ihtiyaçlarınız için bizimle
              iletişime geçin.
            </p>

            <Link
              to="/iletisim"
              className="button button--light"
            >
              İletişime Geçin
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </nav>

        <div className="site-header__actions">
     

          <button
            type="button"
            className="menu-toggle"
            onClick={() =>
              setMenuIsOpen(true)
            }
            aria-label="Menüyü aç"
            aria-expanded={menuIsOpen}
          >
            <Menu size={23} />
          </button>
        </div>
      </Container>
    </header>
  );
};

export default Header;