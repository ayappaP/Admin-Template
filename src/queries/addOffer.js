export default (values) => {
    console.log("query",values.startDate.utc())
    const startDate = values.startDate.utc()
    const endDate = values.endDate.utc()

    const query = `
    mutation {
        insert_offer(objects: { active: true,products: "Tea",offerTitle: "${values.offerTitle}", startDate: "${startDate}", endDate: "${endDate}"}) {
          returning {
            offerTitle
            endDate
            startDate
          }
        }
      }`;
    return { query: query };
  };