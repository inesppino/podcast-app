import PropTypes from "prop-types";

const Summary = ({ image, name, author, description }) => {
  return (
    <div className="summary">
      <div className="summary--image">
        <img src={image} alt={`${name} logo`} />
      </div>
      <div className="summary--info">
        <p className="summary--info-title">{name}</p>
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
};

export default Summary;
