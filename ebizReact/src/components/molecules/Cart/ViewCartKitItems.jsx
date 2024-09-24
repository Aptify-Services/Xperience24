import PropTypes from "prop-types";

import { ebConfig } from "@configuration/ebConfig";
import { Text } from "@components/atoms";

export default function ViewCartKitItems({ item, fromCart, assemblyType, isLastElement }) {
  const loadDefaultImage = ebConfig.loadDefaultImage;

  return (
    <div className={`grid border-100 my-1 ${!isLastElement && "border-bottom-2"}`}>
      <div className="lg:col-2 col-3">
        <div>
          <img
            alt=""
            className="eb-cover-image w-full h-6rem block border-round-xl"
            src={
              loadDefaultImage
                ? `${ebConfig.thumbnailImageURL}/coming-soon.png`
                : `${ebConfig.thumbnailImageURL}/${item?.productId}${ebConfig.imageExtension}`
            }
            onError={(e) => {
              e.target.src = `${ebConfig.thumbnailImageURL}/coming-soon.png`;
            }}
          />
        </div>
      </div>
      <div className="lg:col-10 col-9">
        {fromCart && (
          <div>
            <p
              className="font-semibold text-900 eb-overflow--single-line"
              title={item?.productName}
            >
              {item?.webName || item.productName}
            </p>
          </div>
        )}
        {!fromCart && (
          <div>
            <p className="text-sm text-color-secondary eb-overflow--single-line" title={item?.name}>
              {item.name}
            </p>
          </div>
        )}
        <div>
          <p className="text-sm text-color-secondary eb-overflow eb-overflow--triple-line">
            <Text>{item?.description}</Text>
          </p>
        </div>
        {assemblyType === "Group" && (
          <div>
            <strong>
              {item.currencySymbol}:
              {parseFloat(item.defaultPrice)?.toFixed(ebConfig.roundOffDigitsAfterDecimal || 2)}
            </strong>
          </div>
        )}
        <div className="text-sm text-color-secondary">Quantity: {item.quantity}</div>
      </div>
    </div>
  );
}

ViewCartKitItems.propTypes = {
  item: PropTypes.shape({
    webName: PropTypes.string,
    productId: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
    productName: PropTypes.string.isRequired, // Name of the product
    name: PropTypes.string.isRequired, // Name of the item
    description: PropTypes.string.isRequired, // Description of the item
    currencySymbol: PropTypes.string.isRequired, // Currency symbol
    defaultPrice: PropTypes.number.isRequired, // Default price of the item
    quantity: PropTypes.number.isRequired // Quantity of the item
  }).isRequired,
  fromCart: PropTypes.bool.isRequired, // Indicates whether the item is from the cart or not
  assemblyType: PropTypes.string.isRequired, // Type of assembly ("Group" or other)
  isLastElement: PropTypes.bool
};
