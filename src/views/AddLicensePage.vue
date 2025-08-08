<script setup>
  import { reactive, ref } from 'vue';
  import { useStore } from 'vuex';
  import axiosClient from '../axiosClient';
  import router from '../router';


  const userToken = ref(null);
  const store = useStore();
  userToken.value = store.state.token;
  
  const formData = reactive({
      name: '',
      make: '',
      model: '',
      color: '',
      year: '',
      license_plate: '',
  });

  const updateDriver =async () => {
    if (!userToken.value) { console.error('User token is not set. Please login first.'); return; }
    try {
    const response = await axiosClient.post('/api/driver', {
        name: formData.name,
        make: formData.make,
        model: formData.model,
        color: formData.color,
        year: formData.year,
        license_plate: formData.license_plate,
    }, {
        headers: {
        'Authorization': `Bearer ${userToken.value}`
        },
    });
    console.log('Driver Account Updated.', response.data);
    router.push({ name: 'Standby' });
    } catch (error) {
    console.error('Error updating driver account:', error.response?.data.errors);
    }
  };

</script>
<template>
<section>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2
          class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
        >
            Add Driver Information
          </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-4" @submit.prevent="updateDriver">
          <div>
            <div class="error"></div>
            <div class="mt-2">
              <input
                placeholder="Full Name"
                type="text"
                id="name" required
                v-model="formData.name"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <div class="error"></div>
            <div class="mt-2">
              <input
                type="number"
                v-model="formData.year"
                id="year" required placeholder="Car Year"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div class="error"></div>
            <div class="mt-2">
              <input
                type="text"
                id="make"
                v-model="formData.make"
                required placeholder="Make"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <div class="error"></div>
            <div class="mt-2">
              <input
                type="text"
                id="Model"
                v-model="formData.model"
                required placeholder="Model"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <div class="error"></div>
            <div class="mt-2">
              <input
                type="text"
                id="Color"
                v-model="formData.color"
                required placeholder="Color"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <div class="error"></div>
            <div class="mt-2">
              <input
                type="text"
                id="Liecense"
                v-model="formData.license_plate"
                required placeholder="#Liecense Plate"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center cursor-pointer rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
            >
              Let's Drive
            </button>
          </div>
        </form>
      </div>
    </div>
</section>
</template>
<style scoped></style>