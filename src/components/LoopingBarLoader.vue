<template>
  <div class="relative w-40 h-1 bg-gray-300 rounded-full overflow-hidden">
    <div
      class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full animate-move-dot"
    ></div>
  </div>
</template>

<style scoped>
@keyframes move-dot {
  0% {
    left: 0%;
  }
  100% {
    left: 100%;
  }
}

.animate-move-dot {
  animation: move-dot 1.5s linear infinite;
}
</style>
