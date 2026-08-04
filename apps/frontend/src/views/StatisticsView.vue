<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import VChart from 'vue-echarts';
import '@/utils/echarts';
import { NDatePicker } from 'naive-ui';
import AppHeader from '@/components/AppHeader.vue';
import TypeSegment from '@/components/form/TypeSegment.vue';
import { chartApi } from '@/api/chart';
import { statisticsApi, type StatsParams } from '@/api/statistics';
import { useBabyStore } from '@/stores/baby';
import { fmtDate } from '@/utils/format';
import type { ChartResult, SupplementStats } from '@baby-record/shared';

const babyStore = useBabyStore();

type RangeOpt = '7d' | '30d' | 'custom';
const range = ref<RangeOpt>('7d');
const startDate = ref(Date.now() - 6 * 86400000);
const endDate = ref(Date.now());
const loading = ref(false);

const feedingChart = ref<ChartResult | null>(null);
const sleepChart = ref<ChartResult | null>(null);
const diaperChart = ref<ChartResult | null>(null);
const supplementStats = ref<SupplementStats | null>(null);
const supplementTrendChart = ref<ChartResult | null>(null);

const rangeOptions: { label: string; value: RangeOpt }[] = [
  { label: '7天', value: '7d' },
  { label: '30天', value: '30d' },
  { label: '自定义', value: 'custom' },
];

function buildParams(): StatsParams {
  const baby = babyStore.currentBaby!;
  if (range.value === 'custom') {
    return {
      babyId: baby.id,
      range: 'custom',
      startDate: fmtDate(startDate.value),
      endDate: fmtDate(endDate.value),
    };
  }
  return { babyId: baby.id, range: range.value };
}

async function loadAll() {
  const baby = babyStore.currentBaby;
  if (!baby) return;
  loading.value = true;
  try {
    const params = buildParams();
    const [f, s, d, supStats, supTrend] = await Promise.all([
      chartApi.feeding(params),
      chartApi.sleep(params),
      chartApi.diaper(params),
      statisticsApi.supplement(params),
      chartApi.supplement(params),
    ]);
    feedingChart.value = f;
    sleepChart.value = s;
    diaperChart.value = d;
    supplementStats.value = supStats;
    supplementTrendChart.value = supTrend;
  } finally {
    loading.value = false;
  }
}

const feedingOption = computed(() => {
  const c = feedingChart.value;
  if (!c) return null;
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: c.series.map((s) => s.name), top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 36, right: 36, top: 32, bottom: 28 },
    xAxis: {
      type: 'category',
      data: c.xAxis,
      axisLabel: { fontSize: 10, formatter: (v: string) => v.slice(5) },
    },
    yAxis: [
      { type: 'value', name: '次数', axisLabel: { fontSize: 10 }, splitLine: { lineStyle: { type: 'dashed' } } },
      { type: 'value', name: 'ml', axisLabel: { fontSize: 10 }, splitLine: { show: false } },
    ],
    series: c.series.map((s, i) => ({
      name: s.name,
      type: 'line',
      smooth: true,
      data: s.data,
      yAxisIndex: i,
      itemStyle: { color: i === 0 ? '#ff9500' : '#007aff' },
      lineStyle: { width: 2 },
    })),
  };
});

const sleepOption = computed(() => {
  const c = sleepChart.value;
  if (!c || !c.series.length) return null;
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 16, top: 16, bottom: 28 },
    xAxis: {
      type: 'category',
      data: c.xAxis,
      axisLabel: { fontSize: 10, formatter: (v: string) => v.slice(5) },
    },
    yAxis: { type: 'value', name: '分钟', axisLabel: { fontSize: 10 }, splitLine: { lineStyle: { type: 'dashed' } } },
    series: [
      {
        type: 'bar',
        data: c.series[0].data,
        itemStyle: { color: '#af52de', borderRadius: [4, 4, 0, 0] },
        barWidth: '60%',
      },
    ],
  };
});

const diaperOption = computed(() => {
  const c = diaperChart.value;
  if (!c || !c.series.length) return null;
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 16, top: 16, bottom: 28 },
    xAxis: {
      type: 'category',
      data: c.xAxis,
      axisLabel: { fontSize: 10, formatter: (v: string) => v.slice(5) },
    },
    yAxis: { type: 'value', name: '次', axisLabel: { fontSize: 10 }, splitLine: { lineStyle: { type: 'dashed' } } },
    series: [
      {
        type: 'bar',
        data: c.series[0].data,
        itemStyle: { color: '#007aff', borderRadius: [4, 4, 0, 0] },
        barWidth: '60%',
      },
    ],
  };
});

