<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const password = ref('');
const error = ref('');
const submitting = ref(false);

async function submit() {
  if (!password.value) {
    error.value = '请输入访问密码';
    return;
  }
  submitting.value = true;
  error.value = '';
  try {
    await authStore.login(password.value);
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
      ? route.query.redirect
      : userStore.hasIdentity ? '/' : '/onboarding';
    await router.replace(redirect);
  } catch (cause: any) {
    error.value = cause?.response?.data?.message || '登录失败，请稍后重试';
    password.value = '';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen w-full bg-shell flex justify-center">
    <main class="w-full max-w-app min-h-screen bg-ios-bg flex flex-col justify-center px-8 safe-top safe-bottom">
      <div class="animate-fade-in">
        <div class="w-20 h-20 mx-auto rounded-[28px] bg-gradient-to-br from-ios-blue to-ios-teal flex items-center justify-center text-5xl shadow-soft">
          👶
        </div>
        <div class="text-center mt-6">
          <h1 class="text-2xl font-bold text-ios-label">宝宝成长记录</h1>
          <p class="text-sm text-ios-secondary mt-2">请输入家庭访问密码以查看宝宝数据</p>
        </div>

        <form class="mt-8" @submit.prevent="submit">
          <label for="password" class="block text-sm font-medium text-ios-secondary mb-2 px-1">访问密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            autofocus
            class="w-full h-14 px-5 rounded-2xl bg-ios-card text-ios-label shadow-card outline-none border border-transparent focus:border-ios-blue transition"
            placeholder="请输入密码"
            @input="error = ''"
          />
          <p v-if="error" class="text-sm text-ios-pink mt-2 px-1" role="alert">{{ error }}</p>
          <button
            type="submit"
            class="w-full h-14 mt-5 rounded-2xl bg-ios-blue text-white font-semibold shadow-soft active:scale-[0.98] transition disabled:opacity-60"
            :disabled="submitting"
          >
            {{ submitting ? '正在验证…' : '进入系统' }}
          </button>
        </form>
        <p class="text-xs text-ios-secondary text-center mt-5">登录状态会在有效期内安全保留</p>
      </div>
    </main>
  </div>
</template>
