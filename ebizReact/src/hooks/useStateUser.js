import { useSelector } from "react-redux";

export function useStateUser() {
  const user = useSelector((state) => state.user.user);

  return user;
}
