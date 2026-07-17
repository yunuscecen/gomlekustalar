import Container from "../common/Container";

const TextSection = ({ section }) => {
  return (
    <section className="content-section text-section">
      <Container size="narrow">
        {section.eyebrow && (
          <span className="section-kicker">
            {section.eyebrow}
          </span>
        )}

        <h2>{section.title}</h2>

        {section.subtitle && (
          <p className="section-subtitle">
            {section.subtitle}
          </p>
        )}

        <div className="rich-text rich-text--large">
          {(section.paragraphs || []).map(
            (paragraph, index) => (
              <p key={`${section.key}-paragraph-${index}`}>
                {paragraph}
              </p>
            )
          )}
        </div>
      </Container>
    </section>
  );
};

export default TextSection;