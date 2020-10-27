import axios from 'axios'
const baseUrl = '/api/';
export default{
    state:{
        producers: []
    },
    mutations:{
        SET_PRODUCERS: (state, payload) => {
            state.products = payload
        },
    },
    actions: {
        async ADD_PRODUCER({commit}, payload) {
            console.log(payload);
            return await axios({
                method: "POST",
                url: baseUrl + 'producers',
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