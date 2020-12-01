import axios from 'axios'
const baseUrl = '/api/';
export default{
    state:{
        customers: []
    },
    mutations:{
        SET_CUSTOMERS: (state, payload) => {
            state.customers = payload
            state.customers.forEach((element, index) => {
                element.index = index + 1
            });
        },
    },
    actions: {
        async ADD_CUSTOMER({commit}, payload) {
            return await axios({
                method: "POST",
                url: baseUrl + 'customers',
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
        async EDIT_CUSTOMER({commit}, payload){
            return await axios({
                method: "PATCH",
                url: baseUrl + `customers/${payload.id}`,
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
        async DELETE_CUSTOMER({commit}, payload){
            return await axios({
                method: "DELETE",
                url: baseUrl + `customers/${payload.id}`,
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
        async ADD_CUSTOMER_PRODUCT({commit}, payload) {
            return await axios({
                method: "POST",
                url: baseUrl + 'customers/' + payload.id + '/add/product',
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
        async EDIT_PRODUCT_OF_CUSTOMER({commit}, payload){
            return await axios({
                method: "PATCH",
                url: baseUrl + `customers/${payload.id}/product/${payload.pid}`,
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
        async RETURN_PRODUCT_OF_CUSTOMER({commit}, payload){
            return await axios({
                method: "POST",
                url: baseUrl + `customers/${payload.cid}/add/product/return/${payload.pid}`,
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
        async DELETE_PRODUCT_OF_CUSTOMERS({commit}, payload){
            return await axios({
                method: "DELETE",
                url: baseUrl + `customers/${payload.id}/product/${payload.pid}`,
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
        async GET_CUSTOMERS({commit}, payload) {
            return await axios({
                method: "GET",
                url: baseUrl + 'customers',
                data: payload
            })
            .then(async (e) => {
                await commit('SET_CUSTOMERS', e.data);
            //   return e;
            })
            .catch((error) => {
                console.log(error);
                return 'error';
            })
                
        },
       
    },
    getters:{
        getCustomers: state => state.customers
    }
}