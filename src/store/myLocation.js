export default {
  namespaced: true,
  state: () => ({
    origin: null,
    destination: null,
    destination_name: ''
  }),
  mutations: {
  setLocation(state, {origin, destination, destination_name}){
    state.origin = origin;
    state.destination = destination;
    state.destination_name = destination_name;
  },
  }
};