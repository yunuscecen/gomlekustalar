const Container = ({
  children,
  className = "",
  size = "default",
}) => {
  return (
    <div
      className={`container container--${size} ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export default Container;