<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { NInput } from 'naive-ui';
import AppHeader from '@/components/AppHeader.vue';
import TypeSegment from '@/components/form/TypeSegment.vue';
import DateTimePicker from '@/components/form/DateTimePicker.vue';
import { supplementApi } from '@/api/supplement';
import { activityApi } from '@/api/activity';
import { useBabyStore } from '@/stores/baby';
import { useUserStore } from '@/stores/user';

type Category = 'supplement' | 'play' | 'headup' | 'turn' | 'bath' | 'other';

const router = useRouter();
const message = useMessage();
const babyStore = useBabyStore();
const userStore = useUserStore();

const category = ref<Category>('supplement');
const categoryOptions: { label: string; value: Category; icon: string }[] = [
  { label: '补剂', value: 'supplement', icon: '💊' },
  { label: '玩耍', value: 'play', icon: '🎮' },
  { label: '抬头', value: 'headup', icon: '👶' },
  { label: '翻身', value: 'turn', icon: '🔄' },
  { label: '洗澡', value: 'bath', icon: '🛁' },
  { label: '其他', value: 'other', icon: '✨' },
];

const isSupplement = computed(() => category.value === 'supplement');

// 补剂表单
const supplementName = ref('维生素D');
const supplementNameOptions = ['维生素D', 'DHA', '钙', '其他'].map((v) => ({ label: v, value: v }));
const customName = ref('');
const amount = ref('');
const unit = ref('滴');
const supplementTime = ref(Date.now());

// 活动表单
const activityTime = ref(Date.now());
const description = ref('');

const activityEventLabel: Record<Exclude<Category, 'supplement'>, string> = {
  play: '玩耍',
  headup: '抬头',
  turn: '翻身',
  bath: '洗澡',
  other: '其他',
};

const submitting = ref(false);

async function onSubmit() {
  const baby = babyStore.currentBaby;
  const user = userStore.currentUser;
  if (!baby || !user) {
    message.error('请先选择宝宝与身份');
    return;
  }
  submitting.value = true;
  try {
    if (isSupplement.value) {
      const name = supplementName.value === '其他' ? customName.value.trim() : supplementName.value;
      if (!name) {
        message.warning('请输入补剂名称');
        submitting.value = false;
        return;
      }
      await supplementApi.create({
        babyId: baby.id,
        name,
        amount: amount.value || undefined,
        unit: unit.value || undefined,
        takeTime: new Date(supplementTime.value).toISOString(),
        creatorId: user.id,
      });
    } else {
      await activityApi.create({
        babyId: baby.id,
        eventType: activityEventLabel[category.value as Exclude<Category, 'supplement'>],
        eventTime: new Date(activityTime.value).toISOString(),
        description: description.value || undefined,
        creatorId: user.id,
      });
    }
    message.success('记录已保存');
    router.push('/');
  } catch {
    // 错误已由拦截器提示
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div>
    <AppHeader title="其他记录" show-back />
    <div class="px-5 mt-4 space-y-3">
      <!-- 类型选择 -->
      <div class="bg-ios-card rounded-3xl p-4 shadow-card">
        <label class="text-sm font-medium text-ios-secondary">记录类型</label>
        <div class="mt-3 grid grid-cols-3 gap-2">
          <button
            v-for="c in categoryOptions"
            :key="c.value"
            type="button"
            class="py-3 rounded-2xl flex flex-col items-center gap-1 transition-all duration-200"
            :class="
              category === c.value
                ? 'bg-ios-green text-white shadow-card'
                : 'bg-ios-fill/50 text-ios-secondary'
            "
            @click="category = c.value"
          >
            <span class="text-xl">{{ c.icon }}</span>
            <span class="text-xs font-medium">{{ c.label }}</span>
          </button>
        </div>
      </div>

      <!-- 补剂表单 -->
      <template v-if="isSupplement">
        <div class="bg-ios-card rounded-3xl p-4 shadow-card">
          <label class="text-sm font-medium text-ios-secondary">补剂名称</label>
          <TypeSegment v-model="supplementName" :options="supplementNameOptions" class="mt-2" />
          <NInput
            v-if="supplementName === '其他'"
            v-model:value="customName"
            placeholder="请输入补剂名称"
            class="mt-2"
          />
        </div>
        <div class="bg-ios-card rounded-3xl p-4 shadow-card">
          <label class="text-sm font-medium text-ios-secondary">剂量</label>
          <div class="mt-2 grid grid-cols-3 gap-2">
            <NInput v-model:value="amount" placeholder="如 1" class="col-span-2" />
            <NInput v-model:value="unit" placeholder="单位" />
          </div>
        </div>
        <div class="bg-ios-card rounded-3xl p-4 shadow-card">
          <label class="text-sm font-medium text-ios-secondary">时间</label>
          <DateTimePicker v-model="supplementTime" class="mt-2 w-full" />
        </div>
      </template>

      <!-- 活动表单 -->
      <template v-else>
        <div class="bg-ios-card rounded-3xl p-4 shadow-card">
          <label class="text-sm font-medium text-ios-secondary">时间</label>
          <DateTimePicker v-model="activityTime" class="mt-2 w-full" />
        </div>
        <div class="bg-ios-card rounded-3xl p-4 shadow-card">
          <label class="text-sm font-medium text-ios-secondary">描述</label>
          <NInput
            v-model:value="description"
            type="textarea"
            :autosize="{ minRows: 2 }"
            placeholder="如：抬头坚持了 10 秒"
            class="mt-2"
          />
        </div>
      </template>

      <button
        class="w-full py-3.5 rounded-2xl bg-ios-green text-white font-semibold active:scale-95 transition-transform duration-150 disabled:opacity-60"
        :disabled="submitting"
        @click="onSubmit"
      >
        {{ submitting ? '保存中…' : '保存记录' }}
      </button>
    </div>
  </div>
</template>
