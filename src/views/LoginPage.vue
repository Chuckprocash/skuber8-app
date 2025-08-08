<script setup>
  import { useStore } from 'vuex';
  import axiosClient from '../axiosClient';
  import { ref, onMounted } from 'vue';
  import { vMaska } from "maska/vue";
  import { useRouter } from 'vue-router';


  const router = useRouter();
  const phoneId = ref(null);
  const userToken = ref(null);
  const passwordId = ref(null);
  const varifyNow = ref(false);
  const store = useStore();

  const login =async () => {
  if(!phoneId) return;
  phoneId.value = phoneId.value.replace('-', '');
  try {
    const response = await axiosClient.post('/api/login', {phone: phoneId.value});
    console.log('please varify phone number:', response.data);
    varifyNow.value = true;
  } catch (error) {
    console.error('Error during login:', error);
  }
  };

  const varifyLogin =async () => {
    if(!passwordId) return;
    phoneId.value = phoneId.value.replace('-', '');
    try {
      const response = await axiosClient.post('/api/login/varification', {
      phone: phoneId.value,
      login_code: passwordId.value,
    });
    userToken.value = response.data;
    store.commit('setToken', userToken.value);
      // console.log('User token set:', userToken.value);
      console.log('Login successful:', response.data);
      router.push({name: 'Home'});
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  // onMounted(() => {
  //   if(store.state.token){
  //     router.push({ name: 'Home' });
  //   }
  // });
</script>
<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Enter Your Phone Number</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-4 rounded-md">
      <form  v-if="!varifyNow" class="space-y-6" @submit.prevent="login">
        <div>
          <label for="phone" class="block text-sm/6 font-medium text-gray-900">phone number</label>
          <div class="mt-4">
            <input type="text" v-model="phoneId" v-maska="'+###-##########'" name="phone" id="phone" autocomplete="phone" required="true" placeholder="+880-1234567890"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6" />
          </div>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="flex justify-center rounded-sm bg-gray-800 px-10 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-black cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800">Sign in</button>
        </div>
      </form>
      <form  v-else class="space-y-6" @submit.prevent="varifyLogin">
        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-gray-800 hover:text-indigo-500">Didn't receive code?</a>
            </div>
          </div>
          <div class="mt-4">
            <input type="password" v-model="passwordId" v-maska="'######'" name="password" id="password" autocomplete="current-password" required="true" 
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6" />
          </div>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="flex justify-center rounded-sm bg-gray-800 px-10 py-2 text-sm/6 font-semibold text-white shadow-xs 
          hover:bg-black cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800">Varify</button>
        </div>
      </form>

      
    </div>
  </div>
</template>
