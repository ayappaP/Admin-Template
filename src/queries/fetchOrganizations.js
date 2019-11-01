export default (searchString, limit, offset, orderByDate) => {
  const query = `
  query organization{
    organization(where: {name: {_like: ${searchString}}}, limit: ${limit}, offset: ${offset}, order_by: {created_at: ${orderByDate}}){
      id 
      name
      created_at
    }

    organization_aggregate(where: {name: {_like: ${searchString}}}){
      aggregate{
        count
      }
    }
  }
  `;
  return { query: query };
};
