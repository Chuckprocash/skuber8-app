import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import axiosClient from '../axiosClient';

import HomeView from '../views/HomePage.vue';
import NotFoundView from '../views/LandingPage.vue';
import LoginView from '../views/LoginPage.vue';
import LocationView from '../views/LocationPage.vue';
import TripView from '../views/TripPage.vue';
import StandbyView from '../views/StandbyPage.vue';
import AddLicenseView from '../views/AddLicensePage.vue';
import DriveToView from '../views/DriveToPage.vue';


// const store = useStore();

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/', name: 'Home', component: HomeView },
  { path: '/location', name: 'Location', component: LocationView },
  { path: '/trip', name: 'Trip', component: TripView },
  { path: '/standby', name: 'Standby', component: StandbyView },
  { path: '/addlicense', name: 'AddLicense', component: AddLicenseView },
  { path: '/driveTo', name: 'DriveTo', component: DriveToView },



  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// router.beforeEach((to, from) => {
//   if(!store.state.token && to.name !== 'Login'){
//     return { name: Login};
//   }else if(to.name !== 'Login'){
//     try {
//       axiosClient.get('/api/user', {
//         headers: {
//           'Authorization': `Bearer ${store.state.token}`
//         },
//       })
//       .then((response) => { console.log(response) })
//       .catch((error) => { 
//         console.log(error)
//         store.state.token = null;
//         return { name: Login};
//       })
//     } catch (error) {
//       //
//     }
//   }
// });


export default router;