export const prepareSlider = (data,field) => {
  return {
      min: Math.min(...data.map(item => item[field])),
      max: Math.max(...data.map(item => item[field])),
      formatValue: value => value + '₴',
      filterName: field.slice(0,1).toUpperCase() + field.slice(1),
    }

};
