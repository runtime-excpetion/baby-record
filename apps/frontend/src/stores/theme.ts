import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export type ThemeMode = 'light' | 'dark' | 'auto';

const THEME_KEY = 'baby-record:theme';

export const useThemeStore = defineStore('theme', () => {
  const saved = (typeof localStorage !== 'undefined' && localStorage.getItem(THEME_KEY)) as ThemeMode | null;
  const mode = ref<ThemeMode>(saved || 'auto');
  const systemDark = ref(
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false,
  );

  const isDark = computed(
    () => mode.value === 'dark' || (mode.value === 'auto' && systemDark.value),
  );

  function apply() {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', isDark.value);
  }

  function setMode(m: ThemeMode) {
    mode.value = m;
    localStorage.setItem(THEME_KEY, m);
    apply();
  }

  // 监听系统主题变化（auto 模式下跟随）
  if (typeof window !== 'undefined' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      systemDark.value = e.matches;
      if (mode.value === 'auto') apply();
    });
  }

  watch(isDark, apply);

  return { mode, isDark, setMode, apply };
});
