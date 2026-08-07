<script setup lang="ts">
import { NDatePicker } from 'naive-ui';
import { disableFutureTime, isFutureDate } from '@/utils/date-picker';

withDefaults(defineProps<{ modelValue: number | null; clearable?: boolean }>(), {
  clearable: false,
});
defineEmits<{ 'update:modelValue': [value: number | null] }>();

const minute = 60 * 1000;
const shortcuts = {
  现在: () => Date.now(),
  '5 分钟前': () => Date.now() - 5 * minute,
  '10 分钟前': () => Date.now() - 10 * minute,
  '30 分钟前': () => Date.now() - 30 * minute,
};
</script>

<template>
  <NDatePicker
    :value="modelValue"
    type="datetime"
    format="yyyy-MM-dd HH:mm"
    :time-picker-props="{ format: 'HH:mm' }"
    :is-date-disabled="isFutureDate"
    :is-time-disabled="disableFutureTime"
    :clearable="clearable"
    :shortcuts="shortcuts"
    :actions="['confirm']"
    update-value-on-close
    @update:value="$emit('update:modelValue', $event)"
  />
</template>
