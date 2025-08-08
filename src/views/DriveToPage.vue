<script setup>
    import { ref, computed, onMounted, reactive, onUnmounted, watch, nextTick } from 'vue';
    import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import L from 'leaflet';
    import icon from 'leaflet/dist/images/marker-icon.png';
    import iconShadow from 'leaflet/dist/images/marker-shadow.png';
    import 'leaflet-routing-machine';
    import axiosClient from '../axiosClient';
    import Popping from '../components/popping.vue';


    const router = useRouter();
    const store = useStore();
    const mapRef = ref();
    const intervalRef = ref();
    const routingControl = ref(null);
    const destinationCoords = ref(store.state.location.destination);
    const mapCenter = ref([destinationCoords.value?.lat, destinationCoords.value?.lng]);
    const selectedPlace = ref(store.state.location.destination_name);
    const currentLocation = computed(() => store.state.location.origin);
    const userLocation = reactive({lat:24.7463946, lng:90.3938058});
    const userLatLng = computed(() => [userLocation.lat, userLocation.lng]);
    const userToken = ref(store.state.token);
    const tripId = ref(store.state.trip.id);
    const tripStarted = computed(() => store.state.trip.is_started);
    const tripDestination = ref(store.state.trip.destination);
    const coords = destinationCoords.value;
    const popping = ref(false);
    

    function getNewDriverLocation() {
        if (!userLocation) return

        const radius = 1000 // in meters
        const radiusInDegrees = radius / 111320 // ~1 deg = 111.32 km

        const angle = Math.random() * 2 * Math.PI
        const distance = Math.random() * radiusInDegrees

        const deltaLat = distance * Math.cos(angle)
        const deltaLng = distance * Math.sin(angle) / Math.cos((userLocation.lat * Math.PI) / 180)

        userLocation.lat = coords.lat + deltaLat;
        userLocation.lng = coords.lng + deltaLng;

        // console.log(userLocation.lat, userLocation.lng)
        broadcastUpdatedLocation(tripId.value, userLocation);
    }

    function getUserLocation() {
        navigator.geolocation.getCurrentPosition(pos => {
        userLocation.lat = pos.coords.latitude;
        userLocation.lng = pos.coords.longitude;
        store.state.location.origin = userLocation;
        // console.log(userLocation)
        mapCenter.value = [userLocation.lat, userLocation.lng];
        })
    }

    L.Icon.Default.mergeOptions({
        iconUrl: icon,
        shadowUrl: iconShadow,
    });
    const greenIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const handleStartTrip =async () => {
        store.commit('trip/SET_TRIP_STARTED');
        store.commit('location/SET_DESTINATION',store.state.trip.destination);
        store.commit('location/SET_DESTINATION_NAME',store.state.trip.destination_name);
        //set destinationcoords and selectedplace to computed props.
        destinationCoords.value = store.state.location.destination;
        selectedPlace.value = store.state.location.destination_name;
        try {
            if (!userToken.value) { console.error('User token is not set. Please login first.'); return; }
            const response = await axiosClient.post(`/api/trip/${tripId.value}/start`,{}, {
                headers: {
                'Authorization': `Bearer ${userToken.value}`
                }
            });
            console.log('Trip started')
        } catch (error) {
            console.error('Error start trip:', error.response?.data.errors);
        }
    };

    const handleEndTrip =async () => {
        try {
            const response = await axiosClient.post(`/api/trip/${tripId.value}/end`,{}, {
                headers: {
                'Authorization': `Bearer ${userToken.value}`
            }
        });
            console.log('Trip ended')
            // store.commit('location/CLEAR_LOCATION');
            popping.value = true;
            setTimeout(() => {
                store.commit('trip/CLEAR_TRIP');
                router.push({name:'Standby'});
            }, 4000);
        } catch (error) {
            console.error('Error start trip:', error.response?.data.errors);
        }
    };

    function getMapCenter() {
        const centerLat = (userLocation.lat + destinationCoords.value?.lat) / 2;        
        const centerLng = (userLocation.lng + destinationCoords.value?.lng) / 2;
        mapCenter.value = [centerLat, centerLng];
        // console.log(mapCenter)
    }

    const broadcastUpdatedLocation =async (trip, location) => {
        if (!userToken.value) { console.error('User token is not set. Please login first.'); return; }
        try {
            const response = await axiosClient.post(`/api/trip/${trip}/location`,{
                driver_location: location
            },
            {
                headers: {
                    'Authorization': `Bearer ${userToken.value}`
                }
            });
            console.log('Location Updated', response.data)
        } catch (error) {
            console.error(error)
        }
    };


    watch([userLocation, destinationCoords], async ([user, dest]) => {
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
    const drawDrivingRoute =async (map) => {
        if (routingControl.value) {
            map.removeControl(routingControl.value);
        }
        routingControl.value = L.Routing.control({
            waypoints: [
            L.latLng(userLocation.lat, userLocation.lng),
            L.latLng(destinationCoords.value.lat, destinationCoords.value.lng)
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


    onMounted(() => {
        getMapCenter();
        intervalRef.value = setInterval(async () => {
            getNewDriverLocation();

        }, 20000);
    });
    onUnmounted(() => {
        clearInterval(intervalRef.value);

        intervalRef.value = null;
    });

    
    // console.log('this is defined',destinationCoords.value.lat)

</script>
<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            {{ popping ? 'Congratulations!!!' : 'Going To ' + selectedPlace }}
        </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-4 rounded-md">
        <div  v-if="!popping">
            <div class="min-h-[200px]">
            <LMap
                ref="mapRef"
                style="height: 300px; width: 100%; margin-top: 1rem"
                :zoom="13"
                :center="mapCenter"
                @ready="(map) => drawDrivingRoute(map)"
            >
                <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <!-- <LMarker v-if="userLocation" :lat-lng="userLocation" :icon="greenIcon"/>
                <LMarker v-if="destinationCoords" :lat-lng="destinationCoords" /> -->
                <LMarker
                    v-if="userLocation.lat && userLocation.lng"
                    :lat-lng="userLatLng"
                    :icon="greenIcon"
                />

                <LMarker
                v-if="destinationCoords?.lat && destinationCoords?.lng"
                :lat-lng="[destinationCoords.lat, destinationCoords.lng]"
                />
            </LMap>
            </div>
            <div class="ride">
                <button v-if="!tripStarted" @click="handleStartTrip" class="flex justify-center rounded-sm bg-gray-800 w-full mt-1 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-black cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800">
                    Start Trip
                </button>
                <button v-else @click="handleEndTrip" class="flex justify-center rounded-sm bg-gray-800 w-full mt-1 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-black cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800">
                    End Trip
                </button>
            </div>
        </div>
        <Popping v-else />
        </div>
    </div>
</template>
<style scoped></style>