import { Dropdown } from "primereact/dropdown";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { _get } from "@api/APIClient.js";
import { updateShipmentTypeIdToCart } from "@store/CartSlice.js";
import { useStateCart } from "@hooks/useStateCart";

export default function ShippingMethod() {
  const dispatch = useDispatch();

  const { cart } = useStateCart();
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(cart?.shipmentTypeId || 0);

  useEffect(() => {
    //fetch shipping methods
    const fetchShippingMethods = async () => {
      await _get("/v1/ShoppingCarts/ShipmentTypes").then((response) => {
        setShippingMethods(response.data);
        if (cart?.shipmentTypeId > 0) {
          setSelectedShippingMethod(cart?.shipmentTypeId);
        }
      });
    };
    fetchShippingMethods();
  }, [cart]);

  const shippingMethodOptions = shippingMethods.map((shippingMethod) => ({
    label: shippingMethod.name,
    value: shippingMethod.id
  }));

  const onShippingChangeHandler = (shipmentTypeId) => {
    setSelectedShippingMethod(shipmentTypeId);
    /** 
    patch shipment type id on shopping cart
    */
    dispatch(updateShipmentTypeIdToCart(shipmentTypeId));
  };

  return (
    <>
      {shippingMethods?.length > 0 && (
        <>
          <label htmlFor="Select Shipment Method" className="mr-2">
            Select Shipment Method
          </label>
          <Dropdown
            options={shippingMethodOptions}
            value={selectedShippingMethod}
            optionLabel="label"
            placeholder="Shipping Method"
            onChange={(e) => {
              onShippingChangeHandler(e.value);
            }}
            className="w-15rem"
            name={"Select Shipment Method"}
            aria-label={"Select Shipment Method"}
          />
        </>
      )}
    </>
  );
}
