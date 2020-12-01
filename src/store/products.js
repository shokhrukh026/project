import axios from 'axios'
const baseUrl = '/api/';
export default{
    state:{
        products_of_producers: [],
        product_detail_of_producer: [],
        products_of_customers: [],
        all_products: [],
    },
    mutations:{
        SET_PRODUCTS_DETAIL_OF_PRODUCER: (state, payload) => {
            state.product_detail_of_producer = payload
            state.product_detail_of_producer.forEach((element, index) => {
                element.index = index + 1
            });
        },
        SET_PRODUCTS_OF_PRODUCERS: (state, payload) => {
            state.products_of_producers = payload
            state.products_of_producers.forEach((element, index) => {
                element.index = index + 1
            });
        },
        SET_ALL_PRODUCTS: (state, payload) => {
            state.all_products = payload
            // state.products_of_producers.forEach((element, index) => {
            //     element.index = index + 1
            // });
        },
        SET_PRODUCTS_OF_CUSTOMERS: (state, payload) => {
            state.products_of_customers = payload
            state.products_of_customers.forEach((element, index) => {
                element.index = index + 1
            });
        },
    },
    actions: {
        // async ADD_PRODUCER({commit}, payload) {
        //     return await axios({
        //         method: "POST",
        //         url: baseUrl + 'products',
        //         data: payload
        //     })
        //     .then((e) => {
        //         console.log(e); 
        //         return e.data;
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         return error.response;
        //     })
                
        // },
        // async ADD_PRODUCER_PRODUCT({commit}, payload) {
        //     console.log(payload);
        //     return await axios({
        //         method: "POST",
        //         url: baseUrl + 'products/' + payload.id + '/add/product',
        //         data: {
        //             productArr: payload
        //         }
        //     })
        //     .then((e) => {
        //         console.log(e); 
        //         return e.data;
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         return error.response;
        //     })
        // },
        async FILTER_PRODUCTS_OF_PRODUCERS_BY_NAME({commit}, payload) {
            return await axios({
                method: "GET",
                url: baseUrl + `producers/filter/by/${payload}`,
            })
            .then(async (e) => {
                // await commit('SET_ALL_PRODUCTS', e.data);
                return e.data;
            })
            .catch((error) => {
                console.log(error);
                return 'error';
            })
        },
        async GET_ALL_PRODUCTS({commit}, payload) {
            return await axios({
                method: "GET",
                url: baseUrl + `products`,
            })
            .then(async (e) => {
                await commit('SET_ALL_PRODUCTS', e.data);
            //   return e;
            })
            .catch((error) => {
                console.log(error);
                return 'error';
            })
        },
        async GET_PRODUCTS_OF_PRODUCERS({commit}, payload) {
            return await axios({
                method: "GET",
                url: baseUrl + `producers/${payload}/products`,
            })
            .then(async (e) => {
                await commit('SET_PRODUCTS_OF_PRODUCERS', e.data);
            //   return e;
            })
            .catch((error) => {
                console.log(error);
                return 'error';
            })
        },
        async GET_PRODUCTS_DETAIL_OF_PRODUCER({commit}, payload) {
            return await axios({
                method: "GET",
                url: baseUrl + `producers/${payload}/product/detail`,
            })
            .then(async (e) => {
                await commit('SET_PRODUCTS_DETAIL_OF_PRODUCER', e.data);
            //   return e;
            })
            .catch((error) => {
                console.log(error);
                return 'error';
            })
        },
        async GET_PRODUCTS_OF_CUSTOMERS({commit}, payload) {
            return await axios({
                method: "GET",
                url: baseUrl + `customers/${payload}/products`,
            })
            .then(async (e) => {
                await commit('SET_PRODUCTS_OF_CUSTOMERS', e.data);
            //   return e;
            })
            .catch((error) => {
                console.log(error);
                return 'error';
            })
        },
        async EDIT_PRODUCT({commit}, payload){
            return await axios({
                method: "PATCH",
                url: baseUrl + `producers/${payload.id}/product/${payload.pid}`,
                data: {
                    barcode: payload.barcode,
                    name: payload.name,
                    amount: payload.amount,
                    measure: payload.measure,
                    // buyPrice: payload.buyPrice,
                    sellPrice: payload.sellPrice,
                    description: payload.description,
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
        async EDIT_PRODUCT_DETAIL({commit}, payload){
            return await axios({
                method: "PATCH",
                url: baseUrl + `producers/product/detail/${payload.did}`,
                data: {
                    date: payload.date,
                    amount: payload.amount,
                    amountLeft: payload.amountLeft,
                    buyPrice: payload.buyPrice,
                    // sellPrice: payload.sellPrice,
                    payed: payload.payed,
                    unPayed: payload.unPayed,
                    about: payload.about,
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
        async DELETE_PRODUCT({commit}, payload){
            return await axios({
                method: "DELETE",
                url: baseUrl + `producers/${payload.id}/product/${payload.pid}`,
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
        async DELETE_PRODUCT_DETAIL({commit}, payload){
            console.log(payload);
            return await axios({
                method: "DELETE",
                url: baseUrl + `producers/product/${payload.pid}/detail/${payload.did}`,
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
       
    },
    getters:{
        getProductsOfProducers: state => state.products_of_producers,
        getProductDetailOfProducer: state => state.product_detail_of_producer,
        getProductsOfCustomers: state => state.products_of_customers,
        getAllProducts: state => state.all_products

    }
}