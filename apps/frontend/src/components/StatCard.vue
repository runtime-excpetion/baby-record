<script setup lang="ts">
withDefaults(defineProps<{
  title: string;
  value: string;
  sub?: string;
  icon: string;
  accent?: string;
  actionLabel?: string;
  actionClass?: string;
}>(), {
  actionLabel: '',
  actionClass: 'text-ios-blue',
});

defineEmits<{
  action: [];
}>();
</script>

<template>
  <div class="bg-ios-card rounded-3xl p-5 shadow-card animate-slide-up">
    <div class="flex items-center gap-2">
      <div class="flex flex-1 items-center gap-2">
        <span class="text-xl">{{ icon }}</span>
        <span class="text-sm font-medium text-ios-secondary">{{ title }}</span>
      </div>
      <button
        v-if="actionLabel"
        type="button"
        class="text-sm font-medium active:opacity-60"
        :class="actionClass"
        @click="$emit('action')"
      >
        {{ actionLabel }}
      </button>
    </div>
    <div class="mt-3 num-display text-3xl font-bold" :class="accent || 'text-ios-label'">
      <slot name="value">{{ value }}</slot>
    </div>
    <div v-if="sub || $slots.sub" class="mt-1.5 text-xs text-ios-secondary">
      <slot name="sub">{{ sub }}</slot>
    </div>
  </div>
</template>
