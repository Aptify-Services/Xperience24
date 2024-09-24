import ShimmerWrapper from "../../atoms/Shimmer";

const ProductDetailsShimmer = () => (
  <div className="col-12 grid gap-6">
    <ShimmerWrapper border="2xl" className={"col-12 md:col-5"}>
      <div className="flex flex-row align-items-center gap-2 col-5 h-20rem ">
        <div className="text-lg font-semibold" />
      </div>
    </ShimmerWrapper>
    <div className="col-12 md:col-6 gap-1 grid">
      <ShimmerWrapper border="2xl" className={"w-25rem"}>
        <span className="flex flex-row align-items-center gap-2 h-1rem mt-2" />
      </ShimmerWrapper>
      {[...Array(6)].map((_, index) => (
        <ShimmerWrapper border="2xl" className={'"w-25rem'} key={index}>
          <span className="flex flex-row align-items-center gap-2 h-1rem mt-2" />
        </ShimmerWrapper>
      ))}
    </div>
    <div className="col-12 md:col-12">
      <ShimmerWrapper border="2xl">
        <span className="flex flex-row align-items-center gap-2 h-1rem mt-2" />
      </ShimmerWrapper>
      <ShimmerWrapper border="2xl">
        <span className="flex flex-row align-items-center gap-2 h-1rem mt-2" />
      </ShimmerWrapper>
    </div>
  </div>
);

export default ProductDetailsShimmer;
