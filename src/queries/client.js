
//import { ONLINE_STORE_API } from '../env/endpoints';
// const URL = "https://whatsapp.bestfoodsuk.com/v1/graphql"
const URL = process.env.REACT_APP_GATSBY_GRAPHQL_ENDPOINT
export default (query) => fetch(URL, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // 'x-hasura-admin-secret': '9J8q3FCeFH63Rzqb'
    'x-hasura-admin-secret': process.env.REACT_APP_GATSBY_X_HASURA_ADMIN_SECRET
  },
  body: JSON.stringify(query)
}).then((response) => response.json()).catch((error)=>{
console.log(error)
})
