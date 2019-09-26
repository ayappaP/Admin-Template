export default () => {
    const query = `
    {
        order(order_by: {createdAt: desc}) {
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
  