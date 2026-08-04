<script setup lang="ts">
import { NDatePicker } from 'naive-ui';

defineProps<{ modelValue: number }>();
defineEmits<{ 'update:modelValue': [value: number] }>();
</script>

<template>
  <NDatePicker
    :value="modelValue"
    type="datetime"
    format="yyyy-MM-dd HH:mm"
    :time-picker-props="{ format: 'HH:mm' }"
    @update:value="$emit('update:modelValue', $event)"
  />
</template>
