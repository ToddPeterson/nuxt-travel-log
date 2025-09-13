export const useLocationStore = defineStore('useLocationStore', () => {
  const { data, status, refresh } = useFetch('/api/locations', {
    lazy: true,
  });

  const sidebarStore = useSidebarStore();

  watchEffect(() => {
    if (data.value) {
      sidebarStore.loading = false;
      sidebarStore.sidebarItems = data.value.results.map(location => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: 'tabler:map-pin-filled',
        href: '#',
      }));
    }
    sidebarStore.loading = status.value === 'pending';
  });

  return {
    locations: data.value?.results || [],
    status,
    refresh,
  };
});
