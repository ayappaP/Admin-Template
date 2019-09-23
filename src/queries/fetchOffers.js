export default (shopId) => {
    const query = `
    query fetchOffers
    {
        offer {
            startDate
          endDate
          offerTitle
        }
      }`;
    return { query: query };
  };
  