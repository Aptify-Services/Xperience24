import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { Sidebar } from "primereact/sidebar";
import { Tag } from "primereact/tag";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { _get } from "@api/APIClient";
import { addAriaLabelOnGridButtonGridList } from "@utils/accessibilty.js";
import useMutationObserver from "@hooks/useMutationObserver.js";
import SimpleButton from "@components/atoms/Buttons/SimpleButton.jsx";
import { EmptyGenericComponent, ProductListShimmer } from "@components/molecules";
import SearchBar from "@components/molecules/SearchBar.jsx";
import { CATEGORY_TYPE, SORT_OPTIONS, DEFAULT_ROW_PRODUCTCATALOG } from "@constants";
import { useToast } from "@context/ToasterProvider.jsx";
import { getCart, addItemsToCart, getCartItems } from "@store/CartSlice.js";
import "@css/ProductCatalog.scss";
import { ebConfig } from "@configuration/ebConfig";
import { getProductCategoryCount } from "@utils/categoryCount";
import { setFilters } from "@store/ProductCatalogSlice";

const ProductCatalog = () => {
  const storeFilters = useSelector((state) => state?.productCatalog?.filters) ?? {};
  const [products, setProducts] = useState([]);
  const [categoriesCount, setCatoriesCount] = useState({});
  const dispatch = useDispatch();
  const [sortKey, setSortKey] = useState(storeFilters?.sortByPrice ?? "");
  const [sortOrder, setSortOrder] = useState(storeFilters?.sortOrder ?? 0);
  const [sortField, setSortField] = useState("");
  const [layout, setLayout] = useState(storeFilters?.layout ?? "grid");
  const [first, setFirst] = useState(storeFilters?.page?.first ?? 0);
  const [rows, setRows] = useState(DEFAULT_ROW_PRODUCTCATALOG);
  const [filteredData, setFilteredData] = useState(products);
  const [searchText, setSearchText] = useState(storeFilters?.searchText ?? "");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    storeFilters?.category ?? CATEGORY_TYPE.ALL
  );
  const [loading, setLoading] = useState(true);
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const { showToastSuccess, showToastError } = useToast();
  const loadDefaultImage = ebConfig.loadDefaultImage;
  useMutationObserver(addAriaLabelOnGridButtonGridList, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await _get("/v1/Products", {
        withCredentials: true
      });
      dispatch(getCartItems());
      setProducts(response.data);
      setFilteredData(response.data);
      setLoading(false);
    };
    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    const uniqueCategories = [...new Set(products.map((product) => product.productCategory))].sort(
      (a, b) => a?.localeCompare(b)
    );
    setCatoriesCount(getProductCategoryCount(products));
    setCategories([CATEGORY_TYPE.ALL, ...uniqueCategories]);
  }, [products]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchText, products?.length]);

  const onSortChange = (event) => {
    const value = event.value;
    let order;
    if (value.indexOf("!") === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
      order = -1;
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
      order = 1;
    }
    dispatch(
      setFilters({
        ...storeFilters,
        sortByPrice: value,
        sortOrder: order
      })
    );
  };
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    dispatch(
      setFilters({
        ...storeFilters,
        page: event
      })
    );
  };
  const addItemToCart = async (data) => {
    try {
      const itemtoadd = {
        productId: data.id,
        quantity: 1
      };
      if (data.quantity !== undefined) {
        itemtoadd.quantity = data.quantity;
      }
      if (data.isSubscription) {
        itemtoadd.productType = "subscription";
      } else {
        itemtoadd.productType = data.productType;
      }
      const result = await dispatch(addItemsToCart(itemtoadd));
      if (result?.payload?.errorCode) {
        showToastError({
          summary: "Error Message",
          detail: result.payload.message
        });
      } else {
        showToastSuccess({
          summary: "Success",
          detail: "Item added to cart."
        });
        await dispatch(getCart());
        await dispatch(getCartItems());
      }
    } catch (error) {
      console.error("An error occurred while adding item to cart:", error);
      showToastError({
        summary: "Error Message",
        detail: "Item Not Added to Cart"
      });
    }
  };
  const handleSearchChange = (value) => {
    setSearchText(value);
    filterData(value);
  };
  const filterData = (value) => {
    const filtered = products.filter((item) =>
      Object.values(item).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === null || category === CATEGORY_TYPE.ALL) {
      setFilteredData(products);
    } else {
      const filtered = products.filter((product) => product.productCategory === category);
      setFilteredData(filtered);
    }
    setSideBarVisible(false);
  };
  const applyFilters = () => {
    // Apply category filter
    let filteredByCategory = [];
    if (selectedCategory === CATEGORY_TYPE.ALL) {
      filteredByCategory = products; // Show all products
    } else {
      filteredByCategory = products.filter(
        (product) => product.productCategory === selectedCategory
      );
    }

    // Apply search filter
    const filteredBySearch = filteredByCategory.filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // Update filtered products
    setFilteredData(filteredBySearch);
    dispatch(
      setFilters({
        ...storeFilters,
        category: selectedCategory,
        searchText: searchText.toLowerCase()
      })
    );
  };

  const listItem = (product) => {
    return (
      <div className="col-12" key={product.id}>
        <div className="grid flex-row py-2 border-top-2 border-100 align-items-center">
          <div className="col-2">
            <Link to={`/product-details/${product.id}`}>
              {" "}
              <img
                className="eb-cover-image w-full h-10rem shadow-2 border-round"
                src={
                  loadDefaultImage
                    ? `${ebConfig.thumbnailImageURL}/coming-soon.png`
                    : `${ebConfig.thumbnailImageURL}/${product.id}${ebConfig.imageExtension}`
                }
                alt={product?.name}
                onError={(e) => {
                  e.target.src = `${ebConfig.thumbnailImageURL}/coming-soon.png`;
                }}
              />
            </Link>
          </div>
          <div className="text-lg font-semibold col-3">
            <Link
              to={`/product-details/${product?.id}`}
              // eslint-disable-next-line react/forbid-component-props
              style={{ textDecoration: "none", color: "black" }}
              className="text-black eb-overflow eb-overflow--double-line"
              title={product?.name}
            >
              {product?.name}{" "}
            </Link>
          </div>
          <div className="flex flex-row align-items-center gap-3 col-2">
            {!product?.hasComplexPricing && (
              <span
                role="link"
                tabIndex="0"
                className="text-lg font-semibold"
                aria-label={`${product?.defaultPrice > 0 ? product?.defaultPrice : product?.retailPrice}`}
              >
                {product?.currencySymbol}
                {parseFloat(
                  product?.defaultPrice > 0 ? product?.defaultPrice : product?.retailPrice
                ).toFixed(ebConfig.roundOffDigitsAfterDecimal || 2)}
              </span>
            )}
            {product?.hasComplexPricing && (
              <span className="text-lg font-medium text-orange-500">Add to cart to see price</span>
            )}
          </div>
          <div className="flex flex-row align-items-center gap-3 col-2">
            {product?.requireInventory &&
              product?.quantityAvailable < 1 &&
              !product?.allowBackorders && <Tag value="Out of Stock" severity={"danger"} />}
          </div>
          <div className="flex flex-row align-items-center justify-content-end col-3">
            <SimpleButton
              onClick={async () => addItemToCart(product)}
              label="Add to Cart"
              outlined
              className="border-round-sm"
              disabled={
                product?.requireInventory &&
                product?.quantityAvailable < 1 &&
                !product?.allowBackorders
              }
            />
          </div>
        </div>
      </div>
    );
  };

  const gridItem = (product) => {
    return (
      <div className="col-6 lg:col-4 xl:col-4 p-2 flex" key={product.id}>
        <div className="p-2 md:p-3 flex flex-column eb-border-gray align-items-stretch flex-grow-1">
          <div className="flex flex-column gap-2">
            <Link to={`/product-details/${product?.id}`} className="text-center">
              <img
                className="eb-cover-image w-full h-10rem shadow-2 border-round"
                src={
                  loadDefaultImage
                    ? `${ebConfig.thumbnailImageURL}/coming-soon.png`
                    : `${ebConfig.thumbnailImageURL}/${product.id}${ebConfig.imageExtension}`
                }
                alt={product?.name}
                onError={(e) => {
                  e.target.src = `${ebConfig.thumbnailImageURL}/coming-soon.png`;
                }}
              />
            </Link>
            <div className="font-bold ">
              <Link
                to={`/product-details/${product?.id}`}
                // eslint-disable-next-line react/forbid-component-props
                style={{ textDecoration: "none", color: "black" }}
                className="eb-overflow eb-overflow--single-line"
                title={product?.name}
              >
                {product?.name}{" "}
              </Link>
            </div>
            {!product?.hasComplexPricing && (
              <div className="flex">
                <span className="">
                  {" "}
                  {product?.currencySymbol}
                  {parseFloat(
                    product?.defaultPrice > 0 ? product?.defaultPrice : product?.retailPrice
                  ).toFixed(ebConfig.roundOffDigitsAfterDecimal || 2)}
                </span>
                <span className="ml-2">
                  {product?.requireInventory &&
                    product?.quantityAvailable < 1 &&
                    !product?.allowBackorders && <Tag value="Out of Stock" severity={"danger"} />}
                </span>
              </div>
            )}
          </div>
          <div className="flex pt-2 ">
            {product?.hasComplexPricing && (
              <span className="text-1xl font-medium text-orange-500">Add to cart to see price</span>
            )}
          </div>
          <div className="flex pt-2 mt-auto">
            <SimpleButton
              onClick={async () => addItemToCart(product)}
              label="Add to Cart"
              outlined
              icon="pi pi-cart-plus"
              className="border-round-sm w-full eb-add-to-cart-btn"
              disabled={
                product?.requireInventory &&
                product?.quantityAvailable < 1 &&
                !product?.allowBackorders
              }
            />
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (product, _layout, index) => {
    if (!product) {
      return;
    }

    if (_layout === "list") return listItem(product, index);
    else if (_layout === "grid") return gridItem(product);
  };

  const listTemplate = (_products, _layout) => {
    return (
      <div className="grid">
        {_products.length <= 0 && (
          <EmptyGenericComponent label="NoProductFound" msgDisplay="No records found." />
        )}
        {_products.length > 0 &&
          _products.map((product, index) => itemTemplate(product, _layout, index))}
      </div>
    );
  };
  const header = () => {
    return (
      <section className="grid mb-4">
        <div className="col-12 md:col-8 flex md:hidden">
          <div className="md:ml-auto w-full">
            <SearchBar
              value={searchText}
              onChange={handleSearchChange}
              className="eb-sort-dropdownStyle"
            />
          </div>
        </div>
        <div className="col-12 md:col-4 flex">
          <Dropdown
            options={SORT_OPTIONS}
            value={sortKey}
            optionLabel="label"
            placeholder="Sort By Price"
            onChange={onSortChange}
            className="eb-sort-dropdownStyle w-6 md:w-full lg:w-10"
            aria-label="Sort By Price"
            aria-labelledby="Sort By Price"
            name={"Sort By Price"}
          />
          <div className="flex md:hidden ml-auto">
            <DataViewLayoutOptions
              layout={layout}
              onChange={(e) => {
                setLayout(e.value);
              }}
              className="flex"
            />
          </div>
          <Button
            icon="pi pi-filter-fill"
            onClick={() => setSideBarVisible(true)}
            className="ml-2 md:ml-auto md:hidden"
            aria-label="Filter Products"
            badge={!!(selectedCategory !== "All") + !!sortKey}
          />
        </div>
        <div className="col-12 md:col-8 hidden md:flex">
          <div className="md:ml-auto max-w-11rem md:max-w-15rem">
            <SearchBar
              value={searchText}
              onChange={handleSearchChange}
              className="eb-sort-dropdownStyle"
            />
          </div>
          <div className="flex ml-auto md:ml-3">
            <DataViewLayoutOptions
              layout={layout}
              onChange={(e) => {
                dispatch(
                  setFilters({
                    ...storeFilters,
                    layout: e.value
                  })
                );
                setLayout(e.value);
              }}
              className="flex"
            />
          </div>
        </div>
      </section>
    );
  };
  return (
    <>
      <main className="eb-product-catalog-page">
        <div className="eb-container relative">
          <section>
            <h2 className="my-3">Product Catalog </h2>
          </section>
          <div className="grid md:my-5 my-3">
            {/* For Tab and above Screen devices */}
            <aside className="hidden md:block col-3">
              <div className="w-full eb-border-gray hidden md:block">
                <h3 className="flex border-bottom-1 border-gray-200 p-3 font-bold text-xl">
                  Filter By
                </h3>
                <div className="flex flex-column gap-3 p-3">
                  {categories.map((category) => (
                    <div key={category} className="flex align-items-center">
                      <RadioButton
                        inputId={category}
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <label className="pl-2" htmlFor={category}>
                        {category}
                        <span className="text-gray-400">&nbsp;({categoriesCount?.[category]})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
            {/* For Mobile view Start*/}
            <Sidebar visible={sideBarVisible} onHide={() => setSideBarVisible(false)}>
              <div className="w-max">
                <span className="flex border-bottom-1 border-gray-200 p-3 font-bold text-xl">
                  Filter By
                </span>
                <div className="flex flex-column gap-3 p-3">
                  {categories.map((category) => (
                    <div key={category} className="flex align-items-center">
                      <RadioButton
                        inputId={category}
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <label className="pl-2" htmlFor={category}>
                        {category}
                        <span className="text-gray-400">&nbsp;({categoriesCount?.[category]})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </Sidebar>
            {/* For Mobile view End*/}
            <article className="md:col-9 col-12">
              <div className="md:ml-3">
                {header()}
                {loading ? (
                  <>
                    <ProductListShimmer />
                  </>
                ) : (
                  <DataView
                    value={filteredData}
                    listTemplate={listTemplate}
                    layout={layout}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    paginator={!!filteredData?.length}
                    first={first}
                    rows={rows}
                    totalRecords={filteredData.length}
                    rowsPerPageOptions={[12, 24, 48, 96]}
                    onPage={onPageChange}
                  />
                )}
              </div>
            </article>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductCatalog;
