<script setup>
  import { ref, computed } from 'vue';
  import axiosClient from './axiosClient';
  import { useStore } from 'vuex';
  import BoxChannel from './components/BoxChannel.vue';
  import { RouterView } from 'vue-router';
  import Layout from './components/Layout.vue';

  const userToken = ref(null);
  const store = useStore();
  userToken.value = store.state.token;

  // console.log('Hello from App.vue!');

  const submitTrip =async () => {
    if (!userToken.value) { console.error('User token is not set. Please login first.'); return; }
    try {
      const response = await axiosClient.post('/api/trip', {
        origin: store.state.myLocation.origin,
        destination: store.state.myLocation.destination,
        destination_name: store.state.myLocation.destination_name,
      }, {
        headers: {
          'Authorization': `Bearer ${userToken.value}`
        },
      });
      console.log('Trip Submitted.', response.data);
      store.commit('trip/SET_TRIP', response.data);
    } catch (error) {
      console.error('Error submitting trip:', error.response?.data.errors);
    }
  };

  const showTrip =async () => {
    if (!userToken.value) { console.error('User token is not set. Please login first.'); return; }
    try {
      const response = await axiosClient.get(`/api/trip/${12}`, {
        headers: {
          'Authorization': `Bearer ${userToken.value}`
        },
      });
      console.log('Trip Fetched.', response.data);
    } catch (error) {
      console.error('Error fetching trip:', error.response?.data.errors);
    }
  };
</script>

<template>
  <Layout>
    <div class="container mx-auto md:max-w-[80vw]">
      <RouterView @submitTrip="submitTrip"/>
    </div>
  </Layout>
</template>

<style scoped>

</style>
