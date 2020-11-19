import axios from 'axios'
const baseUrl = '/api/';
export default{
    state:{
        producers: []
    },
    mutations:{
        SET_PRODUCERS: (state, payload) => {
            state.producers = payload
            state.producers.forEach((element, index) => {
                element.index = index + 1
            });
        },
    },
    actions: {
        async ADD_PRODUCER_PRODUCT_DETAIL({commit}, payload) {
            return await axios({
                method: "POST",
                url: baseUrl + `producers/product/${payload.product_id}/add/detail/`,
                data: {
                    productDetailArr: {
                        date: payload.date,
                        amount: payload.amount, 
                        amountLeft: payload.amount,
                        buyPrice: payload.buyPrice, 
                        sellPrice: payload.sellPrice, 
                        payed: payload.payed,
                        unPayed: payload.unPayed,
                        about: payload.about
                    }
                }
            })
            .then((e) => {
                console.log(e); 
                return e.data;
            })
            .catch((error) => {
                console.log(error);
                return error.response;
            })
        },
        async ADD_PRODUCER({commit}, payload) {
            return await axios({
                method: "POST",
                url: baseUrl + 'producers',
                data: payload
            })
            .then((e) => {
                console.log(e); 
                return e.data;
            })
            .catch((error) => {
                console.log(error);
                return error.response;
            })
        },
        async EDIT_PRODUCER({commit}, payload){
            return await axios({
                method: "PATCH",
                url: baseUrl + `producers/${payload.id}`,
                data: {
                    name: payload.name,
                    phone: payload.phone,
                    companyName: payload.companyName
                }
            })
            .then((e) => {
                console.log(e); 
                return e.data;
            })
            .catch((error) => {
                console.log(error);
                return error.response;
            })
        },
        async DELETE_PRODUCER({commit}, payload){
            return await axios({
                method: "DELETE",
                url: baseUrl + `producers/${payload.id}`,
            })
            .then((e) => {
                console.log(e); 
                return e.data;
            })
            .catch((error) => {
                console.log(error);
                return error.response;
            })
        },
        async ADD_PRODUCER_PRODUCT({commit}, payload) {
            return await axios({
                method: "POST",
                url: baseUrl + 'producers/' + payload.id + '/add/product',
                data: {
                    productArr: payload
                }
            })
            .then((e) => {
                console.log(e); 
                return e.data;
            })
            .catch((error) => {
                console.log(error);
                return error.response;
            })
        },
        async GET_PRODUCERS({commit}, payload) {
            return await axios({
                method: "GET",
                url: baseUrl + 'producers',
                data: payload
            })
            .then(async (e) => {
                await commit('SET_PRODUCERS', e.data);
            //   return e;
            })
            .catch((error) => {
                console.log(error);
                return 'error';
            })
        },
    },
    getters:{
        getProducers: state => state.producers
    }
}