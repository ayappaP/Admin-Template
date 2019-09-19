export default () => {
  const query = `
  query fetchOrders
    {
      order(order_by: {createdAt: desc}, where: {shopCode: {_eq: "a7e9d07f-82cd-48bf-ac04-04a90db3a29f"}}) {
        id
        reference
        status
        type
        address
        customerId
        products
        total
        createdAt
      }
      }`;
  return { query: query };
};
