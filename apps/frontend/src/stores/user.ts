import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { userApi } from '@/api/user';
import type { UserVo, CurrentUser } from '@baby-record/shared';

const CURRENT_USER_KEY = 'baby-record:currentUser';

export const useUserStore = defineStore('user', () => {
  const users = ref<UserVo[]>([]);
  const currentUser = ref<CurrentUser | null>(null);

  const hasIdentity = computed(() => currentUser.value !== null);

  /** 从 localStorage 恢复身份（刷新后） */
  function loadFromStorage() {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      try {
        currentUser.value = JSON.parse(raw) as CurrentUser;
      } catch {
        currentUser.value = null;
      }
    }
  }

  async function loadUsers() {
    users.value = await userApi.list();
  }

  function selectUser(u: UserVo) {
    currentUser.value = { id: u.id, name: u.name, role: u.role };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser.value));
  }

  function clearUser() {
    currentUser.value = null;
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  return { users, currentUser, hasIdentity, loadFromStorage, loadUsers, selectUser, clearUser };
});
