export default () => {
    const query = `
    query fetchOrderHistory
      {
        order(where: {_or: [{status: {_eq: "COLLECTED"}}, {status: {_eq: "PICKED"}}, {status: {_eq: "DELIVERED"}}]}){
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
  