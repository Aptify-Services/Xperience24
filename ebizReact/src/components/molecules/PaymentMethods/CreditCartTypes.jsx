import { useEffect, useState } from "react";
import Proptypes from "prop-types";

export default function CreditCardTypes({ cardNumber, cardNumberIndexToCheckAt }) {
  const [masterCardDisabled, setMasterCardDisabled] = useState(true);
  const [visaCardDisabled, setVisaCardDisabled] = useState(true);
  const [amexCardDisabled, setAmexCardDisabled] = useState(true);
  const [discoverCardDisabled, setDiscoverCardDisabled] = useState(true);
  const [number] = useState(cardNumber);
  const [indexToCheckAt] = useState(indexToCheckAt);

  useEffect(() => {
    highlightSelectedCardType(number, cardNumberIndexToCheckAt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const highlightSelectedCardType = (_number, _indexToCheckAt) => {
    // visa
    if (_number.charAt(_indexToCheckAt) == "4") {
      setVisaCardDisabled(false);
      setMasterCardDisabled(true);
      setDiscoverCardDisabled(true);
      setAmexCardDisabled(true);
    }

    // Mastercard
    if (_number.charAt(_indexToCheckAt) == "5") {
      setMasterCardDisabled(false);
      setVisaCardDisabled(true);
      setDiscoverCardDisabled(true);
      setAmexCardDisabled(true);
    }

    // AMEX
    if (_number.charAt(_indexToCheckAt) == "3") {
      setAmexCardDisabled(false);
      setMasterCardDisabled(true);
      setDiscoverCardDisabled(true);
      setVisaCardDisabled(true);
    }

    // Discover
    if (_number.charAt(_indexToCheckAt) == "6") {
      setDiscoverCardDisabled(false);
      setMasterCardDisabled(true);
      setVisaCardDisabled(true);
      setAmexCardDisabled(true);
    }
  };

  return (
    <>
      <div className="mb-3">
        <label className="mb-2" htmlFor="Accepted Cards">
          Accepted Cards
        </label>
        <ul className="flex eb-accepted-card">
          <li className={`eb-card master  ${masterCardDisabled && "cdisabled"}`} />
          <li className={`eb-card discover ${discoverCardDisabled && "cdisabled"}`} />
          <li className={`eb-card amex ${amexCardDisabled && "cdisabled"}`} />
          <li className={`eb-card visa ${visaCardDisabled && "cdisabled"}`} />
        </ul>
      </div>
    </>
  );
}

CreditCardTypes.propTypes = {
  cardNumber: Proptypes.number,
  cardNumberIndexToCheckAt: Proptypes.number
};
