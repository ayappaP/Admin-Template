export default () => {
    const query = `
      query fetchUsers
      {
        carousel {
          alt
          imageUrl
          index
        }
      }`;
    return { query: query };
  };
  