import { defineStore } from 'pinia';
import { ref } from 'vue';
import { dashboardApi } from '@/api/dashboard';
import type { DashboardData } from '@baby-record/shared';

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref<DashboardData | null>(null);
  const loading = ref(false);

  async function fetch(babyId: number) {
    loading.value = true;
    try {
      data.value = await dashboardApi.overview(babyId);
    } finally {
      loading.value = false;
    }
  }

  return { data, loading, fetch };
});
