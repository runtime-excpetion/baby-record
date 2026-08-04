<script setup lang="ts">
import { onMounted, computed } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import RecordTypeGrid from '@/components/RecordTypeGrid.vue';
import { useRecordStore } from '@/stores/record';
import { useBabyStore } from '@/stores/baby';
import { fmtTime } from '@/utils/format';

const recordStore = useRecordStore();
const babyStore = useBabyStore();
const baby = computed(() => babyStore.currentBaby);

onMounted(() => {
  if (baby.value) recordStore.checkOngoing(baby.value.id);
});
</script>

<template>
  <div>
    <AppHeader title="记录" subtitle="选择记录类型" />
    <div class="px-5 mt-5">
      <RecordTypeGrid />

      <!-- 睡眠进行中提示 -->
      <div
        v-if="recordStore.ongoingSleep"
        class="mt-4 bg-ios-purple/10 rounded-3xl p-4 flex items-center gap-3"
      >
        <span class="text-2xl">😴</span>
        <div class="flex-1">
          <p class="text-sm font-medium text-ios-label">宝宝正在睡眠中</p>
          <p class="text-xs text-ios-secondary">
            从 {{ fmtTime(recordStore.ongoingSleep.startTime) }} 开始 · 点击「睡眠」结束
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
