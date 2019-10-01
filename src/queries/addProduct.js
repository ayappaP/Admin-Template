export default values => {
  console.log("query", values);

  const query = `
    mutation {
        insert_product(objects: 
            {
                categoryName: "${values.category}",
                categoryId: "${values.categoryId}",
                brand: "${values.brand}",
                distributor: "${values.distributor}",
                englishName: "${values.productName}",
                description: "${values.description}",                  
                price: "${values.price}", 
                offerProduct: "${values.offerProduct}",
                offerPrice: "${values.offerPrice}",
                wholesalePrice: "${values.wholeSalePrice}",
                unitWeight: "${values.unitWeight}",
                sellable: "${values.sellable}",
                imageUrl: "${values.imageUrl}"
            }) {
          returning {
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
          }
        }
      }
      `;
  return { query: query };
};
