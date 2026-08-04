<script setup lang="ts" generic="T extends string | number">
import { computed } from 'vue';

const props = defineProps<{ modelValue: T; options: { label: string; value: T; disabled?: boolean }[] }>();
const emit = defineEmits<{ 'update:modelValue': [value: T] }>();
const selected = computed(() => String(props.modelValue));
function change(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  const option = props.options.find((item) => String(item.value) === value);
  if (option) emit('update:modelValue', option.value);
}
</script>

<template>
  <div class="relative rounded-2xl overflow-hidden bg-ios-fill/50">
    <select
      :value="selected"
      class="wheel-picker w-full h-12 px-4 bg-transparent text-center text-lg font-semibold text-ios-label outline-none"
      @change="change"
    >
      <option v-for="option in options" :key="String(option.value)" :value="String(option.value)" :disabled="option.disabled">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.wheel-picker { appearance: auto; }
</style>
