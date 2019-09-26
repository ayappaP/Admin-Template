export default (offset) => {
  console.log(offset)
    const query = `
    query fetchProducts
    {
        product(offset: ${offset}, order_by: {id: asc_nulls_first}, limit: 10){
          brand
          imageUrl
          categoryName
          englishName
          id
          price
          unitWeight
          unitPrice
          offerPrice
          offerProduct
          description
        }
      }`;
    return { query: query };
  };