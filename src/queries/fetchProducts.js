export default (offset) => {
  console.log(offset)
  const query = `
    query fetchProducts
    {
      product(offset: ${offset}, order_by: {id: asc_nulls_first}, limit: 10){
          id
          categoryName
          categoryId
          brand
          distributor
          englishName
          description                  
          price 
          offerProduct
          offerPrice
          wholesalePrice
          unitWeight
          sellable
          imageUrl
        }
      }`;
  return { query: query };
};

