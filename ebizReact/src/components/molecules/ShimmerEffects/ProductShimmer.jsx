import ShimmerWrapper from "../../atoms/Shimmer";

const ProductShimmer = () => (
  <div className="grid flex-row py-2 border-100 border-round w-14rem p-2 border-1 sm:mx-1">
    <ShimmerWrapper>
      <div className="flex flex-row align-items-center gap-2 col-5 h-10rem ">
        <div className="text-lg font-semibold" />
      </div>
    </ShimmerWrapper>
    <ShimmerWrapper>
      <div className="flex flex-row align-items-center gap-3 col-2 mt-2 " />
    </ShimmerWrapper>
    <ShimmerWrapper>
      <div className="flex flex-row align-items-center gap-3 col-2 mt-2 w-3rem" />
    </ShimmerWrapper>
    <ShimmerWrapper>
      <div className="flex flex-row align-items-center gap-3 col-2 mt-2 w-100  h-2rem" />
    </ShimmerWrapper>
  </div>
);

export default ProductShimmer;
