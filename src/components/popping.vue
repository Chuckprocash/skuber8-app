<template>
  <div class="w-[200px] h-[200px] flex items-center justify-center">
    <div class="text-5xl animate-pop">🎉</div>
  </div>
</template>

<style scoped>
@keyframes pop {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.5) rotate(30deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

.animate-pop {
  animation: pop 2s ease-in-out forwards;
}
</style>
