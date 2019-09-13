
//import { ONLINE_STORE_API } from '../env/endpoints';
const URL = "https://whatsapp.bestfoodsuk.com/v1/graphql"
export default (query) => fetch(URL, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': '9J8q3FCeFH63Rzqb'
  },
  body: JSON.stringify(query)
}).then((response) => response.json()).catch((error)=>{
console.log(error)
})
