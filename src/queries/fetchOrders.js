export default () => {
  const query = `
  query fetchOrders
    {
      order(order_by: {createdAt: desc}) {
        id
        reference
        status
        type
        address
        auth0Id
        products
        total
        createdAt
      }
      
      }`
  return {"query": query}
}
