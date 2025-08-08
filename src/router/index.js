import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
// import { useStore } from 'vuex';
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

router.beforeEach(async (to, from) => {
  // If no token and not going to login, redirect to login
  if (!store.state.token && to.name !== 'Login') {
    return { name: 'Login' };
  }
  
  // If going to login page, allow navigation
  if (to.name === 'Login') {
    return true;
  }
  
  // Verify token is still valid
  try {
    await axiosClient.get('/api/user', {
      headers: {
        'Authorization': `Bearer ${store.state.token}`
      }
    });
    
    // Token is valid, allow navigation
    return true;
    
  } catch (error) {
    console.log('Token validation failed:', error);
    
    // Clear invalid token
    store.state.token = null;
    
    // Redirect to login
    return { name: 'Login' };
  }
});


export default router;