import { defineStore } from 'pinia';
import { ref } from 'vue';
import { sleepApi } from '@/api/sleep';
import type { SleepVo, SleepType } from '@baby-record/shared';
import { useBabyStore } from './baby';
import { useUserStore } from './user';

export const useRecordStore = defineStore('record', () => {
  const ongoingSleep = ref<SleepVo | null>(null);
  const submitting = ref(false);

  /** 检查是否有进行中的睡眠 */
  async function checkOngoing(babyId: number) {
    const res = await sleepApi.list({ babyId, ongoing: true, page: 1, pageSize: 1 });
    ongoingSleep.value = res.list[0] || null;
  }

  async function startSleep(sleepType?: SleepType) {
    const baby = useBabyStore().currentBaby;
    const user = useUserStore().currentUser;
    if (!baby || !user) throw new Error('缺少宝宝或记录人');
    submitting.value = true;
    try {
      const sleep = await sleepApi.start({ babyId: baby.id, sleepType, creatorId: user.id });
      ongoingSleep.value = sleep;
      return sleep;
    } finally {
      submitting.value = false;
    }
  }

  async function endSleep(remark?: string) {
    if (!ongoingSleep.value) return;
    submitting.value = true;
    try {
      const sleep = await sleepApi.end(ongoingSleep.value.id, { remark });
      ongoingSleep.value = null;
      return sleep;
    } finally {
      submitting.value = false;
    }
  }

  return { ongoingSleep, submitting, checkOngoing, startSleep, endSleep };
});
