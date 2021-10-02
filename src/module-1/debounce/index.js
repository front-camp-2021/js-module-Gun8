export const debounce = (fn, delay = 0) => {
  let isWaiting = false;
  return function () {
    if(isWaiting) return;

    let result = fn.apply(this, arguments);
    isWaiting = true;

    setTimeout(() => isWaiting = false,delay);

    return result;
  }
};


