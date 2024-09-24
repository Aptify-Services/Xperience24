import ShimmerWrapper from "../../atoms/Shimmer";

const CartListShimmer = () => {
  return (
    <article>
      <div>
        <div className="hidden lg:flex grid border-bottom-2 border-100 mt-2">
          <div className="md:col-6 font-semibold">Product</div>
          <div className="md:col-2 font-semibold">Price</div>
          <div className="md:col-2 font-semibold">Quantity</div>
          <div className="md:col-2 font-semibold">Action</div>
        </div>
        <div className="border-bottom-2 border-100 py-2">
          {[...Array(5)].map((_, key) => (
            <div key={key} className="grid lg:align-items-center my-2 w-full gap-2">
              <ShimmerWrapper border="2xl" className={"col-2"}>
                <div className=" h-5rem w-6rem" />
              </ShimmerWrapper>
              <div className="col-4">
                <ShimmerWrapper border="2xl">
                  <div className="h-1rem w-6rem" />
                </ShimmerWrapper>
                <ShimmerWrapper border="2xl">
                  <div className="h-1rem w-6rem my-2" />
                </ShimmerWrapper>
                <ShimmerWrapper border="2xl">
                  <div className="h-1rem w-6rem my-2" />
                </ShimmerWrapper>
              </div>
              <ShimmerWrapper border="2xl" className={"col-2"}>
                <div className="h-1rem w-6rem" />
              </ShimmerWrapper>
              <ShimmerWrapper border="2xl" className={"col-2"}>
                <div className="h-1rem w-6rem" />
              </ShimmerWrapper>
              <ShimmerWrapper border="2xl" className={"col-1"}>
                <div className="h-1rem w-6rem" />
              </ShimmerWrapper>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default CartListShimmer;
