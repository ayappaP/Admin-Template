

export default (selectedStatus,orderID) => {
    console.log("update ORDER",orderID)
    const updateOrderStatus = `
    mutation {
        update_order(where: {reference: {_eq: "${orderID}"}}, _set: {status: "${selectedStatus}"}) {
          returning {
            status
          }
        }
      }`
    return {"query": updateOrderStatus}
  }
  