import ShimmerWrapper from "../../atoms/Shimmer";

const BilligAddressShimmer = () => {
  return [...Array(2)].map((_, key) => (
    <div className="col-12 lg:col-6 eb-address-card mb-3" key={key}>
      <div className="border-100 border-2 border-round-2xl p-3 h-full">
        <div className="grid gap-2">
          <div className="col grid gap-2">
            <ShimmerWrapper border="2xl">
              <div className="col-1" />
            </ShimmerWrapper>
            <ShimmerWrapper border="2xl">
              <div className="col-7" />
            </ShimmerWrapper>
            <ShimmerWrapper border="2xl">
              <div className="col-2" />
            </ShimmerWrapper>
            <ShimmerWrapper border="2xl">
              <div className="col-2" />
            </ShimmerWrapper>
          </div>
          <div className="col-4 flex gap-2">
            <ShimmerWrapper border="circle">
              <div className="h-2rem w-2rem" />
            </ShimmerWrapper>
            <ShimmerWrapper border="circle">
              <div className="h-2rem w-2rem" />
            </ShimmerWrapper>
          </div>
        </div>
      </div>
    </div>
  ));
};

export default BilligAddressShimmer;
