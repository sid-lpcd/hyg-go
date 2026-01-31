import "./Header.scss";
import logo from "../../../assets/logo/logo-hyggo.png";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface HeaderProps {
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  leftElement = null,
  rightElement = null,
}) => {
  return (
    <header className="header">
      <div className="header__side header__side--left">
        {leftElement}
      </div>

      <Link to="/" className="header__logo-link">
        <img src={logo} alt="Hyg-go logo" className="header__logo" />
      </Link>

      <div className="header__side header__side--right">
        {rightElement}
      </div>
    </header>
  );
};

export default Header;
