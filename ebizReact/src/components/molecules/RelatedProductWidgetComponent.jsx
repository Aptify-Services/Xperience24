import { Carousel } from "primereact/carousel";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Divider } from "primereact/divider";

import { ebConfig } from "@/configuration/ebConfig";
import { _get } from "@api/APIClient";
import { Text } from "@components/atoms";
import "@css/RelatedProductWidgetComponent.scss";

const RelatedProductWidget = ({
  productid,
  iscartRelatedProducts,
  isShowHeader = false,
  webLongDescription
}) => {
  const [products, setProducts] = useState([]);
  const [productperslide, setproductperslide] = useState(4);
  const loadDefaultImage = ebConfig.loadDefaultImage;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (iscartRelatedProducts) {
          const response = await _get(`v1/ShoppingCarts/RelatedProducts`, {
            withCredentials: true
          });
          setProducts(response.data);
        } else {
          const response = await _get(`v1/Products/${productid}/RelatedProducts`);
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };
    fetchProducts();

    const handleResize = () => {
      // Change maxSlides based on the breakpoint
      if (window.matchMedia("(min-width:768px) and (max-width: 991px)").matches) {
        updateMaxSlides(3);
      } else if (window.matchMedia("(max-width: 767px)").matches) {
        updateMaxSlides(2);
      } else {
        updateMaxSlides(4);
      }
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Initial call to handleResize to set maxSlides correctly on component mount
    handleResize();

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iscartRelatedProducts, productid]);

  const updateMaxSlides = (newValue) => {
    setproductperslide(newValue);
  };
  const productChunks = [];
  // Split the products array into chunks of 4

  if (products.length !== 0) {
    for (let i = 0; i < products.length; i += productperslide) {
      productChunks.push(products.slice(i, i + productperslide));
    }
  }

  return (
    <>
      {isShowHeader && !!webLongDescription && (
        <section className="mb-5">
          <h3>Additional Product Details</h3>
          <Divider />
          {webLongDescription && (
            <Text className="my-4" showTooltip={false}>
              {webLongDescription}
            </Text>
          )}
        </section>
      )}
      {!!products?.length && (
        <section>
          <div className="font-bold md:text-2xl text-xl">You may also be interested in...</div>
          <Divider />
          <Carousel
            value={productChunks}
            numVisible={1}
            numScroll={1}
            itemTemplate={(chunk) => (
              <div className="grid md:mt-4 mt-2">
                {chunk.map((product, index) => (
                  <div key={index} className="col-6 md:col-4 lg:col-3">
                    <div className="h-full p-3 border-round-2xl border-1 border-100">
                      <div className="mb-2">
                        <img
                          className="eb-cover-image w-full h-10rem block border-round-xl"
                          src={
                            loadDefaultImage
                              ? product.productType.toLowerCase() === "meeting"
                                ? `${ebConfig.thumbnailImageURL}/coming-soon.png`
                                : `${ebConfig.thumbnailImageURL}/coming-soon.png`
                              : `${ebConfig.thumbnailImageURL}/${product.id}${ebConfig.imageExtension}`
                          }
                          alt={product?.name}
                          onError={(e) => {
                            e.target.src = `${ebConfig.thumbnailImageURL}/coming-soon.png`;
                          }}
                        />
                      </div>
                      <div className="font-semibold md:text-lg text-md">
                        <Link
                          to={`/product-details/${product.id}`}
                          className="no-underline eb-overflow eb-overflow--double-line"
                          title={product?.name}
                        >
                          <div className="no-underline text-black-alpha-90">{product.name}</div>
                        </Link>
                      </div>
                      <div>
                        <div className="font-normal eb-productDetailsColorStyle pt-1 eb-overflow eb-overflow--double-line">
                          <Text>{product?.description}</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          />
        </section>
      )}
    </>
  );
};

RelatedProductWidget.propTypes = {
  productid: PropTypes.string.isRequired, // ID of the current product
  iscartRelatedProducts: PropTypes.bool.isRequired, // Flag indicating whether the related products are for the cart
  handleShowAdditionDeatilsHeader: PropTypes.func, // Function to handle show addition details header
  isShowHeader: PropTypes.bool,
  webLongDescription: PropTypes.string
};

export default RelatedProductWidget;
