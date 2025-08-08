import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import trip from './trip';
import location from './location';
import myLocation from './myLocation';


const store = createStore({
  state: {
    user: null,
    token: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    }
  },
  plugins: [createPersistedState({
    paths: ['user', 'token', 'location', 'trip', 'myLocation']
  })],
  modules: {
    trip,
    location,
    myLocation,
  }
});

export default store;