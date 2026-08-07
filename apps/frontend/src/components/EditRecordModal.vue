<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useMessage } from 'naive-ui';
import { NInput, NInputNumber } from 'naive-ui';
import IconPicker from '@/components/form/IconPicker.vue';
import DateTimePicker from '@/components/form/DateTimePicker.vue';
import WheelPicker from '@/components/form/WheelPicker.vue';
import { feedingApi } from '@/api/feeding';
import { diaperApi } from '@/api/diaper';
import { sleepApi } from '@/api/sleep';
import { supplementApi } from '@/api/supplement';
import { activityApi } from '@/api/activity';
import { temperatureApi } from '@/api/temperature';
import {
  FEEDING_TYPE_LABELS,
  DIAPER_TYPE_LABELS,
  ALL_FEEDING_TYPES,
  ALL_DIAPER_TYPES,
  type FeedingType,
  type DiaperType,
} from '@baby-record/shared';
import type { TimelineEntry } from '@/types/timeline';

const props = defineProps<{ entry: TimelineEntry | null }>();
const emit = defineEmits<{ close: []; saved: [] }>();
const message = useMessage();

const time = ref(0);
const sleepStart = ref(0);
const sleepEnd = ref<number | null>(null);
const remark = ref('');
const feedingType = ref<FeedingType>('FORMULA');
const amountMl = ref(120);
const diaperType = ref<DiaperType>('BOTH');
const supplementName = ref('');
const amount = ref('');
const unit = ref('');
const eventType = ref('');
const description = ref('');
const temperature = ref(36.5);
const submitting = ref(false);

const feedingTypeOptions = ALL_FEEDING_TYPES.map((v) => ({
  label: FEEDING_TYPE_LABELS[v],
  value: v,
  icon: v === 'BREAST_MILK' ? '🤱' : v === 'FORMULA' ? '🍼' : '🤱🍼',
}));
const diaperTypeOptions = ALL_DIAPER_TYPES.map((v) => ({
  label: DIAPER_TYPE_LABELS[v],
  value: v,
  icon: v === 'PEE' ? '💧' : v === 'POOP' ? '💩' : '💧💩',
}));

const titleMap: Record<TimelineEntry['type'], string> = {
  feeding: '喂养',
  diaper: '纸尿裤',
  sleep: '睡眠',
  supplement: '补剂',
  activity: '事件',
  temperature: '体温',
};
const entryTitle = computed(() => (props.entry ? titleMap[props.entry.type] : ''));

function iso(ts: number) {
  return new Date(ts).toISOString();
}

watch(
  () => props.entry,
  (e) => {
    if (!e) return;
    remark.value = '';
    const r = e.raw as unknown as Record<string, unknown>;
    if (e.type === 'feeding') {
      time.value = new Date(r.feedingTime as string).getTime();
      feedingType.value = r.feedingType as FeedingType;
      amountMl.value = (r.amountMl as number | null) ?? 120;
      remark.value = (r.remark as string) || '';
    } else if (e.type === 'diaper') {
      time.value = new Date(r.changeTime as string).getTime();
      diaperType.value = r.type as DiaperType;
      remark.value = (r.remark as string) || '';
    } else if (e.type === 'sleep') {
      sleepStart.value = new Date(r.startTime as string).getTime();
      sleepEnd.value = r.endTime ? new Date(r.endTime as string).getTime() : null;
      remark.value = (r.remark as string) || '';
    } else if (e.type === 'supplement') {
      time.value = new Date(r.takeTime as string).getTime();
      supplementName.value = r.name as string;
      amount.value = (r.amount as string) || '';
      unit.value = (r.unit as string) || '';
      remark.value = (r.remark as string) || '';
    } else if (e.type === 'activity') {
      time.value = new Date(r.eventTime as string).getTime();
      eventType.value = r.eventType as string;
      description.value = (r.description as string) || '';
      remark.value = (r.remark as string) || '';
    } else if (e.type === 'temperature') {
      time.value = new Date(r.measureTime as string).getTime();
      temperature.value = Number(r.temperature);
      remark.value = (r.remark as string) || '';
    }
  },
  { immediate: true },
);

