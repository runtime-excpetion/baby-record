<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import AppHeader from '@/components/AppHeader.vue';
import IconPicker from '@/components/form/IconPicker.vue';
import { useRecordStore } from '@/stores/record';
import { useBabyStore } from '@/stores/baby';
import { fmtTime, minutesSince, minutesToText } from '@/utils/format';
import { type SleepType } from '@baby-record/shared';

const router = useRouter();
const message = useMessage();
const recordStore = useRecordStore();
const babyStore = useBabyStore();

// 按当前时间默认选择睡眠类型：6:00-18:00 白天，18:01-5:59 夜间
function defaultSleepType(): SleepType {
  const d = new Date();
  const minutesOfDay = d.getHours() * 60 + d.getMinutes();
  return minutesOfDay >= 6 * 60 && minutesOfDay <= 18 * 60 ? 'DAYTIME' : 'NIGHT';
}

const sleepType = ref<SleepType>(defaultSleepType());
const now = ref(Date.now());
let timer: ReturnType<typeof setInterval>;

const ongoing = computed(() => recordStore.ongoingSleep);
const elapsedText = computed(() => {
  if (!ongoing.value) return '';
  return minutesToText(minutesSince(ongoing.value.startTime, new Date(now.value)));
});

const sleepTypeOptions: { label: string; value: SleepType; icon: string }[] = [
  { label: '白天', value: 'DAYTIME', icon: '☀️' },
  { label: '夜间', value: 'NIGHT', icon: '🌙' },
];

async function refreshOngoing() {
  if (babyStore.currentBaby) {
    await recordStore.checkOngoing(babyStore.currentBaby.id);
  }
}

function onVisibility() {
  // 多用户场景：切回页面时重新拉取进行中的睡眠，确保看到其他人记录的状态
  if (document.visibilityState === 'visible') {
    refreshOngoing();
  }
}

onMounted(async () => {
  await refreshOngoing();
  timer = setInterval(() => {
    now.value = Date.now();
  }, 30000);
  document.addEventListener('visibilitychange', onVisibility);
});

onUnmounted(() => {
  clearInterval(timer);
  document.removeEventListener('visibilitychange', onVisibility);
});

async function onStart() {
  try {
    await recordStore.startSleep(sleepType.value);
    message.success('已开始睡眠记录');
  } catch {
    // 错误已由拦截器提示
  }
}

async function onEnd() {
  try {
    await recordStore.endSleep();
    message.success('睡眠已结束');
    router.push('/');
  } catch {
    // 错误已由拦截器提示
  }
}
</script>

<template>
  <div>
    <AppHeader title="睡眠记录" show-back />
    <div class="px-5 mt-4">
      <!-- 进行中 -->
      <div
        v-if="ongoing"
        class="bg-ios-card rounded-3xl p-6 shadow-card text-center animate-scale-in"
      >
        <div class="text-5xl mb-3">😴</div>
        <p class="text-sm text-ios-secondary">宝宝睡眠中</p>
        <p class="num-display text-4xl font-bold text-ios-purple mt-2">{{ elapsedText }}</p>
        <p class="text-xs text-ios-secondary mt-2">从 {{ fmtTime(ongoing.startTime) }} 开始</p>
        <button
          class="w-full mt-5 py-3.5 rounded-2xl bg-ios-purple text-white font-semibold active:scale-95 transition-transform duration-150 disabled:opacity-60"
          :disabled="recordStore.submitting"
          @click="onEnd"
        >
          {{ recordStore.submitting ? '处理中…' : '结束睡觉' }}
        </button>
      </div>

      <!-- 未开始 -->
      <div v-else class="space-y-3">
        <div class="bg-ios-card rounded-3xl p-4 shadow-card">
          <label class="text-sm font-medium text-ios-secondary">睡眠类型</label>
          <IconPicker v-model="sleepType" :options="sleepTypeOptions" active-color="bg-ios-purple" :cols="2" class="mt-3" />
        </div>
        <div class="bg-ios-card rounded-3xl p-6 shadow-card text-center">
          <div class="text-5xl mb-3">🌙</div>
          <p class="text-sm text-ios-secondary mb-4">准备好让宝宝睡觉了吗？</p>
          <button
            class="w-full py-3.5 rounded-2xl bg-ios-purple text-white font-semibold active:scale-95 transition-transform duration-150 disabled:opacity-60"
            :disabled="recordStore.submitting"
            @click="onStart"
          >
            {{ recordStore.submitting ? '处理中…' : '开始睡觉' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
