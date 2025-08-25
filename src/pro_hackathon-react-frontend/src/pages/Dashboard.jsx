import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import FormInputData from "./FormInputData";
import Detail from "./Detail";

const Dashboard = ({ user, logout, message, success, setMessage, setSuccess }) => {
    const [nama, setNama] = useState(null);
    const [riwayat, setRiwayat] = useState([]);
    const [selectedRiwayat, setSelectedRiwayat] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (user && user.actor) {
                try {
                    const principal = user.authClient.getIdentity().getPrincipal();

                    const resNama = await user.actor.getUserName(principal);
                    setNama(resNama ?? null);

                    const resRiwayat = await user.actor.getAllRiwayat(principal);
                    setRiwayat(resRiwayat);
                } catch (err) {
                    console.error("Gagal ambil data:", err);
                }
            }
        };

        fetchData();
    }, [user]);

    const refresh = async () => {
        if (user && user.actor) {
            try {
                const principal = user.authClient.getIdentity().getPrincipal();

                const resNama = await user.actor.getUserName(principal);
                setNama(resNama ?? null);

                const resRiwayat = await user.actor.getAllRiwayat(principal);
                setRiwayat(resRiwayat);
            } catch (err) {
                console.error("Gagal ambil data:", err);
            }
        }
    };

    useEffect(() => {
        refresh();
    }, [user]);


    return (
        <>
            <Detail open={openModal} onClose={() => setOpenModal(false)} riwayat={selectedRiwayat} user={user} refresh={refresh} setMessage={setMessage} setSuccess={setSuccess}/>
            {nama === null && (
                <FormInputData user={user} onSaved={setNama} setMessage={setMessage} setSuccess={setSuccess}  />
            )}
            <div className="relative isolate bg-white min-h-screen">
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                >
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem]
                        -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff8080]
                        to-[#f55050] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
                </div>

                <main className="z-10 py-12">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left mb-10">
                            <div>
                                <h1 className="text-3xl font-semibold text-gray-900">Dashboard De-Health <span className="italic">({nama})</span></h1>
                                <p className="mt-2 text-lg text-gray-600">
                                    Semua catatan riwayat kesehatanmu yang tersimpan.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                <Link to="/create"
                                    className="bg-red-500 text-white text-base font-semibold py-2 px-5 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out inline-block cursor-pointer">
                                    + Catatan Baru
                                </Link>
                                <button
                                    onClick={logout}
                                    className="bg-white text-base text-gray-700 border border-gray-300 font-semibold py-2 px-5 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>

                        {message && (
                            <div
                                className={`absolute bottom-0 right-10 min-w-80 mb-6 p-3 rounded-lg text-sm font-medium ${success ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"
                                    }`}
                            >
                                {message}
                            </div>
                        )}


                        {riwayat.length === 0 ? (
                            <div className="text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg p-12">
                                <p className="font-semibold text-2xl">Belum Ada Catatan</p>
                                <p className="text-sm mt-2 mb-6">
                                    Kamu belum memiliki catatan kesehatan. Buat yang pertama sekarang!
                                </p>
                                <Link to="/create"
                                    className="bg-red-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-600">
                                    + Buat Catatan Pertama
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {riwayat.map((rec, idx) => {
                                    const penyakit = rec.penyakit.length === 0 ? "Tidak diketahui" : rec.penyakit[0];
                                    const status = rec.tanggal_sembuh.length === 0 ? "Aktif" : "Selesai";
                                    const start = new Date(Number(rec.tanggal_mulai) / 1_000_000).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
                                    const end = rec.tanggal_sembuh.length === 0
                                        ? "Sekarang"
                                        : new Date(Number(rec.tanggal_sembuh[0]) / 1_000_000).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
                                    return (
                                        <div key={idx} className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl shadow-md p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
                                            <div className="flex justify-between items-start mb-4">
                                                <h2 className="text-xl font-semibold text-gray-800 break-words pr-2">
                                                    {penyakit}
                                                </h2>
                                                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${status === "Aktif" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                                                    {status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-base mb-4 flex-grow">{rec.gejala}</p>
                                            <div className="border-t border-gray-200 pt-4 mt-auto">
                                                <div className="text-sm text-gray-500 mb-4">
                                                    <p>
                                                        Periode:
                                                        <span className="font-medium text-gray-700">
                                                            {start} - {end}
                                                        </span>
                                                    </p>
                                                </div>
                                                <button onClick={() => {
                                                    setSelectedRiwayat({ ...rec, index: idx });
                                                    setOpenModal(true);
                                                }}
                                                    href=""
                                                    className="w-full text-center bg-white text-red-500 border border-red-500 font-semibold py-2 px-4 rounded-lg hover:bg-red-50 hover:text-red-600 transition duration-300 ease-in-out block text-sm cursor-pointer">
                                                    Lihat Detail
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default Dashboard;