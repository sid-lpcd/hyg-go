import "./Button.scss";

const Button = ({ classProp, btnText, clickHandler }) => {
  return (
    <button
      className={`${classProp}__btn`}
      role="button"
      onClick={clickHandler}
    >
      <span className={`${classProp}__btn-text`}>{btnText}</span>
    </button>
  );
};

export default Button;
