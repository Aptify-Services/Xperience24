import ShimmerWrapper from "../../atoms/Shimmer";

const PaymentsShimmer = () => {
  return (
    <>
      {[...Array(3)].map((_, key) => (
        <div key={key} className="mx-2 my-2">
          <ShimmerWrapper>
            <div className=" w-100 h-3rem" />
          </ShimmerWrapper>
        </div>
      ))}
    </>
  );
};

export default PaymentsShimmer;
