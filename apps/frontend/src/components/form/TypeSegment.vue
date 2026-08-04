<script setup lang="ts" generic="T extends string">
defineProps<{
  modelValue: T;
  options: { label: string; value: T; icon?: string }[];
}>();

defineEmits<{ 'update:modelValue': [value: T] }>();
</script>

<template>
  <div class="bg-ios-fill/50 rounded-2xl p-1 flex gap-1">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1"
      :class="modelValue === opt.value ? 'bg-ios-card text-ios-label shadow-card' : 'text-ios-secondary'"
      @click="$emit('update:modelValue', opt.value)"
    >
      <span v-if="opt.icon">{{ opt.icon }}</span>
      <span>{{ opt.label }}</span>
    </button>
  </div>
</template>
