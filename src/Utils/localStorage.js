import { isEmpty } from "lodash";

export const getAuth = () => {
  const data = localStorage.getItem("user");
  return isEmpty(data) ? null : JSON.parse(data);
};

export const saveAuth = (data) => {
  localStorage.setItem("user", JSON.stringify(data));
};

export const removeAuth = () => {
  localStorage.removeItem("user");
};