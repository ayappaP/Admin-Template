export default (shopId) => {
  const query = `
  query fetchOrders
    {
      order(order_by: {createdAt: desc}, where: {shopCode: {_eq: "${shopId}"}}) {
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
