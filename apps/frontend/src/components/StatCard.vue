<script setup lang="ts">
defineProps<{
  title: string;
  value: string;
  sub?: string;
  icon: string;
  accent?: string;
}>();
</script>

<template>
  <div class="bg-ios-card rounded-3xl p-5 shadow-card animate-slide-up">
    <div class="flex items-center gap-2">
      <span class="text-xl">{{ icon }}</span>
      <span class="text-sm font-medium text-ios-secondary">{{ title }}</span>
    </div>
    <div class="mt-3 num-display text-3xl font-bold" :class="accent || 'text-ios-label'">
      {{ value }}
    </div>
    <div v-if="sub" class="mt-1.5 text-xs text-ios-secondary">{{ sub }}</div>
  </div>
</template>
