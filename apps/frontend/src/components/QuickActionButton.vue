<script setup lang="ts">
defineProps<{ icon: string; label: string; color: string }>();
</script>

<template>
  <button
    class="flex flex-col items-center gap-1.5 active:scale-95 transition-transform duration-150"
  >
    <span
      class="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-card"
      :class="color"
    >
      {{ icon }}
    </span>
    <span class="text-xs font-medium text-ios-label">{{ label }}</span>
  </button>
</template>
