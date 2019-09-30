export default (shopId) => {
    const query = `
    query fetchOffers
    {
        offer {
          id
            startDate
          endDate
          offerTitle
        }
      }`;
    return { query: query };
  };
  