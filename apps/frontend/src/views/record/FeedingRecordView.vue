<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { NInputNumber, NInput } from 'naive-ui';
import AppHeader from '@/components/AppHeader.vue';
import DateTimePicker from '@/components/form/DateTimePicker.vue';
import IconPicker from '@/components/form/IconPicker.vue';
import { feedingApi } from '@/api/feeding';
import { useBabyStore } from '@/stores/baby';
import { useUserStore } from '@/stores/user';
import { useDashboardStore } from '@/stores/dashboard';
import { ALL_FEEDING_TYPES, FEEDING_TYPE_LABELS, type FeedingType } from '@baby-record/shared';

const router = useRouter();
const message = useMessage();
const babyStore = useBabyStore();
const userStore = useUserStore();
const dashStore = useDashboardStore();

const feedingType = ref<FeedingType>('FORMULA');
const time = ref(Date.now());
const amountMl = ref<number | null>(120);
const remark = ref('');
const submitting = ref(false);

const typeOptions = ALL_FEEDING_TYPES.map((v) => ({
  label: FEEDING_TYPE_LABELS[v],
  value: v,
  icon: v === 'BREAST_MILK' ? '🤱' : v === 'FORMULA' ? '🍼' : '🤱🍼',
}));

async function onSubmit() {
  const baby = babyStore.currentBaby;
  const user = userStore.currentUser;
  if (!baby || !user) {
    message.error('请先选择宝宝与身份');
    return;
  }
  submitting.value = true;
  try {
    await feedingApi.create({
      babyId: baby.id,
      feedingType: feedingType.value,
      feedingTime: new Date(time.value).toISOString(),
      amountMl: amountMl.value ?? undefined,
      remark: remark.value || undefined,
      creatorId: user.id,
    });
    message.success('喂养记录已保存');
    await dashStore.fetch(baby.id);
    router.push('/');
  } catch {
    // 错误已由 request 拦截器统一提示
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div>
    <AppHeader title="喂养记录" show-back />
    <div class="px-5 mt-4 space-y-3">
      <div class="bg-ios-card rounded-3xl p-4 shadow-card">
        <label class="text-sm font-medium text-ios-secondary">时间</label>
        <DateTimePicker v-model="time" class="mt-2 w-full" />
      </div>

      <div class="bg-ios-card rounded-3xl p-4 shadow-card">
        <label class="text-sm font-medium text-ios-secondary">类型</label>
        <IconPicker v-model="feedingType" :options="typeOptions" active-color="bg-ios-orange" class="mt-3" />
      </div>

      <div class="bg-ios-card rounded-3xl p-4 shadow-card">
        <label class="text-sm font-medium text-ios-secondary">奶量</label>
        <div class="mt-2 grid grid-cols-4 gap-2 items-center">
          <NInputNumber
            v-model:value="amountMl"
            :min="0"
            :max="500"
            :step="10"
            placeholder="输入奶量"
            class="col-span-3"
          />
          <span class="text-sm text-ios-secondary text-center">ml</span>
        </div>
      </div>

      <div class="bg-ios-card rounded-3xl p-4 shadow-card">
        <label class="text-sm font-medium text-ios-secondary">备注</label>
        <NInput
          v-model:value="remark"
          type="textarea"
          :autosize="{ minRows: 2 }"
          placeholder="选填"
          class="mt-2"
        />
      </div>

      <button
        class="w-full py-3.5 rounded-2xl bg-ios-orange text-white font-semibold active:scale-95 transition-transform duration-150 disabled:opacity-60"
        :disabled="submitting"
        @click="onSubmit"
      >
        {{ submitting ? '保存中…' : '保存记录' }}
      </button>
    </div>
  </div>
</template>
