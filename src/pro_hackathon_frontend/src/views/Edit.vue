<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { pro_hackathon_backend } from 'declarations/pro_hackathon_backend/index';

const route = useRoute();
const router = useRouter();
const record = ref(null);
const isLoading = ref(true);
const message = ref('');

function toInputDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toISOString().split('T')[0];
}

onMounted(async () => {
    try {
        const recordId = BigInt(route.params.id);
        const result = await pro_hackathon_backend.getRecordById(recordId);
        if (result.length > 0) {
            const fetchedRecord = result[0];
            record.value = {
                ...fetchedRecord,
                startDate: toInputDate(fetchedRecord.startDate),
                endDate: fetchedRecord.endDate.length > 0 ? toInputDate(fetchedRecord.endDate[0]) : '',
                diagnosis: fetchedRecord.diagnosis[0] || ''
            };
        } else {
            throw new Error("Catatan tidak ditemukan.");
        }
    } catch (error) {
        message.value = `Error: ${error.message}`;
    } finally {
        isLoading.value = false;
    }
});

async function handleUpdateRecord() {
    isLoading.value = true;
    message.value = '';
    try {
        const recordId = BigInt(route.params.id);

        // --- PERBAIKAN DI SINI ---
        // Kalikan dengan 1_000_000 untuk mengubah dari milidetik ke nanodetik
        const startDateInt = BigInt(Date.parse(record.value.startDate) * 1_000_000);

        const endDateOpt = record.value.endDate
            ? [BigInt(Date.parse(record.value.endDate) * 1_000_000)]
            : [];

        const diagnosisOpt = record.value.diagnosis ? [record.value.diagnosis] : [];

        const result = await pro_hackathon_backend.updateRecord(
            recordId,
            startDateInt,
            endDateOpt,
            record.value.symptoms,
            diagnosisOpt
        );

        if (result.ok) {
            router.push(`/detail/${recordId}?status=updated`);
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
    <div class="relative isolate bg-white">

        <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true">
            <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff8080] to-[#f55050] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
            </div>
        </div>
        <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true">
            <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#f87171] to-[#dc2626] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
            </div>
        </div>
        <main class="flex-grow flex items-center justify-center z-10 py-12">
            <div class="container mx-auto px-4">

                <div v-if="isLoading" class="text-center">Memuat data...</div>
                <div v-else-if="!record" class="text-center text-red-500">{{ message }}</div>

                <div v-else
                    class="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div class="text-center mb-8">
                        <h1 class="text-xl sm:text-2xl font-semibold text-red-600 mb-1">Edit Catatan Kesehatan</h1>
                        <p class="text-gray-500 text-sm">Perbarui detail catatan</p>
                    </div>
                    <form @submit.prevent="handleUpdateRecord" class="space-y-6 text-left">
                        <div>
                            <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai
                                Sakit <span class="text-red-500">*</span></label>
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
                            <label for="symptoms" class="block text-sm font-medium text-gray-700 mb-1">Gejala yang
                                Dirasakan <span class="text-red-500">*</span></label>
                            <textarea v-model="record.symptoms" id="symptoms" rows="4"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition"></textarea>
                        </div>
                        <div>
                            <label for="diagnosis" class="block text-sm font-medium text-gray-700 mb-1">Diagnosis
                                Penyakit (Opsional)</label>
                            <input v-model="record.diagnosis" type="text" id="diagnosis"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition">
                        </div>
                        <div class="pt-2">
                            <button type="submit" :disabled="isLoading"
                                class="w-full bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition disabled:bg-red-300">
                                {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
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

        <router-link to="/dashboard"
            class="fixed bottom-6 right-6 h-14 w-14 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        </router-link>
    </div>
</template>