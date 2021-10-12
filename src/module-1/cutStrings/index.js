export const cutStrings = (arr = []) => {
  if(arr.length === 0) return [];

  const minLength = arr.reduce((a,b) => a.length < b.length ? a : b).length;

  return arr.map(item => item.slice(0,minLength))
};
