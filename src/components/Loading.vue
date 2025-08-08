<template>
  <div class="w-32 h-32 flex items-center justify-center">
    <svg
      viewBox="0 0 100 100"
      class="w-full h-full"
    >
      <!-- Figure-eight path -->
      <path
        id="infinityPath"
        d="M 30,50
           C 30,20 70,20 70,50
           C 70,80 30,80 30,50
           Z"
        fill="none"
        stroke="#d1d5db"
        stroke-width="4"
      />

      <!-- Moving circle (dot) -->
      <circle r="4.5" fill="#3b82f6">
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          rotate="auto"
        >
          <mpath xlink:href="#infinityPath" />
        </animateMotion>
      </circle>
    </svg>
  </div>
</template>