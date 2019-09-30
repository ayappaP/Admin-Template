export default () => {
    const query = `
      query fetchCategoryName
      {
        category(order_by: {name: asc}) {
          name
          categoryId
        }
      }`;
    return { query: query };
  };
  
  
  