async function onSave() {
  if (!props.entry) return;
  const e = props.entry;
  const r = e.raw as unknown as Record<string, unknown> & { id: number };
  submitting.value = true;
  try {
    if (e.type === 'feeding') {
      await feedingApi.update(r.id, {
        feedingTime: iso(time.value),
        feedingType: feedingType.value,
        amountMl: amountMl.value,
        remark: remark.value || undefined,
      });
    } else if (e.type === 'diaper') {
      await diaperApi.update(r.id, {
        changeTime: iso(time.value),
        type: diaperType.value,
        remark: remark.value || undefined,
      });
    } else if (e.type === 'sleep') {
      await sleepApi.update(r.id, {
        startTime: iso(sleepStart.value),
        endTime: sleepEnd.value ? iso(sleepEnd.value) : undefined,
        remark: remark.value || undefined,
      });
    } else if (e.type === 'supplement') {
      await supplementApi.update(r.id, {
        name: supplementName.value,
        amount: amount.value || undefined,
        unit: unit.value || undefined,
        takeTime: iso(time.value),
        remark: remark.value || undefined,
      });
    } else if (e.type === 'activity') {
      await activityApi.update(r.id, {
        eventType: eventType.value,
        eventTime: iso(time.value),
        description: description.value || undefined,
        remark: remark.value || undefined,
      });
    } else if (e.type === 'temperature') {
      await temperatureApi.update(r.id, { temperature: temperature.value, measureTime: iso(time.value), remark: remark.value || undefined });
    }
    message.success('已更新');
    emit('saved');
  } catch {
    // 错误已由拦截器提示
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="entry" class="fixed inset-0 z-50 flex items-end justify-center">
      <div class="absolute inset-0 bg-black/40" @click="emit('close')" />
      <div
        class="relative w-full max-w-app bg-ios-bg rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto no-scrollbar animate-slide-up safe-bottom"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-ios-label">编辑{{ entryTitle }}</h3>
          <button class="text-ios-secondary text-sm" @click="emit('close')">关闭</button>
        </div>

        <div class="space-y-3">
          <div v-if="entry.type !== 'sleep'" class="bg-ios-card rounded-3xl p-4 shadow-card">
            <label class="text-sm font-medium text-ios-secondary">时间</label>
            <DateTimePicker v-model="time" class="mt-2 w-full" />
          </div>

          <template v-if="entry.type === 'sleep'">
            <div class="bg-ios-card rounded-3xl p-4 shadow-card">
              <label class="text-sm font-medium text-ios-secondary">开始时间</label>
              <DateTimePicker v-model="sleepStart" class="mt-2 w-full" />
            </div>
            <div class="bg-ios-card rounded-3xl p-4 shadow-card">
              <label class="text-sm font-medium text-ios-secondary">结束时间</label>
              <DateTimePicker v-model="sleepEnd" clearable class="mt-2 w-full" />
              <p class="text-xs text-ios-secondary mt-1">不填表示睡眠中</p>
            </div>
          </template>

          <template v-if="entry.type === 'feeding'">
            <div class="bg-ios-card rounded-3xl p-4 shadow-card">
              <label class="text-sm font-medium text-ios-secondary">类型</label>
              <IconPicker v-model="feedingType" :options="feedingTypeOptions" active-color="bg-ios-orange" class="mt-3" />
            </div>
            <div class="bg-ios-card rounded-3xl p-4 shadow-card grid grid-cols-4 gap-2 items-center">
              <label class="text-sm font-medium text-ios-secondary col-span-1">奶量</label>
              <WheelPicker v-model="amountMl" :options="Array.from({ length: 31 }, (_, i) => ({ label: `${i * 10} ml`, value: i * 10 }))" class="col-span-2" />
              <span class="text-sm text-ios-secondary text-center">ml</span>
            </div>
          </template>

          <div v-if="entry.type === 'temperature'" class="bg-ios-card rounded-3xl p-4 shadow-card">
            <label class="text-sm font-medium text-ios-secondary">体温</label>
            <WheelPicker v-model="temperature" :options="Array.from({ length: 51 }, (_, i) => ({ label: `${(36 + i / 10).toFixed(1)}℃`, value: 36 + i / 10 }))" class="mt-2" />
          </div>

          <div v-if="entry.type === 'diaper'" class="bg-ios-card rounded-3xl p-4 shadow-card">
            <label class="text-sm font-medium text-ios-secondary">类型</label>
            <IconPicker v-model="diaperType" :options="diaperTypeOptions" active-color="bg-ios-blue" class="mt-3" />
          </div>

          <template v-if="entry.type === 'supplement'">
            <div class="bg-ios-card rounded-3xl p-4 shadow-card">
              <label class="text-sm font-medium text-ios-secondary">名称</label>
              <NInput v-model:value="supplementName" class="mt-2" />
            </div>
            <div class="bg-ios-card rounded-3xl p-4 shadow-card grid grid-cols-3 gap-2">
              <WheelPicker v-model="amount" :options="Array.from({ length: 11 }, (_, value) => ({ label: String(value), value: String(value) }))" class="col-span-2" />
              <NInput v-model:value="unit" placeholder="单位" />
            </div>
          </template>

          <template v-if="entry.type === 'activity'">
            <div class="bg-ios-card rounded-3xl p-4 shadow-card">
              <label class="text-sm font-medium text-ios-secondary">事件类型</label>
              <NInput v-model:value="eventType" class="mt-2" />
            </div>
            <div class="bg-ios-card rounded-3xl p-4 shadow-card">
              <label class="text-sm font-medium text-ios-secondary">描述</label>
              <NInput v-model:value="description" type="textarea" :autosize="{ minRows: 2 }" class="mt-2" />
            </div>
          </template>

          <div class="bg-ios-card rounded-3xl p-4 shadow-card">
            <label class="text-sm font-medium text-ios-secondary">备注</label>
            <NInput v-model:value="remark" type="textarea" :autosize="{ minRows: 2 }" class="mt-2" />
          </div>

          <button
            class="w-full py-3.5 rounded-2xl bg-ios-blue text-white font-semibold active:scale-95 transition-transform disabled:opacity-60"
            :disabled="submitting"
            @click="onSave"
          >
            {{ submitting ? '保存中…' : '保存修改' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
