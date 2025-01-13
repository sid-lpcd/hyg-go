import "./Header.scss";
import logo from "../../../assets/logo/logo-hyggo.png";
import { Link } from "react-router-dom";

const Header = ({ leftElement = null, rightElement = null }) => {
  return (
    <header className="header header--wrapper">
      {leftElement && <div className="header__left">{leftElement}</div>}
      <Link to="/" className="header__logo-link">
        <img src={logo} alt="Hyg-go log" className="header__logo" />
      </Link>
      {rightElement && <div className="header__right">{rightElement}</div>}
    </header>
  );
};

export default Header;
