import CardsSection from "./CardsSection";
import ContactFormSection from "./ContactFormSection";
import CtaSection from "./CtaSection";
import ImageTextSection from "./ImageTextSection";
import StatsSection from "./StatsSection";
import StepsSection from "./StepsSection";
import TextSection from "./TextSection";

const sectionComponents = {
  text: TextSection,
  imageText: ImageTextSection,
  cards: CardsSection,
  steps: StepsSection,
  stats: StatsSection,
  cta: CtaSection,
  contactForm: ContactFormSection,
};

const SectionRenderer = ({ section }) => {
  if (!section || section.isVisible === false) {
    return null;
  }

  const Component = sectionComponents[section.type];

  if (!Component) {
    console.warn(
      `Desteklenmeyen bölüm türü: ${section.type}`
    );

    return null;
  }

  return (
    <Component
      section={section}
      key={section._id || section.key}
    />
  );
};

export default SectionRenderer;