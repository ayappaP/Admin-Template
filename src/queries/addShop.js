
export default (values) => {
    console.log("query",values)
    
    const query = `
    mutation {
        insert_shop(objects: {
          shopName: "${values.shopName}",
          enabled: false, 
          coverage: ["${values.coverage}"], 
          code: "${values.shopCode}",
          contact: {name:"${values.contactName}", number: "${values.contactNumber}"}, 
          businessHours:"${values.businessHours}",
          address: {
            road: "${values.addressRoad}",
                town: "${values.addressTown}",
                number: "${values.addressNumber}",
                postcode: "${values.addressPostCode}"
          }}) {
          returning {
            address
            businessHours
            contact
            coverage
            shopName
            code
          }
        }
      }
      `;
    return { query: query };
  };
  