const supplementOption = computed(() => {
  const s = supplementStats.value;
  if (!s || !s.typeStats.length) return null;
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [
      {
        type: 'pie',
        radius: ['40%', '68%'],
        center: ['50%', '42%'],
        data: s.typeStats.map((t) => ({ name: t.name, value: t.count })),
        label: { fontSize: 10 },
        itemStyle: { borderColor: '#fff', borderWidth: 2 },
      },
    ],
  };
});

const supplementTrendOption = computed(() => {
  const c = supplementTrendChart.value;
  if (!c || !c.series.length) return null;
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 16, top: 16, bottom: 28 },
    xAxis: {
      type: 'category',
      data: c.xAxis,
      axisLabel: { fontSize: 10, formatter: (v: string) => v.slice(5) },
    },
    yAxis: {
      type: 'value',
      name: '次',
      axisLabel: { fontSize: 10 },
      splitLine: { lineStyle: { type: 'dashed' } },
    },
    series: [
      {
        type: 'bar',
        data: c.series[0].data,
        itemStyle: { color: '#30d158', borderRadius: [4, 4, 0, 0] },
        barWidth: '60%',
      },
    ],
  };
});

onMounted(loadAll);
watch([range, startDate, endDate], loadAll);
</script>

<template>
  <div>
    <AppHeader title="统计" subtitle="宝宝成长趋势" />

    <div class="px-5 mt-4 space-y-3">
      <!-- 范围选择 -->
      <div class="bg-ios-card rounded-3xl p-4 shadow-card">
        <TypeSegment v-model="range" :options="rangeOptions" />
        <div v-if="range === 'custom'" class="mt-3 flex items-center gap-2">
          <NDatePicker v-model:value="startDate" type="date" class="flex-1" />
          <span class="text-ios-secondary text-sm">至</span>
          <NDatePicker v-model:value="endDate" type="date" class="flex-1" />
        </div>
      </div>

      <div v-if="loading" class="text-center py-10 text-ios-secondary text-sm">加载中…</div>

      <template v-else>
        <!-- 喂养趋势 -->
        <div class="bg-ios-card rounded-3xl p-4 shadow-card">
          <h3 class="text-sm font-semibold text-ios-label mb-2">🍼 喂养趋势</h3>
          <VChart v-if="feedingOption" :option="feedingOption" autoresize style="height: 200px" />
          <p v-else class="text-center text-xs text-ios-secondary py-10">暂无数据</p>
        </div>

        <!-- 睡眠趋势 -->
        <div class="bg-ios-card rounded-3xl p-4 shadow-card">
          <h3 class="text-sm font-semibold text-ios-label mb-2">😴 睡眠趋势</h3>
          <VChart v-if="sleepOption" :option="sleepOption" autoresize style="height: 200px" />
          <p v-else class="text-center text-xs text-ios-secondary py-10">暂无数据</p>
        </div>

        <!-- 纸尿裤趋势 -->
        <div class="bg-ios-card rounded-3xl p-4 shadow-card">
          <h3 class="text-sm font-semibold text-ios-label mb-2">🧷 纸尿裤趋势</h3>
          <VChart v-if="diaperOption" :option="diaperOption" autoresize style="height: 200px" />
          <p v-else class="text-center text-xs text-ios-secondary py-10">暂无数据</p>
        </div>

        <!-- 补剂趋势 -->
        <div class="bg-ios-card rounded-3xl p-4 shadow-card">
          <h3 class="text-sm font-semibold text-ios-label mb-2">💊 补剂趋势</h3>
          <VChart v-if="supplementTrendOption" :option="supplementTrendOption" autoresize style="height: 200px" />
          <p v-else class="text-center text-xs text-ios-secondary py-10">暂无数据</p>
        </div>

        <!-- 补剂统计 -->
        <div class="bg-ios-card rounded-3xl p-4 shadow-card">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold text-ios-label">💊 补剂统计</h3>
            <span v-if="supplementStats" class="num-display text-lg font-bold text-ios-green">
              {{ supplementStats.count }}<span class="text-xs text-ios-secondary font-normal ml-1">次</span>
            </span>
          </div>
          <VChart v-if="supplementOption" :option="supplementOption" autoresize style="height: 200px" />
          <p v-else class="text-center text-xs text-ios-secondary py-10">暂无数据</p>
        </div>
      </template>
    </div>
  </div>
</template>
