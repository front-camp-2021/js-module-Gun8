export const weirdString = (str = "") => {
  return str.toUpperCase().split(" ").map(item => item.slice(0,item.length - 1) + item.slice(-1).toLowerCase()).join(" ");
};
