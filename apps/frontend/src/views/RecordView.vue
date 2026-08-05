<script setup lang="ts">
import { useRouter } from 'vue-router';
import HistoryView from '@/views/HistoryView.vue';

const router = useRouter();

const quickActions = [
  { icon: '🍚', label: '喂养', to: '/record/feeding' },
  { icon: '🧷', label: '纸尿裤', to: '/record/diaper' },
  { icon: '😴', label: '睡觉', to: '/record/sleep' },
  { icon: '✨', label: '其他', to: '/record/activity' },
];
</script>

<template>
  <HistoryView title="记录" :show-back="false">
    <template #prepend>
      <div class="px-5 mt-4">
        <div class="flex gap-2">
          <button
            v-for="action in quickActions"
            :key="action.label"
            class="flex-1 py-2.5 rounded-2xl bg-ios-card shadow-card flex flex-col items-center gap-0.5 active:scale-95 transition-transform"
            @click="router.push(action.to)"
          >
            <span class="text-xl">{{ action.icon }}</span>
            <span class="text-xs text-ios-label">{{ action.label }}</span>
          </button>
        </div>
      </div>
    </template>
  </HistoryView>
</template>
