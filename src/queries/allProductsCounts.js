export default (shopId) => {
    const query = `
    query fetchProducts
    {
        product{
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