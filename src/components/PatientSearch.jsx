import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Calendar } from "lucide-react";

export default function PatientSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setError("Please enter a search term");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const patients = await window.electronAPI.searchPatients(
                searchTerm
            );
            setResults(patients);
            if (patients.length === 0) {
                setError("No patients found");
            }
        } catch (err) {
            console.error("Search error:", err);
            setError("Error searching patients: " + err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleSelectPatient = (patientId, patientName) => {
        navigate("/patient-assessments", {
            state: { patientId, patientName },
            replace: false,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue10 via-blue10 to-white flex flex-col items-center py-12 px-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-blue3 mb-1">
                    Patient Search
                </h1>
                <p className="text-blue4 text-sm">
                    Search for patients by ID or name
                </p>
            </div>

            {/* Search Card */}
            <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-blue9 mb-10">
                {/* Search Input */}
                <div className="flex items-center space-x-4 mb-6">
                    <Search className="text-blue4" size={28} />
                    <div className="flex-1 flex items-center space-x-3">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter patient ID or name..."
                            className="flex-1 px-4 py-3 text-lg border border-blue8 rounded-xl focus:border-blue5 focus:ring-2 focus:ring-blue8 transition-all duration-200 shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={handleSearch}
                            disabled={loading}
                            className="px-6 py-3 bg-blue4 text-white rounded-xl hover:bg-blue3 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Search size={20} />
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </div>

                {error && <p className="mt-2 text-blue5">{error}</p>}

                {/* Results */}
                {results.length > 0 && (
                    <div className="space-y-4 mt-6">
                        <h2 className="text-xl font-semibold text-blue1 mb-4">
                            Search Results ({results.length})
                        </h2>
                        <div className="space-y-3">
                            {results.map((patient) => (
                                <div
                                    key={patient.patient_id}
                                    onClick={() =>
                                        handleSelectPatient(
                                            patient.patient_id,
                                            patient.name
                                        )
                                    }
                                    className="bg-gradient-to-r from-white to-blue10 rounded-xl shadow-md hover:shadow-xl p-6 border border-blue8 hover:border-blue6 transition-all cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <User
                                                    className="text-blue4"
                                                    size={20}
                                                />
                                                <h3 className="text-lg font-semibold text-blue1">
                                                    {patient.name || "Unknown"}
                                                </h3>
                                            </div>
                                            <div className="ml-8 space-y-1 text-blue4">
                                                <p>
                                                    <span className="font-medium">
                                                        Patient ID:
                                                    </span>{" "}
                                                    {patient.patient_id}
                                                </p>
                                                {patient.age && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Age:
                                                        </span>{" "}
                                                        {patient.age}
                                                    </p>
                                                )}
                                                {patient.gender && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Gender:
                                                        </span>{" "}
                                                        {patient.gender}
                                                    </p>
                                                )}
                                                {patient.notes && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Notes:
                                                        </span>{" "}
                                                        {patient.notes}
                                                    </p>
                                                )}
                                                {patient.created_at && (
                                                    <p className="flex items-center gap-1 text-sm text-blue6">
                                                        <Calendar size={14} />
                                                        Added:{" "}
                                                        {new Date(
                                                            patient.created_at
                                                        ).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectPatient(
                                                    patient.patient_id,
                                                    patient.name
                                                );
                                            }}
                                            className="px-4 py-2 bg-blue4 text-white rounded-lg hover:bg-blue3 transition-all"
                                        >
                                            View Assessments
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Back Button */}
            <button
                onClick={() => navigate("/")}
                className="px-6 py-3 text-lg font-semibold text-blue6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-blue8"
            >
                Back to Assessment
            </button>
        </div>
    );
}
