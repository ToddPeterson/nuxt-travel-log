<script setup lang="ts">
const props = defineProps<{
  label: string;
  icon: string;
  href: string;
  showLabel: boolean;
}>();

const route = useRoute();

const isCurrentPath = computed(() => route.path === props.href);
</script>

<template>
  <div class="tooltip-right" :class="{ tooltip: !showLabel }" :data-tip="showLabel ? undefined : props.label">
    <NuxtLink
      class="flex flex-nowrap gap-2 p-2 hover:bg-base-300 cursor-pointer"
      :class="{ 'bg-base-200': isCurrentPath, 'justify-start': showLabel, 'justify-center': !showLabel }"
      :to="props.href"
    >
      <Icon :name="props.icon" size="24" />
      <Transition name="grow">
        <span v-if="showLabel">{{ props.label }}</span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style lang="css" scoped>
.grow-enter-active {
  animation: grow 0.1s;
}

.grow-leave-active {
  animation: grow 0.1s reverse;
}

@keyframes grow {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
