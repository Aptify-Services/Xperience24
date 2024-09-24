import ShimmerWrapper from "../../atoms/Shimmer";

const AddressShimmer = () => {
  return (
    <div className="col-12 lg:col-6">
      <div className="eb-border-gray p-0 h-full">
        <div className="font-bold text-md eb-border-gray border-noround-bottom ">
          <ShimmerWrapper border="2xl" className="flex p-2">
            <div className="w-6rem h-1rem" />
          </ShimmerWrapper>
        </div>
        <div className="gap-4 grid p-3">
          <ShimmerWrapper border="2xl">
            <div className="w-10rem h-1rem" />
          </ShimmerWrapper>
          <ShimmerWrapper border="2xl">
            <div className="w-10rem h-1rem" />
          </ShimmerWrapper>
        </div>
      </div>
    </div>
  );
};

export default AddressShimmer;
