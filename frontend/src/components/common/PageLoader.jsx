const PageLoader = () => {
  return (
    <div className="page-loader" role="status">
      <div className="page-loader__mark">
        <span />
        <span />
        <span />
      </div>

      <p>İçerik hazırlanıyor</p>
    </div>
  );
};

export default PageLoader;