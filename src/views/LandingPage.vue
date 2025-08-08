<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center bg-gray-100">
    <h1 class="text-6xl font-bold text-red-500 mb-4">404</h1>
    <p class="text-xl text-gray-700 mb-6">Oops! The page you're looking for doesn't exist.</p>
    <router-link
      to="/"
      class="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
    >
      Go back home
    </router-link>
  </div>
</template>

<script setup>
// No script needed for static display
</script>
