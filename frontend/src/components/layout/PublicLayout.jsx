import { Outlet } from "react-router";

import ScrollToTop from "../common/ScrollToTop";
import Footer from "./Footer";
import Header from "./Header";

const PublicLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Header />

      <main className="site-main">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default PublicLayout;