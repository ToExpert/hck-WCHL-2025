<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { pro_hackathon_backend } from 'declarations/pro_hackathon_backend/index';

const router = useRouter();
const registerForm = ref({ username: '', email: '', password: '' });
const isLoading = ref(false);
const message = ref('');

async function handleRegister() {
    isLoading.value = true;
    message.value = '';
    try {
        const result = await pro_hackathon_backend.register(
            registerForm.value.username,
            registerForm.value.email,
            registerForm.value.password
        );

        if (result.ok) {
            // Jika sukses, arahkan ke halaman login dengan pesan sukses di URL
            router.push('/login?status=registered');
        } else {
            // Jika gagal, lempar error agar bisa ditangkap dan ditampilkan
            throw new Error(result.err);
        }
    } catch (error) {
        message.value = `Error: ${error.message}`;
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="relative isolate bg-white min-h-screen flex items-center justify-center">

        <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true">
            <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff8080] to-[#f55050] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
            </div>
        </div>

        <div
            class="w-full max-w-md p-8 space-y-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 z-10">
            <div class="text-center">
                <h1 class="text-2xl font-semibold text-gray-900">Buat Akun Baru</h1>
                <p class="text-sm text-gray-500 mt-1">Sudah punya akun?
                    <router-link to="/login" class="font-medium text-red-600 hover:underline">Masuk di
                        sini</router-link>
                </p>
            </div>

            <div v-if="message" class="bg-red-100 border border-red-200 text-red-800 text-sm p-3 rounded-lg">
                {{ message }}
            </div>

            <form @submit.prevent="handleRegister" class="space-y-4">
                <div>
                    <label for="register-username" class="block mb-2 text-sm font-medium text-gray-900">Username</label>
                    <input v-model="registerForm.username" type="text" id="register-username"
                        placeholder="Pilih username unik" required
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5" />
                </div>
                <div>
                    <label for="register-email" class="block mb-2 text-sm font-medium text-gray-900">Email Anda</label>
                    <input v-model="registerForm.email" type="email" id="register-email" placeholder="nama@email.com"
                        required
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5" />
                </div>
                <div>
                    <label for="register-password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
                    <input v-model="registerForm.password" type="password" id="register-password" placeholder="••••••••"
                        required
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5" />
                </div>
                <button type="submit" :disabled="isLoading"
                    class="w-full text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-red-300 disabled:cursor-not-allowed">
                    {{ isLoading ? 'Mendaftar...' : 'Buat Akun' }}
                </button>
            </form>
        </div>

        <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true">
            <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#f87171] to-[#dc2626] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
            </div>
        </div>

    </div>
</template>