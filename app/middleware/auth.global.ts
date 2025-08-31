import { createAuthClient } from 'better-auth/vue';

const authClient = createAuthClient();

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch);
  if (!session.value) {
    if (to.path.startsWith('/dashboard')) {
      return navigateTo('/');
    }
  }
});
