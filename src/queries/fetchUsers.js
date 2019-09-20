export default (shopId) => {
    const query = `
      query fetchUsers
      {
        customer(where: {shop: {_eq: "${shopId}"}}) {
          name
          number
          referralId
        }
      }`;
    return { query: query };
  };
  