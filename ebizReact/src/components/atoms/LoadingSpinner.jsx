import { ProgressSpinner } from "primereact/progressspinner";
import PropTypes from "prop-types";

export default function LoadingSpinner({ ...props }) {
  return (
    <>
      <div {...props}>
        <ProgressSpinner
          strokeWidth="4"
          className={`h-3rem w-3rem ${props?.className}`}
          animationDuration=".5s"
          {...props}
        />
      </div>
    </>
  );
}

LoadingSpinner.propTypes = {
  className: PropTypes.string // Additional CSS class name for the spinner container
};
