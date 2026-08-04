<script setup lang="ts" generic="T extends string">
defineProps<{
  modelValue: T;
  options: { label: string; value: T; icon: string }[];
  activeColor?: string;
}>();

defineEmits<{ 'update:modelValue': [value: T] }>();
</script>

<template>
  <div class="grid grid-cols-3 gap-2">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="py-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all duration-200"
      :class="
        modelValue === opt.value
          ? (activeColor || 'bg-ios-blue text-white shadow-card')
          : 'bg-ios-fill/50 text-ios-secondary'
      "
      @click="$emit('update:modelValue', opt.value)"
    >
      <span class="text-2xl">{{ opt.icon }}</span>
      <span class="text-xs font-medium">{{ opt.label }}</span>
    </button>
  </div>
</template>
