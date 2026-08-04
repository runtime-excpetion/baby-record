<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBabyStore } from '@/stores/baby';
import { useDashboardStore } from '@/stores/dashboard';
import { useRecordStore } from '@/stores/record';
import StatCard from '@/components/StatCard.vue';
import QuickActionButton from '@/components/QuickActionButton.vue';
import { fmtTime } from '@/utils/format';

const router = useRouter();
const babyStore = useBabyStore();
const dashStore = useDashboardStore();
const recordStore = useRecordStore();

const baby = computed(() => babyStore.currentBaby);
const loading = computed(() => babyStore.loading || (dashStore.loading && !dashStore.data));

async function refresh() {
  if (baby.value) {
    await Promise.all([
      dashStore.fetch(baby.value.id),
      recordStore.checkOngoing(baby.value.id),
    ]);
  }
}

function onVisibility() {
  // 多用户场景：切回页面时刷新首页状态（含进行中睡眠）
  if (document.visibilityState === 'visible') refresh();
}

onMounted(async () => {
  if (!babyStore.babies.length) {
    await babyStore.loadBabies();
  }
  await refresh();
  document.addEventListener('visibilitychange', onVisibility);
});

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibility);
});

const quickActions = [
  { icon: '🍚', label: '喂养', color: 'bg-ios-orange/15', to: '/record/feeding' },
  { icon: '🧷', label: '纸尿裤', color: 'bg-ios-blue/15', to: '/record/diaper' },
  { icon: '😴', label: '睡觉', color: 'bg-ios-purple/15', to: '/record/sleep' },
  { icon: '✨', label: '其他', color: 'bg-ios-green/15', to: '/record/activity' },
];

const sleepValue = computed(() => {
  if (recordStore.ongoingSleep) return '睡眠中';
  return dashStore.data?.sleep.text || '-';
});

const sleepSub = computed(() => {
  if (recordStore.ongoingSleep) {
    return `从 ${fmtTime(recordStore.ongoingSleep.startTime)} 开始睡眠中`;
  }
  if (dashStore.data?.sleep.lastTime) {
    return `最近 ${fmtTime(dashStore.data.sleep.lastTime)}`;
  }
  return '今天还没有睡眠记录';
});
</script>

<template>
  <div v-if="loading && !baby" class="px-5 pt-14 safe-top animate-fade-in">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-14 h-14 rounded-full bg-ios-fill/60 animate-pulse" />
      <div class="flex-1">
        <div class="h-5 bg-ios-fill/60 rounded-lg animate-pulse mb-2 w-24" />
        <div class="h-3.5 bg-ios-fill/60 rounded animate-pulse w-36" />
      </div>
    </div>
    <div class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-[110px] bg-ios-fill/60 rounded-3xl animate-pulse" />
    </div>
  </div>

  <div v-else-if="!baby" class="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
    <div class="text-5xl mb-3">👶</div>
    <p class="text-ios-label font-medium">还没有宝宝信息</p>
    <p class="text-sm text-ios-secondary mt-1">请在「我的」页面添加宝宝</p>
  </div>

  <div v-else class="animate-fade-in">
    <!-- 宝宝 Header -->
    <header class="px-5 pt-14 pb-2 safe-top">
      <div class="flex items-center gap-3">
        <div
          class="w-14 h-14 rounded-full bg-gradient-to-br from-ios-blue to-ios-teal flex items-center justify-center text-3xl shadow-soft"
        >
          👶
        </div>
        <div>
          <h1 class="text-2xl font-bold text-ios-label">{{ baby.nickname || baby.name }}</h1>
          <p class="text-sm text-ios-secondary mt-0.5">
            {{ baby.age.monthAgeText }} · 出生 {{ baby.birthday }}
          </p>
        </div>
      </div>
    </header>

    <!-- 状态卡片 -->
    <section class="px-5 mt-4 space-y-3">
      <StatCard
        icon="🍼"
        title="距离上次喂养"
        :value="dashStore.data?.feeding.text || '-'"
        accent="text-ios-orange"
        :sub="
          dashStore.data?.feeding.lastTime
            ? `最近 ${fmtTime(dashStore.data.feeding.lastTime)}`
            : '今天还没有喂养记录'
        "
      />
      <StatCard
        icon="🧷"
        title="距离上次换纸尿裤"
        :value="dashStore.data?.diaper.text || '-'"
        accent="text-ios-blue"
        :sub="
          dashStore.data?.diaper.lastTime
            ? `最近 ${fmtTime(dashStore.data.diaper.lastTime)}`
            : '今天还没有更换记录'
        "
      />
      <StatCard icon="😴" title="距离上次睡眠" :value="sleepValue" accent="text-ios-purple" :sub="sleepSub" />
    </section>

    <!-- 快捷操作 -->
    <section class="px-5 mt-7">
      <h2 class="text-sm font-semibold text-ios-secondary mb-3 px-1">快捷操作</h2>
      <div class="bg-ios-card rounded-3xl p-4 shadow-card grid grid-cols-4 gap-2">
        <QuickActionButton
          v-for="a in quickActions"
          :key="a.label"
          :icon="a.icon"
          :label="a.label"
          :color="a.color"
          @click="router.push(a.to)"
        />
      </div>
    </section>

    <!-- 历史记录入口 -->
    <section class="px-5 mt-4">
      <button
        class="w-full bg-ios-card rounded-3xl p-4 shadow-card flex items-center gap-3 active:scale-[0.98] transition-transform"
        @click="router.push('/history')"
      >
        <span class="text-2xl">📋</span>
        <div class="flex-1 text-left">
          <p class="text-sm font-semibold text-ios-label">历史记录</p>
          <p class="text-xs text-ios-secondary">查看每天喂养 / 睡眠 / 护理时间轴</p>
        </div>
        <span class="text-ios-secondary text-xl">›</span>
      </button>
    </section>
  </div>
</template>
