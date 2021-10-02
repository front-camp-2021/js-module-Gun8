export const cutStrings = (arr = []) => {
  if(arr.length === 0) return [];

  let minLength = arr[0].length;

  for(let i = 1; i < arr.length; i++){
    if(arr[i].length < minLength){
      minLength = arr[i].length;
    }
  }

  return arr.map(item => item.slice(0,minLength))
};
