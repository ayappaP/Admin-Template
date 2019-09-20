export default (shopId) => {
    const query = `
      query fetchUsers
      {
        customer(where: {shop: {_eq: "${shopId}"}}) {
          name
          number
          balance
        }
      }`;
    return { query: query };
  };
  