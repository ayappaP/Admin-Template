export default () => {
    const query = `
      query fetchUsers
      {
        customer {
          name
          number
          balance
        }
      }`;
    return { query: query };
  };
  