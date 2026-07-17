import Container from "../common/Container";

const StatsSection = ({ section }) => {
  return (
    <section className="content-section stats-section">
      <Container>
        <div className="section-heading section-heading--light">
          <div>
            {section.eyebrow && (
              <span className="section-kicker">
                {section.eyebrow}
              </span>
            )}

            <h2>{section.title}</h2>
          </div>
        </div>

        <div className="stats-grid">
          {(section.items || []).map((item, index) => (
            <article
              key={`${section.key}-${item.label}-${index}`}
              className="stat-item"
            >
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default StatsSection;