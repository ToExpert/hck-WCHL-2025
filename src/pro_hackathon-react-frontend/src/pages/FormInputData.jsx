import { useState } from "react";

const FormInputData = ({ user, onSaved }) => {
    const [nama, setNama] = useState("");

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const principal = user.authClient.getIdentity().getPrincipal();
            await user.actor.putUserName(principal, nama);
            onSaved(nama);
        } catch (err) {
            console.error("Gagal simpan nama:", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md p-8 mx-4 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-200">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Selamat Datang!</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Untuk melanjutkan, mohon lengkapi profil Anda dengan mengisi nama lengkap.
                    </p>
                </div>

                <form onSubmit={handleProfileSubmit}>
                    <div className="w-full">
                        <label htmlFor="nama" className="block mb-2 text-sm font-medium text-gray-800">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            id="nama"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                            placeholder="Masukkan nama lengkap Anda"
                            className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-300"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-2 px-4 py-1.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-300 ease-in-out cursor-pointer text-base"
                    >
                        Simpan Profil
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormInputData;
