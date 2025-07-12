<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { pro_hackathon_backend } from 'declarations/pro_hackathon_backend/index';

const route = useRoute();
const router = useRouter();
const record = ref(null);
const isLoading = ref(true);
const errorMsg = ref('');
const isModalOpen = ref(false);
const isDeleting = ref(false);
const notification = ref('');

function openDeleteModal() {
    isModalOpen.value = true;
}

function closeDeleteModal() {
    isModalOpen.value = false;
}

// --- PERUBAHAN UTAMA DI SINI ---
async function confirmDelete() {
    isDeleting.value = true;
    errorMsg.value = '';
    try {
        // Panggil fungsi deleteRecord di backend
        const result = await pro_hackathon_backend.deleteRecord(record.value.id);

        if (result.ok) {
            // Jika sukses, arahkan ke dashboard dengan status 'deleted'
            router.push('/dashboard?status=deleted');
        } else {
            // Jika ada error dari backend, tampilkan pesannya
            throw new Error(result.err);
        }
    } catch (err) {
        console.error("Gagal menghapus catatan:", err);
        // Tampilkan error di halaman detail jika gagal
        errorMsg.value = `Gagal menghapus: ${err.message}`;
        closeDeleteModal(); // Tutup modal jika gagal
    } finally {
        isDeleting.value = false;
    }
}

const formatDate = (timestamp) => {
    if (!timestamp) return 'Belum Selesai';
    const date = new Date(Number(timestamp) / 1_000_000);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
};

onMounted(async () => {
    // ... Logika onMounted tetap sama ...
    try {
        const recordId = BigInt(route.params.id);
        const result = await pro_hackathon_backend.getRecordById(recordId);
        if (result.length > 0) {
            record.value = result[0];
        } else {
            throw new Error("Catatan tidak ditemukan atau Anda tidak memiliki akses.");
        }
    } catch (err) {
        errorMsg.value = err.message;
    } finally {
        isLoading.value = false;
    }

    // Logika notifikasi untuk 'updated'
    if (route.query.status === 'updated') {
        notification.value = 'Catatan berhasil diperbarui!';
        setTimeout(() => {
            notification.value = '';
        }, 4000);
    }
});
</script>

<template>
    <div class="relative isolate bg-white min-h-screen">
        <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true">
            <div
                class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff8080] to-[#f55050] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]">
            </div>
        </div>

        <main class="z-10 py-12">
            <div class="container mx-auto px-4">

                <div v-if="isLoading" class="text-center text-gray-500">
                    <p>Memuat detail catatan...</p>
                </div>

                <div v-else-if="errorMsg" class="text-center text-red-500">
                    <p>Error: {{ errorMsg }}</p>
                </div>

                <div v-else-if="record"
                    class="max-w-4xl mx-auto bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">

                    <div class="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                        <div>
                            <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900">{{ record.diagnosis[0] ||
                                'Riwayat Sakit' }}</h1>
                            <p class="text-sm text-gray-500">Detail Catatan</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <router-link :to="'/edit/' + record.id" class="p-2 rounded-md hover:bg-gray-200 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                                </svg>
                            </router-link>
                            <button @click="openDeleteModal" class="p-2 rounded-md hover:bg-red-100 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div class="space-y-4">
                            <div>
                                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</h3>
                                <p class="text-lg font-medium"
                                    :class="record.endDate.length > 0 ? 'text-green-600' : 'text-red-600'">
                                    {{ record.endDate.length > 0 ? 'Sudah Sembuh' : 'Masih Sakit' }}
                                </p>
                            </div>
                            <div>
                                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Periode Sakit
                                </h3>
                                <p class="text-gray-800">{{ formatDate(record.startDate) }} &mdash; {{
                                    formatDate(record.endDate[0]) }}</p>
                            </div>
                            <div>
                                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Diagnosis</h3>
                                <p class="text-gray-800">{{ record.diagnosis[0] || 'Belum ada diagnosis resmi.' }}</p>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gejala</h3>
                                <p class="text-gray-800 whitespace-pre-wrap">{{ record.symptoms }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <div v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity"
        @click.self="closeDeleteModal">
        <div class="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div class="flex items-start">
                <div
                    class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">Hapus Catatan Kesehatan
                    </h3>
                    <p class="text-sm text-gray-500">Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak
                        dapat dibatalkan.</p>
                </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button @click="confirmDelete" type="button"
                    class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                    Yakin Hapus
                </button>
                <button @click="closeDeleteModal" type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                    Batal
                </button>
            </div>
        </div>
    </div>

    <router-link to="/dashboard"
        class="fixed bottom-6 right-6 h-14 w-14 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-transform hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    </router-link>

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