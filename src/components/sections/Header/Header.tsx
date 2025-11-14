import "./Header.scss";
import logo from "../../../assets/logo/logo-hyggo.png";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface HeaderProps {
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ leftElement = null, rightElement = null }) => {
  return (
    <header className="header">
      {leftElement}
      <Link to="/" className="header__logo-link">
        <img src={logo} alt="Hyg-go log" className="header__logo" />
      </Link>
      {rightElement}
    </header>
  );
};

export default Header;
