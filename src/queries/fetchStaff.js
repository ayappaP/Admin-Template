export default (shopId) => {
    const query = `
      query fetchStaff
      {
        staff(where: {shopId: {_eq: "${shopId}"}}) {
          name
          number
        }
      }`;
    return { query: query };
  };
  