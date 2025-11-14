import "./Button.scss";

interface ButtonProps {
  classProp: string;
  btnText: string;
  clickHandler: () => void;
}

const Button: React.FC<ButtonProps> = ({ classProp, btnText, clickHandler }) => {
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
