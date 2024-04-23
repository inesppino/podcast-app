import { useSelector } from "react-redux";
import { Spinner } from "../spinner";

const Header = () => {
  const isLoading = useSelector((state) => state.global.isLoading);
  return (
    <header className="header__container">
      <a href="/">
        <h1>Podcaster</h1>
      </a>
      {isLoading ? <Spinner /> : null}
    </header>
  );
};

export default Header;
