import { Panel } from "primereact/panel";
import { Tag } from "primereact/tag";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { PRODUCT_TYPES } from "@constants";
import { _get } from "@api/APIClient.js";
import { useToast } from "@context/ToasterProvider.jsx";
import { addItemsToCart, getCart, getCartItems } from "@store/CartSlice.js";
import IconLabelButton from "@components/atoms/Buttons/IconLabelButton.jsx";
import CustomInputNumberIncDec from "@components/atoms/TextFields/CustomInputNumber_IncDec.jsx";
import ViewCartKitItems from "@components/molecules/Cart/ViewCartKitItems.jsx";
import RelatedProductWidget from "@components/molecules/RelatedProductWidgetComponent.jsx";
import { Text } from "@components/atoms";
import { ebConfig } from "@configuration/ebConfig.js";
import "@css/ProductDetails.scss";

import ProductDetailsShimmer from "../ShimmerEffects/ProductDetailsShimmer.jsx";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [assemblyType, setAssemblyType] = useState();
  const [assemblyItems, setAssemblyItems] = useState();
  const { showToastError, showToastSuccess } = useToast();
  //products length included for group is sum of quantity and for kit its length of assemblyItems
  const countOfProduct =
    assemblyType === "Group"
      ? assemblyItems?.reduce((a, c) => a + c?.quantity, 0)
      : assemblyItems?.length;

  const dispatch = useDispatch();
  const params = useParams();
  const productId = params?.id;
  const loadDefaultImage = ebConfig.loadDefaultImage;

  function QuantityUpdate(e) {
    setQuantity(e.value);
  }

  const addToCart = async () => {
    // Implement your add to cart logic here
    try {
      const itemtoAdd = {
        productId: product?.id,
        quantity: quantity
      };

      if (product.isSubscription) {
        itemtoAdd.productType = "subscription";
      } else {
        itemtoAdd.productType = product?.productType;
      }
      const result = await dispatch(addItemsToCart(itemtoAdd));
      if (result?.payload?.errorCode) {
        showToastError({
          summary: "Error Message",
          detail: result?.payload?.message,
          life: 3000
        });
      } else {
        showToastSuccess({
          summary: "Success",
          detail: "Item added to cart.",
          life: 3000
        });

        await dispatch(getCart());
        await dispatch(getCartItems());
      }
    } catch (error) {
      showToastError({
        summary: "Error Message",
        detail: "Item Not Added to Cart",
        life: 3000
      });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const response = await _get("/v1/Products/" + productId, {
        withCredentials: true
      });
      setLoading(false);
      setProduct(response.data);
      setAssemblyType(response?.data?.assemblyType);
      if (response?.data?.assemblyType !== "") {
        const assemblyresponse = await _get("/v1/Products/" + productId + "/AssemblyParts");
        setAssemblyItems(assemblyresponse?.data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [productId]);

  function datepublished(_datepublished) {
    const date = new Date(_datepublished);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return formattedDate;
  }

  return (
    <>
      <main className="eb-container">
        <section>
          <h2 className="my-3">Product Information</h2>
        </section>
        <div className="mt-3 md:mt-5">{loading && <ProductDetailsShimmer />}</div>
        {!loading && (
          <>
            <section className="grid mt-3 md:mt-5">
              {product && (
                <>
                  <section className="col-12 md:col-5">
                    <img
                      src={
                        loadDefaultImage
                          ? `${ebConfig.thumbnailImageURL}/coming-soon.png`
                          : `${ebConfig.largeImageURL}/${product.id}${ebConfig.imageExtension}`
                      }
                      alt={product?.name}
                      onError={(e) => {
                        e.target.src = `${ebConfig.thumbnailImageURL}/coming-soon.png`;
                      }}
                      className="border-round-3xl eb-cover-image w-full h-20rem"
                    />
                  </section>
                  <section className="pl-2 md:pl-7 col-12 md:col-7 align-items-center justify-content-center">
                    <div className="text-4xl font-bold">{product?.name}</div>
                    {!product?.hasComplexPricing && (
                      <div className="text-2xl font-bold eb-productDetailsColorStyle py-2">
                        <span>Price:&nbsp;</span>
                        {product?.currencySymbol}
                        {product?.defaultPrice
                          ? parseFloat(product?.defaultPrice).toFixed(
                              ebConfig.roundOffDigitsAfterDecimal || 2
                            )
                          : product?.retailPrice &&
                            parseFloat(product?.retailPrice).toFixed(
                              ebConfig.roundOffDigitsAfterDecimal || 2
                            )}
                      </div>
                    )}
                    <div>
                      {product?.requireInventory &&
                        product?.quantityAvailable < 1 &&
                        !product?.allowBackorders && (
                          <Tag value="Out of Stock" severity={"danger"} />
                        )}
                    </div>
                    {product?.hasComplexPricing && (
                      <div className="text-2xl font-bold eb-productDetailsColorStyle py-2 text-orange-500">
                        Add to cart to see price
                      </div>
                    )}
                    {(product?.webDescription || product?.description) && (
                      <>
                        <div className="text-lg font-bold pt-2">Product Description</div>
                        <div className="text-base font-normal eb-productDetailsColorStyle py-2">
                          <Text isShowMoreButton>
                            {product?.webDescription || product?.description}
                          </Text>
                        </div>
                      </>
                    )}
                    <div className="text-lg font-bold py-2">Quantity</div>
                    <div className="border-solid border-1 border-round-lx eb-border-gray w-5 md:w-4 xl:w-3">
                      <CustomInputNumberIncDec
                        label="Quantity"
                        decrementButtonIcon={"pi pi-minus text-xs font-bold"}
                        incrementButtonIcon={"pi pi-plus text-xs font-bold"}
                        decrementButtonClassName={"quantityBtnStyle"}
                        incrementButtonClassName={"quantityBtnStyle"}
                        onValueChange={QuantityUpdate}
                        value={quantity}
                        step={1.0}
                        buttonLayout="horizontal"
                        showButtons="true"
                        inputClassName="border-none text-center px-3"
                        min="1"
                        disabled={product?.isSubscription}
                      />
                    </div>
                    <div className="pt-5 pb-3">
                      <IconLabelButton
                        navigatelink={"false"}
                        label={"Add to Cart"}
                        icon={"pi pi-shopping-cart"}
                        onClick={addToCart}
                        className={"w-7 eb-add-to-cart-btn"}
                        disabled={
                          product?.requireInventory &&
                          product?.quantityAvailable < 1 &&
                          !product?.allowBackorders
                        }
                      />
                    </div>
                    <div className="text-xl font-bold pt-2">Additional Information</div>
                    <div className="text-base py-1 eb-productDetailsColorStyle">
                      <span className="font-bold">SKU : </span>
                      <span className="font-normal">{product?.id}</span>
                    </div>
                    <div className="text-base py-1 eb-productDetailsColorStyle">
                      <span className="font-bold">Category : </span>
                      <span className="font-normal">{product?.productCategory}</span>
                    </div>
                    {assemblyItems && assemblyItems?.length > 0 ? (
                      <Panel
                        header={"Products Included in " + assemblyType + "(" + countOfProduct + ")"}
                        toggleable
                        collapsed
                      >
                        {assemblyItems.map((assemblyProduct, index) => (
                          <ViewCartKitItems
                            key={`${index}`}
                            isLastElement={assemblyItems.length - 1 === index}
                            item={assemblyProduct}
                            fromCart={false}
                            assemblyType={assemblyType}
                          />
                        ))}
                      </Panel>
                    ) : null}

                    <div>
                      {product.productType === PRODUCT_TYPES.PUBLICATION && (
                        <div className="text-base py-1 eb-productDetailsColorStyle">
                          <span className="font-bold">ISBN / ISSN : </span>
                          <span className="font-normal">{product?.ISBN}</span>
                        </div>
                      )}
                      {product.productType === PRODUCT_TYPES.PUBLICATION && (
                        <div className="text-base py-1 eb-productDetailsColorStyle">
                          <span className="font-bold">Date Published : </span>
                          <span className="font-normal">
                            {datepublished(product?.datepublished)}
                          </span>
                        </div>
                      )}
                    </div>
                  </section>
                </>
              )}
            </section>
            <>
              <section>
                <RelatedProductWidget
                  isShowHeader
                  productid={productId}
                  iscartRelatedProducts={false}
                  webLongDescription={product?.webLongDescription}
                />
              </section>
            </>
          </>
        )}
      </main>
    </>
  );
};

export default ProductDetails;
