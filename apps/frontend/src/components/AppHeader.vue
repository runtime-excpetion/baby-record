<script setup lang="ts">
import { useRouter } from 'vue-router';

defineProps<{ title: string; subtitle?: string; showBack?: boolean }>();

const router = useRouter();
</script>

<template>
  <header class="sticky top-0 z-10 bg-ios-bg/80 backdrop-blur-xl safe-top">
    <div class="px-5 pt-4 pb-2 flex items-center gap-2">
      <button
        v-if="showBack"
        class="w-8 h-8 -ml-1 flex items-center justify-center text-ios-blue text-3xl leading-none"
        @click="router.back()"
      >
        ‹
      </button>
      <div>
        <h1 class="text-2xl font-bold text-ios-label">{{ title }}</h1>
        <p v-if="subtitle" class="text-sm text-ios-secondary mt-0.5">{{ subtitle }}</p>
      </div>
    </div>
  </header>
</template>
