import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import Container from "../components/common/Container";

const NotFoundPage = () => {
  return (
    <section className="not-found-page">
      <Container>
        <span className="not-found-page__number">404</span>

        <div className="not-found-page__content">
          <span className="section-kicker">
            SAYFA BULUNAMADI
          </span>

          <h1>Aradığınız sayfa burada değil.</h1>

          <p>
            Sayfanın adresi değişmiş veya içerik kaldırılmış
            olabilir.
          </p>

          <Link
            to="/"
            className="button button--light"
          >
            <ArrowLeft size={17} />
            Anasayfaya Dön
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default NotFoundPage;