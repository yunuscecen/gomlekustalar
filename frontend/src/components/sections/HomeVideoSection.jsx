const HomeVideoSection = () => {
  return (
    <section
      className="home-video-section"
      aria-label="Ustalar Gömlek tanıtım videosu"
    >
      <div className="home-video-section__frame">
        <video
          className="home-video-section__video"
          src="/video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          Tarayıcınız video oynatmayı desteklemiyor.
        </video>
      </div>
    </section>
  );
};

export default HomeVideoSection;