import PropTypes from "prop-types";

const Card = ({ image, title, name, author }) => {
  return (
    <div className="card">
      <img className="card--image" src={image} alt={`${title} logo`} />
      <h4 className="card--title">{name}</h4>
      <p className="card--author">Author: {author} </p>
    </div>
  );
};

Card.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

export default Card;
