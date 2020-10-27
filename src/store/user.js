// import axios from 'axios';
// const baseUrl = '/api/v1/user/login/';

// // const baseUrl = 'http://dev.epos.uz/v1/user/login/';
export default{
  state:{

  },
  mutations: {

  },
  actions: {
    
  },
  getters:{
    
  }
}
// export default{
//     state:{
//         user: {token: ''}
//     },
//     mutations:{
//         SET_USER_TO_STATE: (state, payload) => {
//             state.user = payload
//         },
//         UNSET_USER_FROM_STATE: (state) => {
//             state.user = {token: ''};
//         },
//         LOG_OUT: (state) =>{
//            sessionStorage.clear();
//         }
//     },
//     actions: {
//         AUTHORIZATION({commit}, payload) {
//           return axios({
//               method: "POST",
//               url: baseUrl,
//               data: {
//                 username: payload.username,
//                 password: payload.password
//               },
//             })
//             .then((e) => {
//               commit('SET_USER_TO_STATE', e.data);
//               sessionStorage.setItem('user', JSON.stringify(e.data));
//               payload.router.push({path: '/main'});
//             //   return e;
//             })
//             .catch((error) => {
//               console.log(error);
//               return 'error';
//             })


//             //  Used when above code not works
//             const data = {token:"Token 9825cabf4345b6abdce62e02ff082cc977c7a9b0",user_id:1,business_id:1}
//             commit('SET_USER_TO_STATE', data);
//             sessionStorage.setItem('user', JSON.stringify(data));
//             payload.router.push({path: '/main'})
            
//         },
//         STATE_CHANGED({commit}, payload){
//             commit('SET_USER_TO_STATE', payload);
//         },
//         LOGOUT({commit}){
//           commit('LOG_OUT');
//         }
//     },
//     getters:{
//         getUser: state => state.user
//     }
// }