<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter
import { pro_hackathon_backend } from 'declarations/pro_hackathon_backend/index';

const router = useRouter(); // Inisialisasi router
const modalView = ref('login');
const registerForm = ref({ username: '', email: '', password: '' });
const loginForm = ref({ username: '', password: '' });
const isLoading = ref(false);
const message = ref('');

// Fungsi handleRegister (tidak berubah)
async function handleRegister() {
  isLoading.value = true;
  message.value = '';
  try {
    const result = await pro_hackathon_backend.register(
      registerForm.value.username, registerForm.value.email, registerForm.value.password
    );
    if (result.ok) {
      message.value = result.ok;
      setTimeout(() => {
        modalView.value = 'login';
        message.value = '';
        registerForm.value = { username: '', email: '', password: '' };
      }, 2000);
    } else { throw new Error(result.err); }
  } catch (error) {
    message.value = `Error: ${error.message}`;
  } finally {
    isLoading.value = false;
  }
}

// PERUBAHAN: Fungsi handleLogin sekarang memiliki logika
async function handleLogin() {
  isLoading.value = true;
  message.value = '';
  try {
    const result = await pro_hackathon_backend.login(
      loginForm.value.username,
      loginForm.value.password
    );
    if (result.ok) {
      const loggedInUser = result.ok;
      console.log("✅ Login berhasil:", loggedInUser);
      // Tutup modal (jika menggunakan Flowbite, ini perlu cara khusus, tapi untuk sekarang kita redirect)
      // Untuk hackathon, redirect langsung adalah cara termudah
      router.push('/dashboard');
    } else {
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
  <div class="relative isolate bg-white overflow-hidden h-screen">

    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      <div
        class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff8080] to-[#f55050] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
      </div>
    </div>

    <div class="flex flex-col h-screen">
      <main class="flex-grow flex items-center justify-center text-center z-10">
        <div class="container mx-auto px-4">

          <div v-if="!userInfo && !isLoading">
            <h1 class="text-xl sm:text-2xl font-semibold text-red-600 mb-2">De-Health</h1>
            <h2 class="text-3xl sm:text-4xl md:text-6xl font-semibold text-gray-900 leading-tight mb-3 sm:mb-4">
              Kendalikan Riwayat Kesehatanmu.</h2>
            <p class="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8">De-Health adalah
              platform aman dan terdesentralisasi untuk mencatat, melacak, dan mengelola semua riwayat kesehatanmu.
              Datamu milikmu, selamanya.</p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button data-modal-target="auth-modal" data-modal-toggle="auth-modal"
                class="bg-red-500 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out inline-block w-full sm:w-auto text-sm sm:text-base cursor-pointer"
                type="button">
                Login / Daftar
              </button>
              <router-link
                class="bg-white text-red-500 border border-red-500 font-semibold py-3 px-6 sm:px-8 rounded-lg hover:bg-red-50 hover:text-red-600 transition duration-300 ease-in-out inline-block w-full sm:w-auto text-sm sm:text-base"
                to="/create">Lihat Source Code</router-link>
            </div>
          </div>
        </div>
      </main>

      <footer class="py-8 sm:py-12 z-10">
        <div class="container mx-auto text-center px-4">
          <p class="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Dibangun dengan teknologi modern:</p>
          <div class="flex justify-center items-center gap-6 sm:gap-8 md:gap-12">

            <div class="flex items-center gap-2 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition">
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 358.8 179.8"
                style="enable-background:new 0 0 358.8 179.8;" xml:space="preserve" class="h-6 w-auto text-gray-500">

                <path fill="currentColor"
                  d="M271.6,0c-20,0-41.9,10.9-65,32.4c-10.9,10.1-20.5,21.1-27.5,29.8c0,0,11.2,12.9,23.5,26.8
c6.7-8.4,16.2-19.8,27.3-30.1c20.5-19.2,33.9-23.1,41.6-23.1c28.8,0,52.2,24.2,52.2,54.1c0,29.6-23.4,53.8-52.2,54.1
c-1.4,0-3-0.2-5-0.6c8.4,3.9,17.5,6.7,26,6.7c52.8,0,63.2-36.5,63.8-39.1c1.5-6.7,2.4-13.7,2.4-20.9C358.6,40.4,319.6,0,271.6,0z" />
                <path fill="currentColor"
                  d="M87.1,179.8c20,0,41.9-10.9,65-32.4c10.9-10.1,20.5-21.1,27.5-29.8c0,0-11.2-12.9-23.5-26.8
c-6.7,8.4-16.2,19.8-27.3,30.1c-20.5,19-34,23.1-41.6,23.1c-28.8,0-52.2-24.2-52.2-54.1c0-29.6,23.4-53.8,52.2-54.1
c1.4,0,3,0.2,5,0.6c-8.4-3.9-17.5-6.7-26-6.7C13.4,29.6,3,66.1,2.4,68.8C0.9,75.5,0,82.5,0,89.7C0,139.4,39,179.8,87.1,179.8z" />
                <path fill="currentColor" d="M127.3,59.7c-5.8-5.6-34-28.5-61-29.3C18.1,29.2,4,64.2,2.7,68.7C12,29.5,46.4,0.2,87.2,0
c33.3,0,67,32.7,91.9,62.2c0,0,0.1-0.1,0.1-0.1c0,0,11.2,12.9,23.5,26.8c0,0,14,16.5,28.8,31c5.8,5.6,33.9,28.2,60.9,29
c49.5,1.4,63.2-35.6,63.9-38.4c-9.1,39.5-43.6,68.9-84.6,69.1c-33.3,0-67-32.7-92-62.2c0,0.1-0.1,0.1-0.1,0.2
c0,0-11.2-12.9-23.5-26.8C156.2,90.8,142.2,74.2,127.3,59.7z M2.7,69.1c0-0.1,0-0.2,0.1-0.3C2.7,68.9,2.7,69,2.7,69.1z" />
              </svg>
              <span class="font-semibold text-xs sm:text-base">Internet Computer</span>
            </div>

            <div class="flex items-center gap-2 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition">
              <svg class="h-5 sm:h-6 w-5 sm:w-6" fill="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2,4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.334,6.182,14.973,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2,4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.334,13.382,8.973,12,6.001,12z" />
              </svg>
              <span class="font-semibold text-xs sm:text-base">Tailwind CSS</span>
            </div>
            <div class="flex items-center gap-2 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition">
              <svg class="h-5 sm:h-6 w-5 sm:w-6" fill="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M18.4,1.2l-6,10.4L6.4,1.2H0l12,21.6L24,1.2Z" />
                <path d="M18.4,1.2l-6,10.4L6.4,1.2H3.6l8.4,15L20.4,1.2Z" />
              </svg>
              <span class="font-semibold text-xs sm:text-base">Vue.js</span>
            </div>

          </div>
        </div>
      </footer>
    </div>

    <div
      class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      aria-hidden="true">
      <div
        class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#f87171] to-[#dc2626] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
      </div>
    </div>

  </div>
  <div id="auth-modal" tabindex="-1" aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-lg shadow-sm">
        <div class="flex items-center justify-center p-2">
          <div class="flex-1 flex">
            <button @click="modalView = 'login'" class="w-full py-3 text-sm font-semibold"
              :class="modalView === 'login' ? 'text-red-600' : 'text-gray-500 hover:text-gray-800'">
              Masuk
            </button>
            <button @click="modalView = 'register'" class="w-full py-3 text-sm font-semibold"
              :class="modalView === 'register' ? 'text-red-600' : 'text-gray-500 hover:text-gray-800'">
              Daftar
            </button>
          </div>
          <button type="button"
            class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
            data-modal-hide="auth-modal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>

        <div class="p-4 md:p-5 pt-0">
          <form v-if="modalView === 'login'" @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label for="login-username" class="block mb-2 text-sm font-medium text-gray-900">Username</label>
              <input v-model="loginForm.username" type="text" name="login-username" id="login-username"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                placeholder="Masukkan username Anda" required />
            </div>
            <div>
              <label for="login-password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input v-model="loginForm.password" type="password" name="login-password" id="login-password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                required />
            </div>
            <button type="submit" :disabled="isLoading"
              class="w-full text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-red-300 disabled:cursor-not-allowed">
              {{ isLoading ? 'Memproses...' : 'Masuk ke Akun Anda' }}
            </button>
          </form>

          <form v-if="modalView === 'register'" @submit.prevent="handleRegister" class="space-y-4" action="#">
            <div>
              <label for="register-username" class="block mb-2 text-sm font-medium text-gray-900">Username</label>
              <input v-model="registerForm.username" type="text" name="register-username" id="register-username"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                placeholder="Pilih username unik" required />
            </div>
            <div>
              <label for="register-email" class="block mb-2 text-sm font-medium text-gray-900">Email Anda</label>
              <input v-model="registerForm.email" type="email" name="register-email" id="register-email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                placeholder="nama@email.com" required />
            </div>
            <div>
              <label for="register-password" class="block mb-2 text-sm font-medium text-gray-900">Buat Password</label>
              <input v-model="registerForm.password" type="password" name="register-password" id="register-password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                required />
            </div>

            <button :disabled="isLoading"
              class="w-full text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-red-300 disabled:cursor-not-allowed">
              {{ isLoading ? 'Mendaftar...' : 'Buat Akun' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>