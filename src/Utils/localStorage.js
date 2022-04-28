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

export const delay = ( function() {
  var timer = 0;
  return function(callback, ms) {
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
  };
})();