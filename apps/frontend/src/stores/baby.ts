import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { babyApi } from '@/api/baby';
import type { BabyVo } from '@baby-record/shared';

const CURRENT_BABY_KEY = 'baby-record:currentBabyId';

export const useBabyStore = defineStore('baby', () => {
  const babies = ref<BabyVo[]>([]);
  const currentBabyId = ref<number | null>(null);
  const loading = ref(false);

  const currentBaby = computed(() => babies.value.find((b) => b.id === currentBabyId.value) || null);

  async function loadBabies() {
    loading.value = true;
    try {
      babies.value = await babyApi.list();
      if (babies.value.length && currentBabyId.value === null) {
        const saved = Number(localStorage.getItem(CURRENT_BABY_KEY));
        const target = babies.value.find((b) => b.id === saved) || babies.value[0];
        currentBabyId.value = target.id;
      }
    } finally {
      loading.value = false;
    }
  }

  function setCurrentBaby(id: number) {
    currentBabyId.value = id;
    localStorage.setItem(CURRENT_BABY_KEY, String(id));
  }

  return { babies, currentBabyId, currentBaby, loading, loadBabies, setCurrentBaby };
});
