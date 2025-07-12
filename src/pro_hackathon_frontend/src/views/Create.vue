<script setup>
import { ref } from 'vue';
// PERUBAHAN: Import useRouter untuk redirect
import { useRouter } from 'vue-router';
// Import actor backend
import { pro_hackathon_backend } from 'declarations/pro_hackathon_backend/index';

const router = useRouter(); // Inisialisasi router

const record = ref({
  userName: '',
  ownerId: '',
  startDate: '',
  endDate: '',
  symptoms: '',
  diagnosis: ''
});

const isLoading = ref(false);
const message = ref('');

async function handleCreateRecord() {
  isLoading.value = true;
  message.value = '';

  if (!record.value.userName || !record.value.startDate || !record.value.symptoms) {
    message.value = 'Error: Nama Pengguna, Tanggal Mulai Sakit, dan Gejala wajib diisi.';
    isLoading.value = false;
    return;
  }

  message.value = 'Menyimpan catatan ke canister...';

  try {
    const startDateInt = BigInt(Date.parse(record.value.startDate) * 1_000_000);
    const endDateOpt = record.value.endDate ? [BigInt(Date.parse(record.value.endDate) * 1_000_000)] : [];
    const diagnosisOpt = record.value.diagnosis ? [record.value.diagnosis] : [];

    const newRecord = await pro_hackathon_backend.createRecord(
      record.value.userName,
      startDateInt,
      endDateOpt,
      record.value.symptoms,
      diagnosisOpt
    );

    router.push('/dashboard?status=created');

  } catch (error) {
    console.error("Gagal membuat catatan:", error);
    message.value = 'Gagal menyimpan catatan. Silakan coba lagi.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="relative isolate bg-white">

    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      <div
        class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff8080] to-[#f55050] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]">
      </div>
    </div>

    <main class="flex-grow flex items-center justify-center z-10 py-12">
      <div class="container mx-auto px-4">

        <div class="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">

          <div class="text-center mb-8">
            <h1 class="text-xl sm:text-2xl font-semibold text-red-600 mb-1">
              Catatan Kesehatan Baru
            </h1>
            <p class="text-gray-500 text-sm">Isi detail di bawah ini untuk memulai pelacakan.</p>
          </div>

          <form @submit.prevent="handleCreateRecord" class="space-y-6 text-left">

            <div>
              <label for="userName" class="block text-sm font-medium text-gray-700 mb-1">Nama Pengguna <span
                  class="text-red-500">*</span></label>
              <input v-model="record.userName" type="text" id="userName"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition"
                placeholder="Nama dari profil Google">
            </div>
            <div>
              <label for="ownerId" class="block text-sm font-medium text-gray-700 mb-1">ID Pemilik (Principal) <span
                  class="text-red-500">*</span></label>
              <input v-model="record.ownerId" type="text" id="ownerId"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition"
                placeholder="ID unik dari sistem login">
            </div>
            <hr class="my-4">
            <div>
              <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai Sakit <span
                  class="text-red-500">*</span></label>
              <input v-model="record.startDate" type="date" id="startDate"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition">
            </div>
            <div>
              <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal Sembuh
                (Opsional)</label>
              <input v-model="record.endDate" type="date" id="endDate"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition">
            </div>
            <div>
              <label for="symptoms" class="block text-sm font-medium text-gray-700 mb-1">Gejala yang Dirasakan <span
                  class="text-red-500">*</span></label>
              <textarea v-model="record.symptoms" id="symptoms" rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition"
                placeholder="Contoh: Demam tinggi, sakit kepala, dan batuk kering..."></textarea>
            </div>
            <div>
              <label for="diagnosis" class="block text-sm font-medium text-gray-700 mb-1">Diagnosis Penyakit
                (Opsional)</label>
              <input v-model="record.diagnosis" type="text" id="diagnosis"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition"
                placeholder="Contoh: Influenza Tipe A">
            </div>

            <div class="pt-2">
              <button type="submit" :disabled="isLoading"
                class="cursor-pointer w-full bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out disabled:bg-red-300 disabled:cursor-not-allowed">
                {{ isLoading ? 'Menyimpan...' : 'Simpan Catatan' }}
              </button>
            </div>

          </form>

          <div v-if="message" class="mt-6 text-center text-sm p-3 rounded-lg"
            :class="{ 'bg-green-50 text-green-700': message.includes('Sukses'), 'bg-red-50 text-red-700': message.includes('Error') }">
            {{ message }}
          </div>

        </div>
      </div>
    </main>
  </div>

  <router-link to="/dashboard"
    class="fixed bottom-6 right-6 h-14 w-14 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-transform hover:scale-110">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"
      stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  </router-link>

</template>