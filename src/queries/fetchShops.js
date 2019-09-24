export default () => {
  const query = `
    query fetchShops
    {
        shop(order_by: {shopName: asc}) {
          address
    balance
    businessHours
    code
    contact
    coverage
    enabled
    id
    shopName
        }
      }`;
  return { query: query };
};


