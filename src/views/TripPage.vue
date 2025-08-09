<script setup>
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import { ref, computed, onMounted, onBeforeMount, nextTick, watch, reactive} from 'vue';
    import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
    import Echo from 'laravel-echo';
    import 'leaflet-routing-machine';
    import Pusher from 'pusher-js';
    import L from 'leaflet';
    import icon from 'leaflet/dist/images/marker-icon.png';
    import iconShadow from 'leaflet/dist/images/marker-shadow.png';
    
    
    const store = useStore();
    const router = useRouter();
    const mapRef = ref();
    const routingControl = ref(null);
    const mapCenter = ref(store.state.myLocation.origin);
    const userLocation = ref(store.state.myLocation.origin);
    const selectedPlace = ref(store.state.myLocation.destination_name);
    const selectedPlaceCoords = ref(store.state.myLocation.destination);
    const status = ref('');
    const driver_location = ref(store.state.trip.driver_location);
    const tripStarted = computed(() => store.state.trip.is_started);
    const tripId = ref(store.state.trip.id);

    const driverLatLng = computed(() => {
      if (driver_location.value?.lat != null && driver_location.value?.lng != null) {
        return [driver_location.value.lat, driver_location.value.lng];
      }
      return null; // or [] if your component handles it
    });

    const greenIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    //mapcenter//userlocation//selectedplace//selectedplacecoords

    const user = ref(store.state.user);
    let user_id = user.value.id;
    // console.log(user.value)

    const driverStatusMessage = () => {
      const driver = store.state.trip.driver;
      if(tripStarted.value){
        status.value = 'You are on your way, have a nice trip!';
        return;
      }
      if(driver.plate){
        status.value = `A driver has picked up your request and is on your way with a ${driver.color} ${driver.make} ${driver.year} 
        model car by name, ${driver.name} and #plate ${driver.plate}`;
      }else status.value = 'Waiting for a rider, driver information will be displayed here when a driver accepts.';
    };

    const drawDrivingRoute =async (map) => {
      if(!driver_location.value) return;
      if (!mapRef.value?.leafletObject?._loaded) {
        return; // Wait for the map to load
      }  
      if (routingControl.value) {
          map.removeControl(routingControl.value);
      }
      const checkpoint = tripStarted.value ? selectedPlaceCoords.value : userLocation.value;
      routingControl.value = L.Routing.control({
          waypoints: [
          L.latLng(driver_location.value.lat, driver_location.value.lng),
          L.latLng(checkpoint.lat, checkpoint.lng)
          ],
          routeWhileDragging: false,
          draggableWaypoints: false,
          fitSelectedRoutes: false,
          createMarker: function () {
          return null; // Skip default markers
          },
          show: false 
      }).addTo(map);
    };

  watch([driver_location.value, userLocation.value], async ([user, dest]) => {
    if (user && dest && mapRef.value) {
        await nextTick();
        const map = mapRef.value.leafletObject;
        if (!mapRef.value?.leafletObject?._loaded) {
            return; // Wait for the map to load
        }      
        // Fit the map to show both points
        // const bounds = L.latLngBounds([user, dest])
        // await mapRef.value.leafletObject.fitBounds(bounds, { padding: [50, 50] })
        const midpoint = L.latLng(
            (user.lat + dest.lat) / 2,
            (user.lng + dest.lng) / 2
        );
        map.setView(midpoint, 14);
        // // Redraw the route
        setTimeout(() => { drawDrivingRoute(map)},500);
    }
  });
  onBeforeMount(() => {
    // if(!tripId.value) router.push({ name: 'Location' });
  });
  onMounted(() => {
    driverStatusMessage();
    let echo = new Echo({
        broadcaster: 'pusher',
        key: 'monkey',
        cluster: 'mt1',
        wsPort: import.meta.env.VITE_WEBSOCKET_PORT,
        wsHost: import.meta.env.VITE_WEBSOCKET_HOST,
        // wsHost: window.location.hostname,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss']
    });
    echo.channel(`Passenger_`+user_id)
        .listen('TripAccepted', (data) => {
            // console.log('Received data of a driver:', data);
            //need to save the data to a store object then retrieved it to draw a map.
            store.commit('trip/SET_TRIP_DRIVER',data.trip.driver);
            store.commit('trip/SET_DRIVER_LOCATION',data.trip.driver_location);
            driver_location.value = store.state.trip.driver_location;
            console.log(store.state.trip.driver_location)
            // console.log(store.state.trip)
            driverStatusMessage();
            
        })
        .listen('TripLocationUpdated', (data) => {
            store.commit('trip/SET_DRIVER_LOCATION', data.trip.driver_location);
            // console.log('Location Updated', data.trip.driver_location)
            // console.log('Location Updated', store.state.trip.driver_location)
            driver_location.value = store.state.trip.driver_location;
        })
        .listen('TripStarted', (data) => {
            store.commit('trip/SET_TRIP_STARTED');
            driverStatusMessage();
        })
        .listen('TripEnded', (data) => {
          status.value = 'You Have reached your destination, Hope you enjoyed the journey with skuber8';
            setTimeout(() => {
              store.commit('trip/CLEAR_TRIP');
              router.push({ name: 'Home' });
            }, 10000);
        })
    echo.connector.pusher.connection.bind('connected', () => {
    console.log('🎉 Echo connected!');
    });
  });  
</script>
<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            {{'Going to:' + selectedPlace }}
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-4 rounded-md">
      <form>
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
            <LMarker v-if="driverLatLng" :lat-lng="driverLatLng" :icon="greenIcon"/>
          </LMap>
        </div>
        <div class="ride">
            <p class="font-semibold text-sm text-right mt-1">{{ status }}</p>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped></style>