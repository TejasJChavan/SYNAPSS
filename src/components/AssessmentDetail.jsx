import { useNavigate, useLocation } from "react-router-dom";
import ChartView from "./ChartView";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function AssessmentDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { assessment, patientId, patientName } = location.state || {};

    if (!assessment) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue10 via-blue10 to-white flex flex-col items-center justify-center py-12 px-6">
                <p className="text-blue5 text-lg mb-4">
                    No assessment data found
                </p>
                <button
                    onClick={() => navigate("/search")}
                    className="px-6 py-3 bg-blue4 text-white rounded-lg hover:bg-blue3 transition-all"
                >
                    Back to Search
                </button>
            </div>
        );
    }

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

    // Ensure scores are parsed if they come as a string
    const scores =
        typeof assessment.scores === "string"
            ? JSON.parse(assessment.scores)
            : assessment.scores || {};
    const assessmentDate = assessment.date;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue10 via-blue10 to-white flex flex-col items-center py-12 px-6">
            {/* Header */}
            <div className="text-left mb-6 w-full max-w-6xl">
                <h1 className="text-2xl font-semibold text-blue3 mb-1">
                    Assessment Details
                </h1>
                <div className="flex items-center gap-4 text-blue4">
                    {patientName && (
                        <div className="flex items-center gap-2">
                            <User size={20} />
                            <span className="text-lg font-semibold">
                                {patientName}
                            </span>
                        </div>
                    )}
                    {assessmentDate && (
                        <div className="flex items-center gap-2">
                            <Calendar size={20} />
                            <span className="text-lg">
                                {formatDate(assessmentDate)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-6xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-blue9 mb-8">
                {/* Back Button */}
                <button
                    onClick={() =>
                        navigate("/patient-assessments", {
                            state: { patientId, patientName },
                        })
                    }
                    className="mb-6 px-4 py-2 text-blue6 bg-blue9 rounded-lg hover:bg-blue8 transition-all flex items-center gap-2"
                >
                    <ArrowLeft size={18} />
                    Back to Assessments
                </button>

                {/* Chart Section */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-blue1 mb-6 border-b pb-2">
                        Assessment Visualization
                    </h3>
                    <div className="flex justify-center w-full">
                        <ChartView scores={scores} />
                    </div>
                </div>

                {/* Scores Breakdown */}
                {Object.keys(scores).length > 0 && (
                    <div>
                        <h3 className="text-2xl font-bold text-blue1 mb-6 border-b pb-2">
                            Detailed Scores
                        </h3>
                        <div className="space-y-6">
                            {Object.entries(scores).map(([domain, params]) => (
                                <div
                                    key={domain}
                                    className="border border-blue8 rounded-xl p-6 bg-gradient-to-br from-white to-blue10"
                                >
                                    <h4 className="text-xl font-semibold text-blue1 mb-4 bg-gradient-to-r from-blue4 to-blue3 text-white px-4 py-2 rounded-lg">
                                        {domain}
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {Object.entries(params).map(
                                            ([param, score]) => (
                                                <div
                                                    key={param}
                                                    className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-blue8"
                                                >
                                                    <span className="text-blue6 font-medium">
                                                        {param}
                                                    </span>
                                                    <span className="text-blue4 font-bold text-lg">
                                                        {score}
                                                    </span>
                                                </div>
                                            )
                                        )}
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
