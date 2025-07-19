<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

onMounted(() => {
  const storedUser = localStorage.getItem('loggedInUser');
  if (storedUser && route.path === '/') {
    router.push('/dashboard');
  }
});
</script>

<template>
  <router-view />
</template>