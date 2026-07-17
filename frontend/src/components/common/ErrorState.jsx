import { RefreshCw } from "lucide-react";

import Container from "./Container";

const ErrorState = ({
  title = "İçerik yüklenemedi",
  message,
  onRetry,
}) => {
  return (
    <section className="error-state">
      <Container size="narrow">
        <span className="section-kicker">BİR SORUN OLUŞTU</span>

        <h1>{title}</h1>

        <p>
          {message ||
            "İçerik yüklenirken beklenmeyen bir hata oluştu."}
        </p>

        {onRetry && (
          <button
            type="button"
            className="button button--dark"
            onClick={onRetry}
          >
            <RefreshCw size={17} />
            Tekrar Dene
          </button>
        )}
      </Container>
    </section>
  );
};

export default ErrorState;