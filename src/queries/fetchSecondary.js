export default (searchString, limit, offset, orderByDate) => {
  const query = `
  query secondary{
    secondary(where: {name: {_like: ${searchString}}}, limit: ${limit}, offset: ${offset}, order_by: {created_at: ${orderByDate}}){
      id 
      name
      created_at
    }

    secondary_aggregate(where: {name: {_like: ${searchString}}}){
      aggregate{
        count
      }
    }
  }
  `;
  return { query: query };
};
