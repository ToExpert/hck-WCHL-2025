import { useState } from "react";

const Edit = ({ riwayat, idx, user, onClose, onCloseDetail, refresh, onUpdated, setMessage, setSuccess }) => {
    const [gejala, setGejala] = useState(riwayat.gejala);
    const [tanggalMulai, setTanggalMulai] = useState(
        new Date(Number(riwayat.tanggal_mulai) / 1_000_000).toISOString().split("T")[0]
    );
    const [tanggalSembuh, setTanggalSembuh] = useState(
        riwayat.tanggal_sembuh != 0
            ? new Date(Number(riwayat.tanggal_sembuh) / 1_000_000).toISOString().split("T")[0]
            : ""
    );
    const [penyakit, setPenyakit] = useState(riwayat.penyakit?.[0] || "");
    const [catatanDokter, setCatatanDokter] = useState(riwayat.catatan_dokter?.[0] || "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const principal = user.authClient.getIdentity().getPrincipal();

            const mulaiNano = BigInt(new Date(tanggalMulai).getTime()) * 1_000_000n;
            const sembuhNano = tanggalSembuh
                ? BigInt(new Date(tanggalSembuh).getTime()) * 1_000_000n
                : null;

            const res = await user.actor.updateRiwayat(
                principal,
                idx,
                penyakit.length > 0 ? [penyakit] : [],
                gejala,
                mulaiNano,
                sembuhNano ? [sembuhNano] : [],
                catatanDokter.length > 0 ? [catatanDokter] : []
            );

            if (res) {
                refresh();
                onCloseDetail();
                onClose();
                if (onUpdated) {
                    onUpdated({
                        ...riwayat,
                        penyakit,
                        gejala,
                        tanggal_mulai: mulaiNano,
                        tanggal_sembuh: sembuhNano || null,
                        catatan_dokter: catatanDokter,
                    });
                }

                setMessage("Riwayat berhasil diperbarui!");
                setSuccess(true);
            }
        } catch (err) {
            setMessage("Terjadi kesalahan saat memperbarui!");
            setSuccess(false);
        }
    };

    return (
        // Latar belakang modal (backdrop) tetap sama
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">

            {/* 1. Container Card disesuaikan agar mirip dengan halaman Create */}
            <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-gray-100">

                {/* 2. Header ditambahkan untuk konsistensi */}
                <div className="text-center mb-8">
                    <h1 className="text-xl sm:text-3xl font-semibold text-red-600 mb-1">
                        Edit Riwayat Kesehatan
                    </h1>
                    <p className="text-gray-500 text-base">
                        Perbarui detail di bawah ini untuk mengubah catatan.
                    </p>
                </div>

                {/* Form dengan styling yang diperbarui */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* 3. Urutan dan styling field disesuaikan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tanggalMulai" className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Mulai Sakit <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="tanggalMulai"
                                type="date"
                                value={tanggalMulai}
                                onChange={(e) => setTanggalMulai(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition text-base"
                            />
                        </div>
                        <div>
                            <label htmlFor="tanggalSembuh" className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Sembuh (Opsional)
                            </label>
                            <input
                                id="tanggalSembuh"
                                type="date"
                                value={tanggalSembuh ?? ""}
                                onChange={(e) => setTanggalSembuh(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition text-base"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="gejala" className="block text-sm font-medium text-gray-700 mb-1">
                            Gejala yang Dirasakan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="gejala"
                            value={gejala}
                            onChange={(e) => setGejala(e.target.value)}
                            rows="4"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition text-base"
                            placeholder="Contoh: Demam tinggi, sakit kepala, dan batuk kering..."
                        />
                    </div>

                    <div>
                        <label htmlFor="penyakit" className="block text-sm font-medium text-gray-700 mb-1">
                            Diagnosis Penyakit (Opsional)
                        </label>
                        <input
                            id="penyakit"
                            type="text"
                            value={penyakit}
                            onChange={(e) => setPenyakit(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition text-base"
                            placeholder="Contoh: Influenza Tipe A"
                        />
                    </div>

                    <div>
                        <label htmlFor="catatanDokter" className="block text-sm font-medium text-gray-700 mb-1">
                            Catatan Dokter (Opsional)
                        </label>
                        <textarea
                            id="catatanDokter"
                            value={catatanDokter}
                            onChange={(e) => setCatatanDokter(e.target.value)}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition text-base"
                            placeholder="Catatan tambahan dari dokter..."
                        />
                    </div>

                    {/* 4. Tombol Aksi diperbarui dengan gaya yang konsisten */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white text-base text-gray-700 border border-gray-300 font-semibold py-2 px-5 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition text-base cursor-pointer"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Edit;
