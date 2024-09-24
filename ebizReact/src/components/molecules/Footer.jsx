import React from "react";
import "@css/Footer.scss"; // Custom CSS for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <p className="footer-text">
              &copy; e-Business 7.0 by Aptify (Part of the Community Brands family){" "}
            </p>
          </div>
          <div className="col-md-6 text-right">
            <p className="footer-text">
              <a href="/privacy-policy" className="privacy-link">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
