<script setup lang="ts">
const isSidebarOpen = ref(true);
const route = useRoute();
const locationStore = useLocationStore();
const sidebarStore = useSidebarStore();

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem('isSidebarOpen') === 'true';
  if (route.path !== '/dashboard') {
    locationStore.refresh();
  }
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem('isSidebarOpen', isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex-1 flex">
    <div class="bg-base-100 transition-all duration-300 flex-none" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div
        class="flex cursor-pointer hover:bg-base-200 p-2"
        :class="{ 'justify-end': isSidebarOpen, 'justify-center': !isSidebarOpen }"
        @click="toggleSidebar"
      >
        <Icon :name="isSidebarOpen ? 'tabler:chevron-left' : 'tabler:chevron-right'" size="32" />
      </div>

      <div class="flex flex-col">
        <SidebarBtn
          :show-label="isSidebarOpen"
          label="Locations"
          icon="tabler:map"
          href="/dashboard"
        />
        <SidebarBtn
          :show-label="isSidebarOpen"
          label="Add Location"
          icon="tabler:circle-plus-filled"
          href="/dashboard/add"
        />

        <div class="divider" />

        <ClientOnly>
          <div v-if="sidebarStore.loading" class="px-4">
            <div class="skeleton h-4 w-full" />
          </div>
          <div v-else class="flex flex-col">
            <SidebarBtn
              v-for="item in sidebarStore.sidebarItems"
              :key="item.id"
              :show-label="isSidebarOpen"
              :label="item.label"
              :icon="item.icon"
              :href="item.href"
            />
          </div>

          <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length" class="divider" />
        </ClientOnly>

        <SidebarBtn
          :show-label="isSidebarOpen"
          label="Sign Out"
          icon="tabler:logout-2"
          href="/sign-out"
        />
      </div>
    </div>
    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>
