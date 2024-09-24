/**
 * create a object of catgories with their count eg:{ ALL: 100, Books: 2, Mugs: 3 }
 * @param {*} products array of object(products)
 * @returns {object} object of string with number of products in category
 */
export const getProductCategoryCount = (products) => {
  const categoryCount = { All: products.length };
  if (!products?.length) {
    return categoryCount;
  }
  products?.forEach(({ productCategory }) => {
    if (!categoryCount?.[productCategory]) {
      categoryCount[productCategory] = 1;
    } else {
      categoryCount[productCategory]++;
    }
  });
  return categoryCount;
};
