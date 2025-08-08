<script setup>

  import { ref, reactive, onMounted } from 'vue';
  import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import L from 'leaflet';
  import icon from 'leaflet/dist/images/marker-icon.png';
  import iconShadow from 'leaflet/dist/images/marker-shadow.png';
  import 'leaflet-routing-machine';


  const router = useRouter();
  const store = useStore();
  const mapCenter = ref([23.8103, 90.4125]) // Dhaka by default
  const routingControl = ref(null);
  const viewMap = ref(false);
  const queryString = ref('');
  const searchResults = ref([]);
  const selectedPlaceCoords = ref({});
  const selectedPlace = ref();
  const userLocation = reactive({
    lat: '',
    lng: ''
  });
  const emit = defineEmits(['submitTrip']);

  function getUserLocation() {
    navigator.geolocation.getCurrentPosition(pos => {
      userLocation.lat = pos.coords.latitude;
      userLocation.lng = pos.coords.longitude;
      store.state.myLocation.origin = userLocation;
      // console.log(userLocation)
      mapCenter.value = [userLocation.lat, userLocation.lng];
    })
  }

  async function searchPlaces() {
    if (queryString.value.length < 3 || !userLocation.lat || !userLocation.lng) return;


      const lat = userLocation.lat;
      const lon = userLocation.lng;
      const latDiff = 0.09
      const lonDiff = 0.09

    const viewbox = [
      lon - lonDiff, // left
      lat + latDiff, // top
      lon + lonDiff, // right
      lat - latDiff  // bottom
    ].join(',');

    // const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${queryString.value}`)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryString.value)}&bounded=1&viewbox=${viewbox}&limit=10`;
    try {
      const res = await fetch(url);
      searchResults.value = await res.json();
    } catch (error) {
      console.log(error)
    }
  }

  function selectPlace(place) {
    // debugger;
    selectedPlaceCoords.value = {lat: parseFloat(place.lat), lng: parseFloat(place.lon)};
    selectedPlace.value = place.name;
    queryString.value = `${place.display_name}`;
    searchResults.value = []
    // console.log(selectedPlaceCoords)
    mapCenter.value = selectedPlaceCoords.value;
  }
  //function on submit -------- destination name = queryString.value.
  const handleLocationChanged = () => {
    if(!selectedPlace.value) return;
    const origin = userLocation, destination = selectedPlaceCoords.value, destination_name = selectedPlace.value;
    store.commit('myLocation/setLocation',{origin, destination, destination_name});
    viewMap.value = true;
    // console.log(store.state.location)
  };

  L.Icon.Default.mergeOptions({
    iconUrl: icon,
    shadowUrl: iconShadow,
  });

  const drawDrivingRoute = (map) => {
  if (routingControl.value) {
    map.removeControl(routingControl.value);
  }

  routingControl.value = L.Routing.control({
    waypoints: [
      L.latLng(userLocation.lat, userLocation.lng),
      L.latLng(selectedPlaceCoords.value.lat, selectedPlaceCoords.value.lng)
    ],
    routeWhileDragging: false,
    draggableWaypoints: false,
    createMarker: function () {
      return null; // Skip default markers
    },
    show: false 
  }).addTo(map);
  };

  const handleTripSubmit = () => {
    emit('submitTrip');
    // store.commit('trip/SET_TRIP');
    router.push({ name: 'Trip' });
  };

  onMounted(() => {
    getUserLocation();
  });
</script>
<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        {{ viewMap ? 'Going To ' + selectedPlace : 'Where Are We Going ???' }}
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-4 rounded-md">
      <form v-if="!viewMap" @submit.prevent="handleLocationChanged">
        <div class="min-h-[200px]">
            <div class="mt-4">
                <input type="text" v-model="queryString" @keyup="searchPlaces" required="true" placeholder="Please Type Your Destination"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6" />
            </div>
            <div class="places">
              <ul v-if="searchResults.length" class="bg-white border rounded max-h-40 overflow-y-auto">
                <li
                  v-for="place in searchResults"
                  :key="place.place_id"
                  class="p-2 cursor-pointer hover:bg-gray-100"
                  @click="selectPlace(place)"
                >
                  <small>{{ place.display_name }}</small>
                </li>
              </ul>
            </div>
        </div>
        <div class="">
            <button type="submit" class="flex justify-center rounded-sm bg-gray-800 w-full py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-black cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800">
                Let's Go
            </button>
        </div>
      </form>
      <form v-else @submit.prevent="handleTripSubmit">
        <div class="min-h-[200px]">
          <LMap
            ref="mapRef"
            style="height: 300px; width: 100%; margin-top: 1rem"
            :zoom="14"
            :center="mapCenter"
            @ready="(map) => drawDrivingRoute(map)"
          >
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LMarker v-if="userLocation" :lat-lng="userLocation" />
            <LMarker v-if="selectedPlaceCoords" :lat-lng="selectedPlaceCoords" />
          </LMap>
        </div>
        <div class="ride">
            <button type="submit" class="flex justify-center rounded-sm bg-gray-800 w-full py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-black cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800">
                Get A Ride
            </button>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>
  .places ul li{
    border-bottom: 1px solid #ccc;
  }


</style>