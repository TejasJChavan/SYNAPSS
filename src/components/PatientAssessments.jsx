import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, ArrowLeft, FileText } from "lucide-react";

export default function PatientAssessments() {
    const location = useLocation();
    const navigate = useNavigate();
    const { patientId, patientName } = location.state || {};
    const [patientDetails, setPatientDetails] = useState(null);
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (patientId) {
            loadAssessments();
            // also load patient details (to show notes)
            (async () => {
                try {
                    const p = await window.electronAPI.getPatient(patientId);
                    setPatientDetails(p);
                } catch (err) {
                    console.error("Error fetching patient details:", err);
                }
            })();
        } else {
            setError("No patient ID provided");
        }
    }, [patientId]);

    const loadAssessments = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await window.electronAPI.getAssessments(patientId);
            // Parse scores if they come as strings (JSONB should already be parsed, but just in case)
            const parsedData = data.map((assessment) => ({
                ...assessment,
                scores:
                    typeof assessment.scores === "string"
                        ? JSON.parse(assessment.scores)
                        : assessment.scores,
            }));
            setAssessments(parsedData);
            if (parsedData.length === 0) {
                setError("No assessments found for this patient");
            }
        } catch (err) {
            console.error("Error loading assessments:", err);
            setError("Error loading assessments: " + err.message);
            setAssessments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewAssessment = (assessment) => {
        navigate("/assessment-detail", {
            state: {
                assessment,
                patientId,
                patientName,
            },
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown date";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue10 via-blue10 to-white flex flex-col items-center py-12 px-6">
            {/* Header */}
            <div className="text-left mb-6 w-full max-w-6xl">
                <h1 className="text-2xl font-semibold text-blue3 mb-1">
                    Patient Assessments
                </h1>
                {patientName && (
                    <p className="text-blue6 text-lg font-medium mb-1">
                        {patientName}
                    </p>
                )}
                {patientDetails?.notes && (
                    <p className="text-blue4 mb-2">
                        <span className="font-medium">Notes:</span>{" "}
                        {patientDetails.notes}
                    </p>
                )}
                <p className="text-blue5 text-lg font-medium">
                    Patient ID: {patientId}
                </p>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-blue9 mb-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/search")}
                    className="mb-6 px-4 py-2 text-blue6 bg-blue9 rounded-lg hover:bg-blue8 transition-all flex items-center gap-2"
                >
                    <ArrowLeft size={18} />
                    Back to Search
                </button>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue4"></div>
                        <p className="mt-4 text-blue4">
                            Loading assessments...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-12">
                        <p className="text-blue5 text-lg">{error}</p>
                        {error.includes("No assessments found") && (
                            <button
                                onClick={() =>
                                    navigate("/", { state: { patientId } })
                                }
                                className="mt-4 px-6 py-3 bg-blue4 text-white rounded-lg hover:bg-blue3 transition-all"
                            >
                                Create New Assessment
                            </button>
                        )}
                    </div>
                )}

                {/* Assessments List */}
                {!loading && !error && assessments.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-blue1 mb-6">
                            Assessment History ({assessments.length})
                        </h2>
                        <div className="space-y-3">
                            {assessments.map((assessment, index) => (
                                <div
                                    key={assessment.id || index}
                                    onClick={() =>
                                        handleViewAssessment(assessment)
                                    }
                                    className="bg-gradient-to-r from-white to-blue10 rounded-xl shadow-md hover:shadow-xl p-6 border border-blue8 hover:border-blue6 transition-all cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <FileText
                                                    className="text-blue4"
                                                    size={24}
                                                />
                                                <h3 className="text-xl font-semibold text-blue1">
                                                    Assessment #
                                                    {assessments.length - index}
                                                </h3>
                                            </div>
                                            <div className="ml-10 space-y-2 text-blue4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar
                                                        size={16}
                                                        className="text-blue5"
                                                    />
                                                    <span className="font-medium">
                                                        Date:{" "}
                                                        {formatDate(
                                                            assessment.date
                                                        )}
                                                    </span>
                                                </div>
                                                {assessment.scores && (
                                                    <div className="mt-3">
                                                        <p className="text-sm font-medium text-blue6 mb-1">
                                                            Domains Assessed:
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {Object.keys(
                                                                assessment.scores
                                                            ).map((domain) => (
                                                                <span
                                                                    key={domain}
                                                                    className="px-3 py-1 bg-blue10 text-blue3 rounded-full text-xs font-medium"
                                                                >
                                                                    {domain}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewAssessment(
                                                    assessment
                                                );
                                            }}
                                            className="px-6 py-3 bg-blue4 text-white rounded-lg hover:bg-blue3 transition-all flex items-center gap-2"
                                        >
                                            <FileText size={18} />
                                            View Details
                                        </button>
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (
                                                    !confirm(
                                                        "Delete this assessment?"
                                                    )
                                                )
                                                    return;
                                                try {
                                                    await window.electronAPI.deleteAssessment(
                                                        assessment.id
                                                    );
                                                    // reload assessments
                                                    await loadAssessments();
                                                } catch (err) {
                                                    console.error(
                                                        "Error deleting assessment:",
                                                        err
                                                    );
                                                    alert(
                                                        "Error deleting assessment: " +
                                                            err.message
                                                    );
                                                }
                                            }}
                                            className="ml-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
