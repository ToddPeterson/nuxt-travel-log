<script setup lang="ts">
const { data, status } = await useFetch('/api/locations', {
  lazy: true,
});
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl mb-4">
      Locations
    </h2>

    <div v-if="status === 'pending'">
      <span class="loading loading-spinner loading-xl" />
    </div>
    <div v-else-if="data && data.results.length > 0" class="flex flex-wrap items-stretch gap-2">
      <div v-for="location in data.results" :key="location.id" class="card compact-card bg-base-300 w-72">
        <div class="card-body">
          <h3 class="text-xl">
            {{ location.name }}
          </h3>
          <p class="line-clamp-3">
            {{ location.description }}
          </p>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col items-start gap-2">
      <p>Add a location to get started</p>
      <NuxtLink to="/dashboard/add" class="btn btn-primary">
        Add Location
        <Icon name="tabler:circle-plus-filled" size="24" />
      </NuxtLink>
    </div>
  </div>
</template>
