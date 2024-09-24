import PropTypes from "prop-types";

import SimpleButton from "./SimpleButton";

function IconLabelButton(props) {
  return (
    <div>
      {props.eventClick}
      <SimpleButton {...props} />
    </div>
  );
}

IconLabelButton.propTypes = {
  eventClick: PropTypes.func.isRequired // Function to be called when the button is clicked
};

export default IconLabelButton;
