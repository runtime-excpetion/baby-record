<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = withDefaults(defineProps<{ modelValue: number | null; clearable?: boolean }>(), {
  clearable: false,
});
const emit = defineEmits<{ 'update:modelValue': [value: number | null] }>();

const minute = 60 * 1000;
const now = ref(Date.now());
let clockTimer: ReturnType<typeof setInterval> | undefined;
const shortcuts = [
  { label: '现在', offset: 0 },
  { label: '5 分钟前', offset: 5 * minute },
  { label: '10 分钟前', offset: 10 * minute },
  { label: '30 分钟前', offset: 30 * minute },
];

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function formatDate(timestamp: number) {
  const value = new Date(timestamp);
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
}

function formatTime(timestamp: number) {
  const value = new Date(timestamp);
  return `${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

const dateValue = computed(() => (props.modelValue === null ? '' : formatDate(props.modelValue)));
const timeValue = computed(() => (props.modelValue === null ? '' : formatTime(props.modelValue)));
const today = computed(() => formatDate(now.value));
const latestTime = computed(() => (dateValue.value === today.value ? formatTime(now.value) : undefined));

onMounted(() => {
  clockTimer = setInterval(() => {
    now.value = Date.now();
  }, minute);
});

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer);
});

function baseDate() {
  return new Date(props.modelValue ?? Date.now());
}

function emitSafeTimestamp(value: Date) {
  const timestamp = value.getTime();
  emit('update:modelValue', Math.min(timestamp, Date.now()));
}

function updateDate(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  if (!value) {
    if (props.clearable) emit('update:modelValue', null);
    return;
  }

  const [year, month, day] = value.split('-').map(Number);
  const next = baseDate();
  next.setFullYear(year, month - 1, day);
  emitSafeTimestamp(next);
}

function updateTime(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  if (!value) {
    if (props.clearable) emit('update:modelValue', null);
    return;
  }

  const [hour, minuteValue] = value.split(':').map(Number);
  const next = baseDate();
  next.setHours(hour, minuteValue, 0, 0);
  emitSafeTimestamp(next);
}

function useShortcut(offset: number) {
  emit('update:modelValue', Date.now() - offset);
}
</script>

<template>
  <div class="space-y-2">
    <div class="grid grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] gap-3">
      <label class="min-w-0">
        <span class="mb-1 block text-xs text-gray-500">日期</span>
        <span class="date-time-field">
          <input
            class="date-time-input"
            type="date"
            :value="dateValue"
            :max="today"
            aria-label="日期"
            @change="updateDate"
          />
        </span>
      </label>
      <label class="min-w-0">
        <span class="mb-1 block text-xs text-gray-500">时间</span>
        <span class="date-time-field">
          <input
            class="date-time-input"
            type="time"
            :value="timeValue"
            :max="latestTime"
            step="60"
            aria-label="时间"
            @change="updateTime"
          />
        </span>
      </label>
    </div>

    <div class="grid grid-cols-4 gap-2" aria-label="快捷时间">
      <button
        v-for="shortcut in shortcuts"
        :key="shortcut.label"
        type="button"
        class="h-10 rounded-xl bg-gray-100 px-1 text-xs font-medium text-gray-600 transition active:scale-95 active:bg-gray-200"
        @click="useShortcut(shortcut.offset)"
      >
        {{ shortcut.label }}
      </button>
    </div>

    <button
      v-if="clearable && modelValue !== null"
      type="button"
      class="text-xs text-gray-400"
      @click="emit('update:modelValue', null)"
    >
      清除时间
    </button>
  </div>
</template>

<style scoped>
.date-time-field {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  --dt-height: 44px;
  height: var(--dt-height);
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  color: #1f2937;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.date-time-field:focus-within {
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgb(34 197 94 / 12%);
}

.date-time-input {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 16px;
  line-height: var(--dt-height);
  font-variant-numeric: tabular-nums;
  outline: none;
}

/* iOS 上原生日期/时间输入框的值区域：左对齐并纵向撑满容器，配合 line-height 使文字垂直居中 */
.date-time-input::-webkit-date-and-time-value {
  text-align: left;
  min-height: var(--dt-height);
}
</style>
