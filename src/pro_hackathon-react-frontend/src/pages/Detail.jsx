import { useEffect, useState } from "react";
import Edit from "./Edit";

const formatDate = (nano) => {
    if (!nano) return null;
    const millis = Number(nano) / 1_000_000;
    return new Date(millis).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

const ConfirmDeleteModal = ({ open, onClose, onConfirm }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-sm p-6 mx-4 bg-white rounded-xl shadow-xl border border-gray-200">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Konfirmasi Hapus</h2>
                    <p className="text-gray-600 mb-6 text-base">
                        Apakah kamu yakin ingin menghapus catatan ini? Aksi ini tidak bisa dibatalkan.
                    </p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onClose}
                            className="bg-white text-base text-gray-700 border border-gray-300 font-semibold py-2 px-5 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 text-base bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition cursor-pointer"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Detail = ({ open, onClose, riwayat, user, refresh, setMessage, setSuccess }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [riwayatDetail, setRiwayatDetail] = useState(riwayat);

    useEffect(() => {
        setRiwayatDetail(riwayat);
    }, [riwayat]);
    if (!open || !riwayat) return null;

    const handleDelete = async () => {
        try {
            const principal = user.authClient.getIdentity().getPrincipal();
            const idx = riwayat.index;
            const res = await user.actor.deleteRiwayat(principal, idx);
            if (res) {
                setMessage("Catatan berhasil dihapus!");
                setSuccess(true);

                refresh();
                setConfirmOpen(false);
                onClose();
            } else {
                setMessage("Gagal menghapus catatan!");
                setSuccess(false);
            }
        } catch (err) {
            setMessage("Terjadi kesalahan saat menghapus!");
            setSuccess(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
                <div className="relative w-full max-w-lg p-6 mx-4 bg-white rounded-xl shadow-xl border border-gray-200">

                    <div className="text-center mb-6">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">Detail Riwayat</h1>
                        <p className="text-gray-500 text-base">Catatan lengkap kesehatanmu</p>
                    </div>

                    <div className="divide-y divide-gray-200">
                        <div className="py-3">
                            <h2 className="text-sm font-medium text-gray-500">Penyakit</h2>
                            <p className="text-lg font-semibold text-gray-900">
                                {riwayat.penyakit ?? "Tidak diketahui"}
                            </p>
                        </div>

                        <div className="py-3">
                            <h2 className="text-sm font-medium text-gray-500">Gejala</h2>
                            <p className="text-gray-800 text-base">{riwayat.gejala}</p>
                        </div>

                        <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <h2 className="text-sm font-medium text-gray-500">Tanggal Mulai</h2>
                                <p className="text-gray-800 text-base">
                                    {formatDate(riwayat.tanggal_mulai)}
                                </p>
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-gray-500">Tanggal Sembuh</h2>
                                <p className="text-gray-800 text-base">
                                    {riwayat.tanggal_sembuh != 0 ? formatDate(riwayat.tanggal_sembuh) : "Belum sembuh"}
                                </p>
                            </div>
                        </div>

                        {riwayat.catatan_dokter && (
                            <div className="py-3">
                                <h2 className="text-sm font-medium text-gray-500">Catatan Dokter</h2>
                                <p className="text-gray-800 text-base">
                                    {riwayat.catatan_dokter.length !== 0 ? riwayat.catatan_dokter : "Tidak ada"}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white text-base text-gray-700 border border-gray-300 font-semibold py-2 px-5 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer"
                        >
                            Tutup
                        </button>
                        <button
                            onClick={() => setEditOpen(true)}
                            className="flex-1 bg-white text-base text-gray-700 border border-gray-300 font-semibold py-2 px-5 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setConfirmOpen(true)}
                            className="cursor-pointer flex-1 px-4 py-2 text-base bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
            <ConfirmDeleteModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
            {editOpen && (
                <Edit
                    riwayat={riwayat}
                    idx={riwayat.index}
                    user={user}
                    onClose={() => setEditOpen(false)}
                    onCloseDetail={onClose}
                    refresh={refresh}
                    onUpdated={(updated) => setRiwayatDetail(updated)}
                    setMessage={setMessage}
                    setSuccess={setSuccess}
                />
            )}
        </>
    );
};

export default Detail;
