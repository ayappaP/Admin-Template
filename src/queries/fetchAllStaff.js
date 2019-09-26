export default () => {
    const query = `
      query fetchAllStaff
      {
        staff{
          name
          number
        }
      }`;
    return { query: query };
  };
  