<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { pro_hackathon_backend } from 'declarations/pro_hackathon_backend/index';

const router = useRouter();
const route = useRoute();
const loginForm = ref({ username: '', password: '' });
const isLoading = ref(false);
const message = ref('');
const notification = ref(''); // State khusus untuk notifikasi sukses

// Cek notifikasi dari halaman register saat komponen dimuat
onMounted(() => {
    if (route.query.status === 'registered') {
        notification.value = 'Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.';
        // Hapus notifikasi setelah beberapa detik agar tidak menetap
        setTimeout(() => { notification.value = '' }, 5000);
    }
});

async function handleLogin() {
    isLoading.value = true;
    message.value = '';
    try {
        const result = await pro_hackathon_backend.login(loginForm.value.username, loginForm.value.password);
        if (result.ok) {
            // Simpan data pengguna hanya di localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(result.ok));
            router.push('/dashboard');
        } else {
            throw new Error(result.err);
        }
    } catch (error) {
        // Tampilkan error login di halaman
        message.value = `Login Gagal: ${error.message}`;
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="relative isolate bg-white min-h-screen flex items-center justify-center">

        <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true">
            <div
                class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff8080] to-[#f55050] opacity-20">
            </div>
        </div>

        <div
            class="w-full max-w-md p-8 space-y-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 z-10">
            <div class="text-center">
                <h1 class="text-2xl font-semibold text-gray-900">Masuk ke Akun Anda</h1>
                <p class="text-sm text-gray-500 mt-1">Belum punya akun?
                    <router-link to="/register" class="font-medium text-red-600 hover:underline">Daftar di
                        sini</router-link>
                </p>
            </div>

            <div v-if="notification" class="bg-green-100 border border-green-200 text-green-800 text-sm p-3 rounded-lg">
                {{ notification }}
            </div>

            <div v-if="message" class="bg-red-100 border border-red-200 text-red-800 text-sm p-3 rounded-lg">
                {{ message }}
            </div>

            <form @submit.prevent="handleLogin" class="space-y-4 pt-2">
                <div>
                    <label for="login-username" class="block mb-2 text-sm font-medium text-gray-900">Username</label>
                    <input v-model="loginForm.username" type="text" id="login-username"
                        placeholder="Masukkan username Anda" required
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5" />
                </div>
                <div>
                    <label for="login-password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
                    <input v-model="loginForm.password" type="password" id="login-password" placeholder="••••••••"
                        required
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5" />
                </div>
                <button type="submit" :disabled="isLoading"
                    class="w-full text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-red-300 disabled:cursor-not-allowed">
                    {{ isLoading ? 'Memproses...' : 'Masuk' }}
                </button>
            </form>
        </div>

        <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true">
            <div
                class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#f87171] to-[#dc2626] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]">
            </div>
        </div>
    </div>
</template>