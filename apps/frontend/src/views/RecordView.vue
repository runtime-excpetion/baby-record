<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { NDatePicker } from 'naive-ui';
import AppHeader from '@/components/AppHeader.vue';
import EditRecordModal from '@/components/EditRecordModal.vue';
import { recordApi } from '@/api/record';
import { useBabyStore } from '@/stores/baby';
import { fmtDate, fmtDateTime, minutesToText } from '@/utils/format';
import {
  FEEDING_TYPE_LABELS,
  DIAPER_TYPE_LABELS,
  SLEEP_TYPE_LABELS,
  type DailyRecords,
} from '@baby-record/shared';
import type { TimelineEntry } from '@/types/timeline';

const router = useRouter();
const babyStore = useBabyStore();
const loading = ref(false);
const entries = ref<TimelineEntry[]>([]);
const editingEntry = ref<TimelineEntry | null>(null);

type FilterType = 'all' | 'feeding' | 'diaper' | 'sleep' | 'supplement' | 'activity';
const filterType = ref<FilterType>('all');
const startDate = ref(Date.now() - 29 * 86400000);
const endDate = ref(Date.now());

const filterOptions: { label: string; value: FilterType; icon: string }[] = [
  { label: '全部', value: 'all', icon: '📋' },
  { label: '喂养', value: 'feeding', icon: '🍼' },
  { label: '纸尿裤', value: 'diaper', icon: '🧷' },
  { label: '睡眠', value: 'sleep', icon: '😴' },
  { label: '补剂', value: 'supplement', icon: '💊' },
  { label: '成长', value: 'activity', icon: '✨' },
];

const quickActions = [
  { icon: '🍚', label: '喂养', to: '/record/feeding' },
  { icon: '🧷', label: '纸尿裤', to: '/record/diaper' },
  { icon: '😴', label: '睡觉', to: '/record/sleep' },
  { icon: '✨', label: '其他', to: '/record/activity' },
];

function buildEntries(d: DailyRecords): TimelineEntry[] {
  const arr: TimelineEntry[] = [];
  d.feeding.forEach((f) =>
    arr.push({
      type: 'feeding',
      raw: f,
      time: f.feedingTime,
      icon: '🍼',
      title: '喂养',
      detail:
        FEEDING_TYPE_LABELS[f.feedingType] +
        (f.amountMl ? ` · ${f.amountMl}ml` : '') +
        (f.remark ? ` · ${f.remark}` : ''),
      colorClass: 'bg-ios-orange',
    }),
  );
  d.diaper.forEach((x) =>
    arr.push({
      type: 'diaper',
      raw: x,
      time: x.changeTime,
      icon: '🧷',
      title: '纸尿裤',
      detail: DIAPER_TYPE_LABELS[x.type] + (x.remark ? ` · ${x.remark}` : ''),
      colorClass: 'bg-ios-blue',
    }),
  );
  d.sleep.forEach((s) =>
    arr.push({
      type: 'sleep',
      raw: s,
      time: s.startTime,
      icon: '😴',
      title: '睡眠',
      detail:
        SLEEP_TYPE_LABELS[s.sleepType] +
        ' · ' +
        (s.ongoing ? '睡眠中' : minutesToText(s.durationMinutes ?? 0)),
      colorClass: 'bg-ios-purple',
    }),
  );
  d.supplement.forEach((s) =>
    arr.push({
      type: 'supplement',
      raw: s,
      time: s.takeTime,
      icon: '💊',
      title: '补剂',
      detail: s.name + (s.amount ? ` · ${s.amount}${s.unit || ''}` : ''),
      colorClass: 'bg-ios-green',
    }),
  );
  d.activity.forEach((a) =>
    arr.push({
      type: 'activity',
      raw: a,
      time: a.eventTime,
      icon: '✨',
      title: a.eventType,
      detail: a.description || '',
      colorClass: 'bg-ios-teal',
    }),
  );
  // 按创建时间倒序
  return arr.sort(
    (a, b) =>
      new Date((b.raw as unknown as { createdTime: string }).createdTime).getTime() -
      new Date((a.raw as unknown as { createdTime: string }).createdTime).getTime(),
  );
}

const filtered = computed(() => {
  if (filterType.value === 'all') return entries.value;
  return entries.value.filter((e) => e.type === filterType.value);
});

async function load() {
  const baby = babyStore.currentBaby;
  if (!baby) return;
  loading.value = true;
  try {
    const data = await recordApi.range(baby.id, fmtDate(startDate.value), fmtDate(endDate.value));
    entries.value = buildEntries(data);
  } finally {
    loading.value = false;
  }
}

function onSaved() {
  editingEntry.value = null;
  load();
}

onMounted(load);
watch([startDate, endDate], load);
</script>

<template>
  <div>
    <AppHeader title="记录" subtitle="查看与修改所有记录" />

    <div class="px-5 mt-4 space-y-3">
      <!-- 快速新增 -->
      <div class="flex gap-2">
        <button
          v-for="a in quickActions"
          :key="a.label"
          class="flex-1 py-2.5 rounded-2xl bg-ios-card shadow-card flex flex-col items-center gap-0.5 active:scale-95 transition-transform"
          @click="router.push(a.to)"
        >
          <span class="text-xl">{{ a.icon }}</span>
          <span class="text-xs text-ios-label">{{ a.label }}</span>
        </button>
      </div>

      <!-- 类型筛选 -->
      <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          v-for="opt in filterOptions"
          :key="opt.value"
          class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition"
          :class="
            filterType === opt.value
              ? 'bg-ios-blue text-white'
              : 'bg-ios-card text-ios-secondary shadow-card'
          "
          @click="filterType = opt.value"
        >
          {{ opt.icon }} {{ opt.label }}
        </button>
      </div>

      <!-- 时间筛选 -->
      <div class="bg-ios-card rounded-3xl p-3 shadow-card flex items-center gap-2">
        <NDatePicker v-model:value="startDate" type="date" size="small" class="flex-1" />
        <span class="text-ios-secondary text-xs">至</span>
        <NDatePicker v-model:value="endDate" type="date" size="small" class="flex-1" />
      </div>

      <!-- 列表 -->
      <div v-if="loading" class="text-center py-12 text-ios-secondary text-sm">加载中…</div>

      <div v-else-if="!filtered.length" class="flex flex-col items-center py-16 text-center">
        <div class="text-4xl mb-2">📭</div>
        <p class="text-sm text-ios-secondary">该范围内暂无记录</p>
      </div>

      <div v-else class="space-y-2">
        <button
          v-for="(it, i) in filtered"
          :key="it.time + '-' + i"
          class="w-full bg-ios-card rounded-2xl p-3.5 shadow-card flex items-center gap-3 active:scale-[0.98] transition-transform text-left"
          @click="editingEntry = it"
        >
          <span class="w-9 h-9 rounded-full bg-ios-fill/50 flex items-center justify-center text-lg shrink-0">
            {{ it.icon }}
          </span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-ios-label">{{ it.title }}</span>
              <span class="text-xs text-ios-secondary num-display">{{ fmtDateTime(it.time) }}</span>
            </div>
            <p class="text-xs text-ios-secondary mt-0.5 truncate">{{ it.detail || '—' }}</p>
          </div>
          <span class="text-ios-secondary text-lg shrink-0">›</span>
        </button>
      </div>
    </div>

    <EditRecordModal :entry="editingEntry" @close="editingEntry = null" @saved="onSaved" />
  </div>
</template>
