export default () => {

    const query = `
    subscription {
        order(order_by: {createdAt: desc},limit:1) {
          id
          createdAt
          total
        }
      }
      `
    return { "query": query }
}
