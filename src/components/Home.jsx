import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";

export default function Home() {
    const navigate = useNavigate();
    const [latest, setLatest] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const list = await window.electronAPI.getLatestAssessments(5);
                setLatest(list);
            } catch (err) {
                console.error("Error loading latest assessments", err);
            }
        })();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue10 via-blue10 to-white flex flex-col items-center py-12 px-6">
            {/* SYNAPPS Banner */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold tracking-tight text-blue1 mb-2">
                    <span className="bg-gradient-to-r from-blue4 to-blue3 bg-clip-text text-transparent">
                        SYNAPSS
                    </span>
                </h1>
                <p className="text-blue3 font-semibold mb-1">
                    Symptom Nature And Profile Scale for Schizophrenia
                </p>
            </div>

            <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-blue9 mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold text-blue3">
                        Welcome
                    </h1>
                    <div>
                        <button
                            onClick={async () => {
                                if (
                                    !confirm(
                                        "Delete all data? This cannot be undone."
                                    )
                                )
                                    return;
                                
                                // Make the operation non-blocking
                                try {
                                    const res =
                                        await window.electronAPI.forceResetDatabase();
                                    if (res && res.success) {
                                        setLatest([]);
                                        // Success - no blocking alert
                                        console.log("Database cleared successfully");
                                    } else {
                                        console.error(
                                            "Failed to clear DB: " +
                                                (res?.error || "unknown")
                                        );
                                    }
                                } catch (err) {
                                    console.error("Force reset error", err);
                                }
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Reset DB
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <button
                        onClick={() => navigate("/search")}
                        className="p-6 bg-white rounded-xl border border-blue8 hover:shadow-md flex flex-col items-center gap-2"
                    >
                        <Search />
                        <div className="font-medium">Search Patients</div>
                    </button>

                    <button
                        onClick={() => navigate("/add-assessment")}
                        className="p-6 bg-white rounded-xl border border-blue8 hover:shadow-md flex flex-col items-center gap-2"
                    >
                        <Plus />
                        <div className="font-medium">Add Assessment</div>
                    </button>

                    <div className="p-6 bg-white rounded-xl border border-blue8">
                        <div className="font-medium mb-2">
                            Last 5 Assessments
                        </div>
                        <div className="space-y-2">
                            {latest.length === 0 && (
                                <div className="text-sm text-blue5">
                                    No recent assessments
                                </div>
                            )}
                            {latest.map((a) => (
                                <div
                                    key={a.id}
                                    className="flex items-center justify-between"
                                >
                                    <div>
                                        <div className="font-medium">
                                            {a.patientName ||
                                                a.patient_id ||
                                                "Unknown"}
                                        </div>
                                        <div className="text-sm text-blue6">
                                            {new Date(a.date).toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    "/patient-assessments",
                                                    {
                                                        state: {
                                                            patientId:
                                                                a.patient_id,
                                                            patientName:
                                                                a.patientName,
                                                        },
                                                    }
                                                )
                                            }
                                            className="px-3 py-1 bg-blue4 text-white rounded-lg"
                                        >
                                            Open
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
