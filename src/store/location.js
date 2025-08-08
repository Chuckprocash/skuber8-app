export default {
  namespaced: true,
  state: () => ({
    origin: null,
    destination: null,
    destination_name: ''
  }),
  mutations: {
    SET_ORIGIN(state, origin) {
      state.origin = origin;
    },
    SET_DESTINATION(state, destination) {
      state.destination = destination;
    },
    SET_DESTINATION_NAME(state, destination_name) {
      state.destination_name = destination_name;
    },
    CLEAR_LOCATION(state){
      state.origin = null;
      state.destination = null;
      state.destination_name = null;
    }
  }
};