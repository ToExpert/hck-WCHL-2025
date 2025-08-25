import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Create = ({ user, setMessage, setSuccess }) => {
    const navigate = useNavigate();

    const [record, setRecord] = useState({
        startDate: "",
        endDate: "",
        symptoms: "",
        diagnosis: "",
        doctorNote: ""
    });

    const handleChange = (e) => {
        setRecord({ ...record, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const principal = user.authClient.getIdentity().getPrincipal();

            await user.actor.putRiwayat(
                principal,
                record.diagnosis === "" ? [] : [record.diagnosis],
                record.symptoms,
                BigInt(new Date(record.startDate).getTime() * 1_000_000),
                record.endDate === "" ? [] : [BigInt(new Date(record.endDate).getTime() * 1_000_000)],
                record.doctorNote === "" ? [] : [record.doctorNote]
            );

            setMessage("Catatan berhasil disimpan!");
            setSuccess(true);
            navigate("/dashboard");
        } catch (err) {
            setMessage("Gagal menyimpan catatan!");
            setSuccess(false);
        }
    };

    return (
        <>
            <div className="relative isolate bg-white">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] 
                                    -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr 
                                    from-[#ff8080] to-[#f55050] opacity-20 
                                    sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]">
                    </div>
                </div>

                <main className="flex-grow flex items-center justify-center z-10 py-12">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
                            <div className="text-center mb-8">
                                <h1 className="text-xl sm:text-3xl font-semibold text-red-600 mb-1">
                                    Catatan Kesehatan Baru
                                </h1>
                                <p className="text-gray-500 text-base">
                                    Isi detail di bawah ini untuk memulai pelacakan.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 min-w-full">
                                <div className="w-full">
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tanggal Mulai Sakit <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={record.startDate}
                                        onChange={handleChange}
                                        name="startDate"
                                        type="date"
                                        id="startDate"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                                   focus:ring-red-500 focus:border-red-500 transition text-base"
                                    />
                                </div>

                                <div className="w-full">
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tanggal Sembuh (Opsional)
                                    </label>
                                    <input
                                        value={record.endDate}
                                        onChange={handleChange}
                                        name="endDate"
                                        type="date"
                                        id="endDate"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                                   focus:ring-red-500 focus:border-red-500 transition text-base"
                                    />
                                </div>

                                <div className="w-full">
                                    <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                                        Gejala yang Dirasakan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={record.symptoms}
                                        onChange={handleChange}
                                        name="symptoms"
                                        id="symptoms"
                                        rows="4"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                                   focus:ring-red-500 focus:border-red-500 transition text-base"
                                        placeholder="Contoh: Demam tinggi..."
                                    />
                                </div>

                                <div className="w-full">
                                    <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
                                        Diagnosis Penyakit (Opsional)
                                    </label>
                                    <input
                                        value={record.diagnosis}
                                        onChange={handleChange}
                                        name="diagnosis"
                                        type="text"
                                        id="diagnosis"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                                   focus:ring-red-500 focus:border-red-500 transition text-base"
                                        placeholder="Contoh: Influenza Tipe A"
                                    />
                                </div>

                                <div className="w-full">
                                    <label htmlFor="doctorNote" className="block text-sm font-medium text-gray-700">
                                        Catatan Dokter (Opsional)
                                    </label>
                                    <textarea
                                        value={record.doctorNote}
                                        onChange={handleChange}
                                        name="doctorNote"
                                        id="doctorNote"
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                                   focus:ring-red-500 focus:border-red-500 transition text-base"
                                        placeholder="Catatan tambahan dari dokter..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full text-base bg-red-500 text-white font-semibold py-2.5 px-6 
                                               rounded-lg hover:bg-red-600 transition cursor-pointer"
                                >
                                    Simpan Catatan
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>

            <Link
                to="/dashboard"
                className="fixed bottom-6 right-6 h-14 w-14 bg-red-500 rounded-full 
                           flex items-center justify-center text-white shadow-lg 
                           hover:bg-red-600 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </Link>
        </>
    );
};

export default Create;
