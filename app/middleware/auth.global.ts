import { createAuthClient } from 'better-auth/vue';

const authClient = createAuthClient();

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/dashboard')) {
    return;
  }

  const { data: session } = await authClient.useSession(useFetch);
  if (!session.value?.user) {
    return navigateTo('/');
  }
});
