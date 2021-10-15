export const splitAndMerge = (str = "", separator = "") => {
  return str.split(' ').map(item => item.split("").join(separator)).join(" ");
};

