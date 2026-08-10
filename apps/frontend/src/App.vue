<script setup lang="ts">
import { computed } from 'vue';
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  zhCN,
  dateZhCN,
  darkTheme,
} from 'naive-ui';
import type { GlobalThemeOverrides } from 'naive-ui';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const theme = computed(() => (themeStore.isDark ? darkTheme : null));
const themeOverrides: GlobalThemeOverrides = {
  common: {
    fontFamily:
      "'Baby Latin Rounded', 'Noto Sans SC', 'Noto Sans CJK SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
  },
};
</script>

<template>
  <NConfigProvider
    :theme="theme"
    :theme-overrides="themeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <NMessageProvider>
      <NDialogProvider>
        <RouterView />
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
