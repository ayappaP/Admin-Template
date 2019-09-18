export default () => {
    const query = `
      query fetchUsers
      {
        customer {
          auth0Id
          name
          number
          balance
        }
      }`;
    return { query: query };
  };
  