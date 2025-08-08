
export default {
  namespaced: true,
  state: () => ({
    id: null,
    user_id: null,
    origin: {
      lat: null,
      lng: null
    },
    destination: {
      lat: null,
      lng: null
    },
    destination_name: '',
    driver_location: {
      lat: null,
      lng: null
    },
    is_started: false,
    is_completed: false,
    driver: {
      name: '',
      make: '',
      model: '',
      year: null,
      color: '',
      plate: null
    }
  }),
  mutations: {
    SET_TRIP_STARTED(state){
      state.is_started = true;
    },
    SET_DRIVER_LOCATION(state, location){
      state.driver_location.lat = location.lat;
      state.driver_location.lng = location.lng;
    },
    SET_TRIP_DRIVER(state, driver){
      state.driver.name = driver.user.name;
      state.driver.make = driver.make;
      state.driver.model = driver.model;
      state.driver.year = driver.year;
      state.driver.color = driver.color;
      state.driver.plate = driver.license_plate;
    },
    SET_TRIP(state, trip) {
      state.id = trip.id;
      state.user_id = trip.user_id;
      state.origin = trip.origin;
      state.destination = trip.destination;
      state.destination_name = trip.destination_name;
    },
    CLEAR_TRIP(state) {
      state.id = null;
      state.user_id = null;
      state.origin = null;
      state.destination = null;
      state.destination_name = null;
      state.is_started = false,
      state.is_completed = false,
      state.driver.name = null,
      state.driver.year = null,
      state.driver.make = null,
      state.driver.model = null,
      state.driver.color = null,
      state.driver.plate = null,
      state.driver_location .lat = null,
      state.driver_location.lng = null
    }
  }
};