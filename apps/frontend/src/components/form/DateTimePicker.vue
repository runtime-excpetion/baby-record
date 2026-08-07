<script setup lang="ts">
import { NDatePicker } from 'naive-ui';
import { disableFutureTime, isFutureDate } from '@/utils/date-picker';

withDefaults(defineProps<{ modelValue: number | null; clearable?: boolean }>(), {
  clearable: false,
});
defineEmits<{ 'update:modelValue': [value: number | null] }>();
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
    @update:value="$emit('update:modelValue', $event)"
  />
</template>
