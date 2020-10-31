// import axios from 'axios'
// const baseUrl = '/api/';
// export default{
//     state:{
//         producers: []
//     },
//     mutations:{
//         SET_PRODUCERS: (state, payload) => {
//             state.producers = payload
//             state.producers.forEach((element, index) => {
//                 element.index = index + 1
//             });
//         },
//     },
//     actions: {
//         async ADD_PRODUCER({commit}, payload) {
//             return await axios({
//                 method: "POST",
//                 url: baseUrl + 'producers',
//                 data: payload
//             })
//             .then((e) => {
//                 console.log(e); 
//               return e.data;
//             })
//             .catch((error) => {
//                 console.log(error);
//                 return error.response;
//             })
                
//         },
//         async ADD_PRODUCER_PRODUCT({commit}, payload) {
//             return await axios({
//                 method: "POST",
//                 url: baseUrl + 'producers/post/product',
//                 data: payload
//             })
//             .then((e) => {
//                 console.log(e); 
//               return e.data;
//             })
//             .catch((error) => {
//                 console.log(error);
//                 return error.response;
//             })
                
//         },
//         async GET_PRODUCERS({commit}, payload) {
//             return await axios({
//                 method: "GET",
//                 url: baseUrl + 'producers',
//                 data: payload
//             })
//             .then(async (e) => {
//                 await commit('SET_PRODUCERS', e.data);
//             //   return e;
//             })
//             .catch((error) => {
//                 console.log(error);
//                 return 'error';
//             })
                
//         },
       
//     },
//     getters:{
//         getProducers: state => state.producers
//     }
// }