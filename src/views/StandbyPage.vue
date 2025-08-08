<script setup>
    import BoxChannel from '../components/BoxChannel.vue';
    import LoopingBarLoader from '../components/LoopingBarLoader.vue';
    import { useStore } from 'vuex';
    import { computed, ref } from 'vue';
    import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
    import axiosClient from '../axiosClient';
    import { useRouter } from 'vue-router';
    import { isLoading } from '../store/loading';
    import L from 'leaflet';
    import icon from 'leaflet/dist/images/marker-icon.png';
    import iconShadow from 'leaflet/dist/images/marker-shadow.png';
    
    const router = useRouter();
    const mapRef = ref();
    

    const store = useStore();
    const tripReceived = computed(() => store.state.trip);
    const mapCenter = computed(() => tripReceived.value ? tripReceived.value.origin : '');
    const userLocation = computed(() => tripReceived.value ? tripReceived.value.origin : '');
    const tripDestination = computed(() => tripReceived.value ? tripReceived.value.destination : '');
    const title = computed(() => tripReceived.value ? tripReceived.value.destination_name : '');

    const clearTrip = () => {
        store.commit('trip/CLEAR_TRIP');
    };

    const handleAcceptTrip =async () => {
        if(!store.state.token){console.error('Not Authorized'); return; }
        // console.log(tripReceived)
        try {
            const response = await axiosClient.post(`/api/trip/${tripReceived.value.id}/accept`,{
                'driver_location' : store.state.location.origin
            },
            {
                headers: {
                    'Authorization': `Bearer ${store.state.token}`,
                },
            });
            console.log('Success', response)
            store.commit('location/SET_DESTINATION', response.data.data.origin);
            store.commit('location/SET_DESTINATION_NAME','passenger Location');
            // store.state.location.destination_name = 'Passenger_Location,';
            // store.state.location.origin = userLocation;
            // console.log(store.state.location)
            router.push({ name: 'DriveTo' });
        } catch (error) {
            console.error('Error Fetching Data')
        }
    };

</script>
<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">{{ title ? title : 'Waiting For A Ride Request...' }}</h2>
        </div>
        <div v-if="tripReceived.id" class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-4 rounded-md">
            <div class="min-h-[200px] flex flex-col justify-center items-center">
                <LoopingBarLoader v-if="isLoading"/>
                <LMap
                    ref="mapRef"
                    style="height: 300px; width: 100%; margin-top: 1rem"
                    :zoom="14"
                    :center="mapCenter"
                    >
                    <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LMarker v-if="userLocation" :lat-lng="userLocation" />
                    <LMarker v-if="tripDestination" :lat-lng="tripDestination" />
                </LMap>
            </div>
            <div class="flex justify-around mt-4">
                <button @click="handleAcceptTrip" class="flex justify-center rounded-sm bg-gray-800 px-10 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-black cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800">
                    Accept</button>
                <button @click="clearTrip" class="flex justify-center rounded-sm bg-gray-800 px-10 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-black cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800">
                    Decline</button>
            </div>
        </div>
        <div v-else class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm p-4 rounded-md">
            <div class="min-h-[200px] flex justify-center">
                <BoxChannel />
            </div>
        </div>
    </div>
</template>
<style scoped></style>