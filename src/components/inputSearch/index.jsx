import PropTypes from "prop-types";

const InputSearch = ({ onChange }) => {
  return (
    <input
      className="input--search"
      type="text"
      placeholder="Filter podcasts..."
      onChange={onChange}
    />
  );
};

InputSearch.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default InputSearch;
