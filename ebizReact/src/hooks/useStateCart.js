import { useSelector } from "react-redux";

export function useStateCart() {
  return useSelector((state) => state?.cart || {});
}
