import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/stores/user';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { tab: 'home' },
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('@/views/HistoryView.vue'),
        meta: { tab: 'home' },
      },
      {
        path: 'record',
        name: 'record',
        component: () => import('@/views/RecordView.vue'),
        meta: { tab: 'record' },
      },
      {
        path: 'record/feeding',
        name: 'record-feeding',
        component: () => import('@/views/record/FeedingRecordView.vue'),
        meta: { tab: 'record' },
      },
      {
        path: 'record/diaper',
        name: 'record-diaper',
        component: () => import('@/views/record/DiaperRecordView.vue'),
        meta: { tab: 'record' },
      },
      {
        path: 'record/sleep',
        name: 'record-sleep',
        component: () => import('@/views/record/SleepRecordView.vue'),
        meta: { tab: 'record' },
      },
      {
        path: 'record/activity',
        name: 'record-activity',
        component: () => import('@/views/record/ActivityRecordView.vue'),
        meta: { tab: 'record' },
      },
      {
        path: 'statistics',
        name: 'statistics',
        component: () => import('@/views/StatisticsView.vue'),
        meta: { tab: 'statistics' },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/ProfileView.vue'),
        meta: { tab: 'profile' },
      },
      {
        path: 'baby/new',
        name: 'baby-new',
        component: () => import('@/views/BabyFormView.vue'),
        meta: { tab: 'profile' },
      },
      {
        path: 'baby/edit',
        name: 'baby-edit',
        component: () => import('@/views/BabyFormView.vue'),
        meta: { tab: 'profile' },
      },
    ],
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('@/views/OnboardingView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// 首次进入身份选择守卫
router.beforeEach((to) => {
  const userStore = useUserStore();
  if (!userStore.hasIdentity && to.name !== 'onboarding') {
    return { name: 'onboarding' };
  }
  if (userStore.hasIdentity && to.name === 'onboarding') {
    return { name: 'dashboard' };
  }
  return true;
});

export default router;
