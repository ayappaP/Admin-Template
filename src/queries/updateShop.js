export default values => {
  console.log("query", values);

  const query = `
    mutation {
        update_shop(where: {id: {_eq: "${values.shopId}"}},_set: { 
            address: {
                road: "${values.addressRoad}",
                town: "${values.addressTown}",
                number: "${values.addressNumber}",
                postcode: "${values.addressPostCode}"
             },
            businessHours: "${values.businessHours}",
            code: "${values.shopCode}", 
            contact: {name:"${values.contactName}", number: "${values.contactNumber}"},
            coverage: ["${values.coverage}"], 
            shopName: "${values.shopName}"}) {
          returning {
            address
            businessHours
            code
            contact
            coverage
            shopName
          }
        }
      }
      `;
  return { query: query };
};
