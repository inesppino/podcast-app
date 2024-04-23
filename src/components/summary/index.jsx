import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ConditionalLink = ({ link, id, children }) => {
  const to = link ? `${link}${id}` : null;

  return to ? <Link to={to}>{children}</Link> : <>{children}</>;
};

const Summary = ({ image, name, author, description, id, link }) => {
  return (
    <div className="summary">
      <ConditionalLink link={link} id={id}>
        <div className="summary--image">
          <img src={image} alt={`${name} logo`} />
        </div>
      </ConditionalLink>

      <div className="summary--info">
        <ConditionalLink link={link} id={id}>
          <p className="summary--info-title">{name}</p>
        </ConditionalLink>
        <p className="summary--info-author">by: {author}</p>
      </div>
      <div className="summary--description">
        <p className="summary--description-title">Description:</p>
        <p
          className="summary--description-text"
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        ></p>
      </div>
    </div>
  );
};

Summary.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  link: PropTypes.string,
};

export default Summary;
