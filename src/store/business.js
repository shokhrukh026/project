import axios from 'axios'
const baseUrl = '/api/';
export default{
    state:{
        products: []
    },
    mutations:{
        SET_PRODUCTS: (state, payload) => {
            state.products = payload
        },
    },
    actions: {
        async ADD_PRODUCT({commit}, payload) {
            return await axios({
                method: "POST",
                url: baseUrl + 'products',
                data: payload
            })
            .then((e) => {
            //   return e;
            })
            .catch((error) => {
                console.log(error);
                return error.response;
            })
                
        },
        async GET_PRODUCTS({commit}, payload) {
            return await axios({
                method: "GET",
                url: baseUrl + 'products',
                data: payload
            })
            .then(async (e) => {
                await commit('SET_PRODUCTS', e.data);
            //   return e;
            })
            .catch((error) => {
                console.log(error);
                return 'error';
            })
                
        },
       
    },
    getters:{
        getProducts: state => state.products
    }
}