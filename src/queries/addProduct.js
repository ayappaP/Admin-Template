
export default (values) => {
    console.log("query",values)
    
    const query = `
    mutation {
        insert_product(objects: 
            {
                description: "${values.description}", 
                englishName: "${values.englishName}", 
                price: "${values.price}", 
                unitWeight: "${values.unitWeight}",
                categoryName: "${values.categoryName}"
            }) {
          returning {
            englishName
            price
            description
            unitWeight
            categoryName
          }
        }
      }
      `;
    return { query: query };
  };
  

