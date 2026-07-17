import {
  Construction,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router";

const AdminPlaceholderPage = ({
  eyebrow = "YÖNETİM",
  title,
  description,
}) => {
  return (
    <div className="admin-placeholder-page">
      <div className="admin-page-heading">
        <div>
          <span>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>

      <section className="admin-placeholder-card">
        <span className="admin-placeholder-card__icon">
          <Construction size={30} />
        </span>

        <h2>Bu bölüm hazırlanıyor.</h2>

        <p>
          Bir sonraki aşamada bu sayfanın gerçek
          yönetim formunu oluşturacağız.
        </p>

        <Link
          to="/admin"
          className="admin-primary-button"
        >
          <LayoutDashboard size={17} />
          Dashboard’a Dön
        </Link>
      </section>
    </div>
  );
};

export default AdminPlaceholderPage;