<script setup></script>
<template>
  <div class="w-32 h-32 flex items-center justify-center">
    <svg viewBox="0 0 200 100" class="w-full h-full">
      <!-- Glow filter definition -->
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Infinity track in green -->
      <path
        id="eightPath"
        d="M 20,50 
           C 20,20 80,20 100,50 
           C 120,80 180,80 180,50 
           C 180,20 120,20 100,50 
           C 80,80 20,80 20,50"
        fill="none"
        stroke="#10B981"          
        stroke-width="6"
        stroke-linecap="round"
      />

      <!-- Glowing red dot -->
      <circle r="8" fill="#EF4444" filter="url(#glow)">
        <animateMotion
          dur="4s"
          repeatCount="indefinite"
          rotate="auto"
          >
          <mpath xlink:href="#eightPath" />          
        </animateMotion>
      </circle>
    </svg>
  </div>
</template>

