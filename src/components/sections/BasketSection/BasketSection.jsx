import "./BasketSection.scss";

const BasketSection = ({ basketState }) => {
  if (!basketState) {
    return (
      <div className="loader-overlay">
        <InfinitySpin
          visible={true}
          width="200"
          color="#ffffff"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }
  return <></>;
};

export default BasketSection;
