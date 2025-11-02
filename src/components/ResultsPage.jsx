import { useLocation, useNavigate } from "react-router-dom";
import ChartView from "./ChartView";

export default function ResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { scores, patientId } = location.state || {};

    const handleNewPatient = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue10 via-blue10 to-white flex flex-col items-center py-12 px-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-blue3 mb-1">
                    Assessment Results
                </h1>
                <p className="text-blue4 text-sm">Patient ID: {patientId}</p>
            </div>

            <div className="w-full max-w-6xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-blue9 mb-8">
                <h3 className="text-2xl font-bold text-blue1 mb-6 border-b pb-2">
                    Assessment Visualization
                </h3>
                <div className="flex justify-center w-full">
                    <ChartView scores={scores} />
                </div>
            </div>

            <button
                onClick={handleNewPatient}
                className="inline-flex items-center gap-2 px-8 py-3 text-lg font-semibold text-white 
                bg-gradient-to-r from-blue4 to-blue3 rounded-xl shadow-lg 
                hover:from-blue3 hover:to-blue2 transform hover:-translate-y-0.5 
                transition-all duration-200 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-blue5"
            >
                Add New Patient
            </button>
        </div>
    );
}
