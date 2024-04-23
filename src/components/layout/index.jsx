import PropTypes from "prop-types";
import Header from "../header";

const Layout = ({ children }) => {
  return (
    <div className="layout__container">
      <Header />
      <main>{children}</main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
