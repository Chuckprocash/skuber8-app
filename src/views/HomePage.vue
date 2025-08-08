<script setup>
    import { onMounted, reactive, ref } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import axiosClient from '../axiosClient';
    import CustomLoader from '../components/Loading.vue';
    import { isLoading } from '../store/loading';
    
    
    const router = useRouter();
    const store = useStore();
    
    const userToken = ref(store.state.token);
    const userLocation = reactive({
      lat: '',
      lng: '',
    });
    

    function getUserLocation() {
      navigator.geolocation.getCurrentPosition(pos => {
        userLocation.lat = pos.coords.latitude;
        userLocation.lng = pos.coords.longitude;
        store.state.location.origin = userLocation;
      })
    }
    

    const checkDriver =async () => {
      if (!userToken.value) { console.error('User token is not set. Please login first.'); return; }
      try {
        const response = await axiosClient.get('/api/driver', {
          headers: {
            'Authorization': `Bearer ${userToken.value}`
          },
        });
        // console.log('Driver Account Fetched.', response.data);
        return response.data.data;
      } catch (error) {
        console.error('No Driver Found', error);
      }
    };

    const handleDriverRequest =async () => {
      const driverData =await checkDriver();
      // console.log(driverData)
      if(!driverData){console.error("Error"); return;  }
      if(driverData.driver){
        router.push({ name: 'Standby' });
      }else{
        router.push({ name: 'AddLicense' });
      }
    };

    
    const checkUser =async () => {
      if (!userToken.value) { console.error('User token is not set. Please login first.'); return; }
      try {
        const response = await axiosClient.get('/api/user', {
          headers: {
            'Authorization': `Bearer ${userToken.value}`
          },
        });
        console.log('User Account Fetched.', response.data);
        store.commit('setUser', response.data);
      } catch (error) {
        console.error('No User Found', error);
      }
    };

    onMounted(() => {
        // console.log()
        if(!store.state.token){
            router.push({ name: 'Login' });
        }
        getUserLocation();
        checkUser();
    });
</script>
<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Select your user type for this session</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-4 rounded-md">
      <div class="min-h-[200px] flex justify-center items-center">
        <CustomLoader v-if="isLoading"/>
      </div>
      <div class="flex justify-between">
        <button @click="handleDriverRequest" class="flex justify-center rounded-sm bg-gray-800 px-10 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-black cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800">
          Start Driving</button>
        <button @click="router.push({ name: 'Location' })" class="flex justify-center rounded-sm bg-gray-800 px-10 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-black cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800">
          Find A Ride</button>
      </div>
    </div>
  </div>
</template>
<style scoped></style>