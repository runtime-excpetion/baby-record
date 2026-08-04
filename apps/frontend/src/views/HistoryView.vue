<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { NDatePicker, useDialog, useMessage } from 'naive-ui';
import AppHeader from '@/components/AppHeader.vue';
import EditRecordModal from '@/components/EditRecordModal.vue';
import { recordApi } from '@/api/record';
import { feedingApi } from '@/api/feeding';
import { diaperApi } from '@/api/diaper';
import { sleepApi } from '@/api/sleep';
import { supplementApi } from '@/api/supplement';
import { activityApi } from '@/api/activity';
import { useBabyStore } from '@/stores/baby';
import { fmtTime, fmtDate, minutesToText } from '@/utils/format';
import {
  FEEDING_TYPE_LABELS,
  DIAPER_TYPE_LABELS,
  SLEEP_TYPE_LABELS,
  type DailyRecords,
} from '@baby-record/shared';
import type { TimelineEntry } from '@/types/timeline';

const babyStore = useBabyStore();
const dialog = useDialog();
const message = useMessage();

const date = ref(Date.now());
const loading = ref(false);
const items = ref<TimelineEntry[]>([]);
const editingEntry = ref<TimelineEntry | null>(null);

function buildItems(d: DailyRecords): TimelineEntry[] {
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
      title: '换纸尿裤',
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
  return arr.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
}

async function load() {
  const baby = babyStore.currentBaby;
  if (!baby) return;
  loading.value = true;
  try {
    const data = await recordApi.daily(baby.id, fmtDate(date.value));
    items.value = buildItems(data);
  } finally {
    loading.value = false;
  }
}

async function removeEntry(e: TimelineEntry) {
  const r = e.raw as { id: number };
  dialog.warning({
    title: '删除记录',
    content: `确定删除这条「${e.title}」记录吗？`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        if (e.type === 'feeding') await feedingApi.remove(r.id);
        else if (e.type === 'diaper') await diaperApi.remove(r.id);
        else if (e.type === 'sleep') await sleepApi.remove(r.id);
        else if (e.type === 'supplement') await supplementApi.remove(r.id);
        else if (e.type === 'activity') await activityApi.remove(r.id);
        message.success('已删除');
        load();
      } catch {
        // 错误已由拦截器提示
      }
    },
  });
}

function isFuture(ts: number): boolean {
  return ts > Date.now();
}

onMounted(load);
watch(date, load);
</script>

<template>
  <div>
    <AppHeader title="历史记录" show-back />

    <div class="px-5 mt-4">
      <div class="bg-ios-card rounded-3xl p-4 shadow-card">
        <NDatePicker v-model:value="date" type="date" class="w-full" :is-date-disabled="isFuture" />
      </div>
    </div>

    <div class="px-5 mt-4">
      <div v-if="loading" class="text-center py-12 text-ios-secondary text-sm">加载中…</div>

      <div v-else-if="!items.length" class="flex flex-col items-center py-16 text-center">
        <div class="text-4xl mb-2">📭</div>
        <p class="text-sm text-ios-secondary">{{ fmtDate(date) }} 暂无记录</p>
      </div>

      <TransitionGroup v-else name="list" tag="div" class="relative pb-4">
        <div v-for="(it, i) in items" :key="it.time + '-' + i" class="flex gap-3">
          <div class="flex flex-col items-center w-12 shrink-0 pt-1">
            <span class="text-xs text-ios-secondary num-display">{{ fmtTime(it.time) }}</span>
            <span class="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" :class="it.colorClass"></span>
            <span v-if="i < items.length - 1" class="flex-1 w-px bg-ios-separator mt-1 mb-1"></span>
          </div>
          <div class="flex-1 bg-ios-card rounded-2xl p-3.5 shadow-card mb-3 animate-slide-up">
            <div class="flex items-center gap-2">
              <span class="text-lg">{{ it.icon }}</span>
              <span class="text-sm font-semibold text-ios-label flex-1">{{ it.title }}</span>
              <button class="text-xs text-ios-secondary px-1.5 active:opacity-60" @click="editingEntry = it">
                编辑
              </button>
              <button class="text-xs text-ios-pink px-1.5 active:opacity-60" @click="removeEntry(it)">
                删除
              </button>
            </div>
            <p v-if="it.detail" class="text-xs text-ios-secondary mt-1">{{ it.detail }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <EditRecordModal :entry="editingEntry" @close="editingEntry = null" @saved="editingEntry = null; load()" />
  </div>
</template>
