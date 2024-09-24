import ProductShimmer from "./ProductShimmer";

const ProductListShimmer = () => {
  return (
    <div className="flex flex-wrap justify-content-start gap-4">
      {[...Array(6)].map((_, index) => (
        <ProductShimmer key={index} />
      ))}
    </div>
  );
};

export default ProductListShimmer;
