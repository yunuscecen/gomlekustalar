import Container from "../common/Container";

const StepsSection = ({ section }) => {
  return (
    <section className="content-section steps-section">
      <Container>
        <div className="section-heading">
          <div>
            {section.eyebrow && (
              <span className="section-kicker">
                {section.eyebrow}
              </span>
            )}

            <h2>{section.title}</h2>
          </div>

          {section.description && (
            <p>{section.description}</p>
          )}
        </div>

        <div className="steps-grid">
          {(section.items || []).map((item, index) => (
            <article
              key={`${section.key}-${item.title}-${index}`}
              className="process-step"
            >
              <div className="process-step__top">
                <span>{item.value || index + 1}</span>
                <span className="process-step__line" />
              </div>

              <h3>{item.title}</h3>

              {item.description && (
                <p>{item.description}</p>
              )}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default StepsSection;