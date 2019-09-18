export default () => {
  const query = `
    query fetchUsers
    {
        shop(order_by: {shopName: asc}) {
          id
          shopName
        }
      }`;
  return { query: query };
};
