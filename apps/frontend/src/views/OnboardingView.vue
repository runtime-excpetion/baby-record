<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useBabyStore } from '@/stores/baby';
import { ALL_USER_ROLES, USER_ROLE_LABELS, type UserRole } from '@baby-record/shared';

const router = useRouter();
const userStore = useUserStore();
const babyStore = useBabyStore();
const loading = ref(false);

const roleEmoji: Record<UserRole, string> = {
  DAD: '👨',
  MOM: '👩',
  GRANDPA_P: '👴',
  GRANDMA_P: '👵',
  GRANDMA_M: '👵',
  GRANDPA_M: '👴',
};

onMounted(async () => {
  try {
    await userStore.loadUsers();
  } catch {
    // 后端未启动时允许选择（仍可进入，后续记录时再校验）
  }
});

async function onSelect(role: UserRole) {
  const u = userStore.users.find((x) => x.role === role);
  if (!u) {
    // 后端无该身份用户时，先创建
    loading.value = true;
    try {
      const created = await import('@/api/user').then((m) =>
        m.userApi.create({ name: USER_ROLE_LABELS[role], role }),
      );
      userStore.selectUser(created);
    } finally {
      loading.value = false;
    }
  } else {
    userStore.selectUser(u);
  }

  loading.value = true;
  try {
    await babyStore.loadBabies();
  } finally {
    loading.value = false;
    router.push('/');
  }
}
</script>

<template>
  <div class="min-h-screen w-full bg-shell flex justify-center">
    <div class="w-full max-w-app min-h-screen bg-ios-bg px-6 flex flex-col safe-top">
      <div class="pt-20 pb-8 text-center">
        <div class="text-6xl mb-4">👶</div>
        <h1 class="text-2xl font-bold text-ios-label">欢迎使用宝宝成长记录</h1>
        <p class="text-sm text-ios-secondary mt-2">请选择你的身份，便于记录每一条成长</p>
      </div>

      <div class="grid grid-cols-2 gap-3 mt-2">
        <button
          v-for="role in ALL_USER_ROLES"
          :key="role"
          class="bg-ios-card rounded-3xl py-7 flex flex-col items-center gap-2 shadow-card active:scale-95 transition-transform disabled:opacity-60"
          :disabled="loading"
          @click="onSelect(role)"
        >
          <span class="text-4xl">{{ roleEmoji[role] }}</span>
          <span class="text-base font-medium text-ios-label">{{ USER_ROLE_LABELS[role] }}</span>
        </button>
      </div>

      <p v-if="loading" class="text-center text-sm text-ios-secondary mt-8">正在进入...</p>
    </div>
  </div>
</template>
