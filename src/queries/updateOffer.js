export default(offerId,offerTitle,startDate,endDate) => {
    // console.log("update offerid", Id)
    const startDateUTC = startDate.utc()
    const endDateUTC = endDate.utc()
   const updateoffer = `
     mutation{
         update_offer(where:{id:{_eq:"${offerId}"}},_set:{
           offerTitle:"${offerTitle}",
           startDate:"${startDateUTC}", 
           endDate:"${endDateUTC}"
         }){
           returning{
             id
           }
         }
       }`
   return { "query": updateoffer }
 }