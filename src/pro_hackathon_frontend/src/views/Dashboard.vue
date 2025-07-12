<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { pro_hackathon_backend } from 'declarations/pro_hackathon_backend/index';

const route = useRoute();
const records = ref([]);
const isLoading = ref(true);
const errorMsg = ref('');
const notification = ref('');

async function fetchRecords() {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    const result = await pro_hackathon_backend.getRecords();
    records.value = result;
  } catch (err) {
    errorMsg.value = "Gagal memuat data catatan.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchRecords();
  const status = route.query.status;
  if (status === 'created') {
    notification.value = 'Catatan kesehatan baru berhasil ditambahkan!';
  } else if (status === 'deleted') {
    notification.value = 'Catatan berhasil dihapus.';
  }

  if (route.query.status === 'created') {
    notification.value = 'Catatan kesehatan baru berhasil ditambahkan!';
    setTimeout(() => {
      notification.value = '';
    }, 4000);
  }
});

const formatDate = (timestamp) => {
  if (!timestamp) return 'Sekarang';
  const date = new Date(Number(timestamp) / 1_000_000);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
};
</script>

<template>
  <div class="relative isolate bg-white min-h-screen">

    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      <div
        class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff8080] to-[#f55050] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]">
      </div>
    </div>

    <main class="z-10 py-12">
      <div class="container mx-auto px-4">

        <div class="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left mb-10">
          <div>
            <h1 class="text-3xl sm:text-4xl font-semibold text-gray-900">Dashboard Kesehatan</h1>
            <p class="mt-2 text-gray-600">Semua catatan riwayat kesehatanmu yang tersimpan.</p>
          </div>
          <router-link to="/create"
            class="mt-4 sm:mt-0 bg-red-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out inline-block">
            + Catatan Baru
          </router-link>
        </div>

        <div v-if="isLoading" class="text-center text-gray-500">
          <p>Memuat data...</p>
        </div>
        <div v-else-if="errorMsg" class="text-center text-red-500">
          <p>{{ errorMsg }}</p>
        </div>
        <div v-else-if="records.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="record in records" :key="record.id"
            class="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl shadow-md p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <div class="flex justify-between items-start mb-4">
              <h2 class="text-lg font-semibold text-gray-800 break-words pr-2">{{ record.diagnosis[0] || 'Belum Didiagnosis' }}</h2>
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full"
                :class="record.endDate.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">{{
                  record.endDate.length > 0 ? 'Selesai' : 'Aktif' }}</span>
            </div>
            <p class="text-gray-600 text-sm mb-4 flex-grow">{{ record.symptoms }}</p>
            <div class="border-t border-gray-200 pt-4 mt-auto">
              <div class="text-xs text-gray-500 mb-4">
                <p>Periode: <span class="font-medium text-gray-700">{{ formatDate(record.startDate) }} - {{
                  formatDate(record.endDate[0]) }}</span></p>
              </div>
              <router-link :to="'/detail/' + record.id"
                class="w-full text-center bg-white text-red-500 border border-red-500 font-semibold py-2 px-4 rounded-lg hover:bg-red-50 hover:text-red-600 transition duration-300 ease-in-out block text-sm">Lihat
                Detail</router-link>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg p-12">
          <p class="font-semibold">Belum Ada Catatan</p>
          <p class="text-sm mt-1 mb-6">Kamu belum memiliki catatan kesehatan. Buat yang pertama sekarang!</p>
          <router-link to="/create"
            class="bg-red-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out inline-block">+
            Buat Catatan Pertama</router-link>
        </div>

      </div>
    </main>
  </div>

  <transition name="slide-fade">
    <div v-if="notification"
      class="fixed bottom-6 left-6 z-50 max-w-sm bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg shadow-lg"
      role="alert">
      <p class="font-bold">Sukses!</p>
      <p>{{ notification }}</p>
    </div>
  </transition>

</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>