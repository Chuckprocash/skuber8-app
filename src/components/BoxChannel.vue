<script setup>
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { ref, onMounted } from 'vue';
import CustomLoader from './CustomLoader.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
const tripReceived = computed(() => store.state.trip);

const setTrip = (trip) => {
    store.commit('trip/SET_TRIP', trip);
};

// const setUser = (user) => {
//     store.commit('trip/SET_USER', user);
// };

// const options = {
//     broadcaster: 'pusher',
//     key: import.meta.env.VITE_PUSHER_APP_KEY
// }
 
// window.Echo = new Echo({
//     ...options,
//     client: new Pusher(options.key, options)
// });

onMounted(() => {
    let echo = new Echo({
        broadcaster: 'pusher',
        key: 'monkey',
        cluster: 'mt1',
        wsPort: 8080,
        wsHost: window.location.hostname,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss']
    });
    echo.channel('driver')
        .listen('TripCreated', (data) => {
            // console.log('Received data for a drive:', data);
            setTrip(data.trip);
            // setUser(data.user);
            //need to save the data to a store object then retrieved it to draw a map.
            console.log('Trip Received!!!', tripReceived.value)
        });
    echo.connector.pusher.connection.bind('connected', () => {
    console.log('🎉 Echo connected!');
});
});

</script>
<template>
    <CustomLoader />
</template>
<style scoped></style>