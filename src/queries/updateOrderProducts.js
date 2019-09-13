

export const stringifyObject = val => {
  const json = JSON.stringify(val);
  json.replace(/\\"/g, "\uFFFF");
  return json.replace(/\"([^"]+)\":/g, "$1:").replace(/\uFFFF/g, '\\"');
}

export default (orderId, products, total) => {
  // console.log("update ORDER", orderId)
  const updateOrderProducts = `
    mutation{
        update_order(where:{id:{_eq:"${orderId}"}},_set:{
          products: ${stringifyObject(products)},
          total: "${total}", 
          finalTotal: "${total}", 
          amendmentsMade: true
        }){
          returning{
            id
          }
        }
      }`
  return { "query": updateOrderProducts }
}
