<script setup>
import { ref, onMounted } from 'vue';
// 1. Import actor backend
import { pro_hackathon_backend } from 'declarations/pro_hackathon_backend/index';

// 2. Siapkan variabel reaktif untuk UI
const isLoading = ref(false);      // Untuk menampilkan pesan "Loading..."
const userInfo = ref(null);        // Untuk menyimpan data pengguna setelah login
const errorMsg = ref('');          // Untuk menampilkan pesan error jika terjadi

// Kredensial Google
const GOOGLE_CLIENT_ID = "241378077010-fl2b4kdil8o8qvj2k6j1ou2m3et3gen7.apps.googleusercontent.com";
const REDIRECT_URI = "http://127.0.0.1:3000";

// 3. Fungsi untuk memulai alur login
function handleLoginClick() {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=openid%20email%20profile&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&client_id=${GOOGLE_CLIENT_ID}`;
  window.location.href = authUrl;
}

// 4. Fungsi untuk mengirim 'code' ke backend
async function verifyCodeToBackend(authCode) {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    // Panggil fungsi di canister backend dengan 'tiket' yang didapat
    const responseText = await pro_hackathon_backend.handle_google_code(authCode);

    // Backend mengembalikan data pengguna dalam bentuk JSON string, kita parse di sini
    const userData = JSON.parse(responseText);

    // Jika ada properti error di respons, tampilkan sebagai error
    if (userData.error) {
      throw new Error(userData.error);
    }

    // Simpan data pengguna ke state
    userInfo.value = userData;

    // INILAH TUJUAN KITA: Tampilkan data di console browser
    console.log("✅ Data Pengguna dari Google:", userInfo.value);

  } catch (err) {
    console.error("Gagal verifikasi atau parsing:", err);
    errorMsg.value = `Terjadi error: ${err.message}`;
  } finally {
    isLoading.value = false;
  }
}

// 5. Kode ini berjalan saat halaman dimuat untuk menangkap redirect
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get('code');

  if (authCode) {
    // Hapus parameter dari URL agar bersih
    window.history.replaceState({}, document.title, window.location.pathname);
    // Langsung panggil fungsi untuk verifikasi ke backend
    verifyCodeToBackend(authCode);
  }
});
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
              <button @click="handleLoginClick"
                class="bg-red-500 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out inline-block w-full sm:w-auto text-sm sm:text-base">
                Login dengan Google
              </button>
              <router-link class="bg-white text-red-500 border border-red-500 font-semibold py-3 px-6 sm:px-8 rounded-lg hover:bg-red-50 hover:text-red-600 transition duration-300 ease-in-out inline-block w-full sm:w-auto text-sm sm:text-base" to="/create">Lihat Source Code</router-link>
            </div>
          </div>

          <div v-else-if="isLoading">
            <p class="text-lg text-gray-600">Memverifikasi login, harap tunggu...</p>
          </div>

          <div v-else-if="userInfo"
            class="text-left bg-green-50 border border-green-200 p-6 rounded-lg max-w-md mx-auto">
            <p class="text-2xl font-semibold text-green-800">✅ Login Sukses!</p>
            <img :src="userInfo.picture" alt="User avatar"
              class="w-20 h-20 rounded-full mx-auto my-4 border-2 border-green-200" />
            <p class="text-center text-lg text-gray-800">Selamat datang, <span class="font-bold">{{ userInfo.name
                }}</span>!</p>
            <p class="text-center text-sm text-gray-600">{{ userInfo.email }}</p>
            <p class="text-xs text-gray-500 mt-4 text-center">Data lengkap telah dicetak di console browser (F12).</p>
          </div>

          <p v-if="errorMsg" class="mt-4 text-red-600">{{ errorMsg }}</p>

        </div>
      </main>

      <footer class="py-8 sm:py-12 z-10">
        <div class="container mx-auto text-center px-4">
          <p class="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Dibangun dengan teknologi modern:</p>
          <div class="flex justify-center items-center gap-6 sm:gap-8 md:gap-12">

            <div class="flex items-center gap-2 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition">
              <svg class="h-5 sm:h-6 w-5 sm:w-6" fill="currentColor" viewBox="0 0 128 128"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M64 0a64 64 0 1064 64A64 64 0 0064 0zm0 119.2a55.2 55.2 0 1155.2-55.2A55.2 55.2 0 0164 119.2z" />
                <path
                  d="M101.44 26.56a36.48 36.48 0 00-51.52-5.28L40 31.2l-5.28-9.92A54.72 54.72 0 01103.36 58.4l1.92-3.84a36.48 36.48 0 00-3.84-28zM31.2 40L21.28 45.28a36.48 36.48 0 005.28 51.52L36.48 87.l9.92 5.28A54.72 54.72 0 0114.72 55.2l3.84-1.92a36.48 36.48 0 0012.64-11.28z" />
                <path
                  d="M96.8 31.2L55.2 55.2 45.28 40l-9.92 5.28L40 55.2l-5.28 9.92L45.28 72l-5.28 9.92L50 87.2l5.28-9.92 41.52-24.32L106.88 48l-9.92-5.28L87 32.8l9.92-5.28z" />
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
</template>