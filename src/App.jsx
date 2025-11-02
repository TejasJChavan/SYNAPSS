import { useState, useEffect } from "react";
import {
    HashRouter as Router,
    Routes,
    Route,
    useNavigate,
    useLocation,
} from "react-router-dom";
import { DOMAINS } from "./data/domains";
import { getOptionsForDomainSubdomain } from "./data/domainOptions";
import ChartView from "./components/ChartView";
import ResultsPage from "./components/ResultsPage";
import PatientSearch from "./components/PatientSearch";
import PatientAssessments from "./components/PatientAssessments";
import AssessmentDetail from "./components/AssessmentDetail";
import Header from "./components/Header";
import Home from "./components/Home";
import { User, Save, Search } from "lucide-react"; // make sure lucide-react is installed

function AssessmentForm() {
    const location = useLocation();
    const [scores, setScores] = useState({});
    const [patientId, setPatientId] = useState("");
    const [patientDetails, setPatientDetails] = useState(null);
    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const [checkedId, setCheckedId] = useState(false);
    const navigate = useNavigate();

    // Handle patient ID from search page
    useEffect(() => {
        const checkPatient = async (id) => {
            try {
                const patientData = await window.electronAPI.getPatient(id);
                if (patientData) {
                    setPatientDetails(patientData);
                    setShowDetailsForm(false);
                } else {
                    setPatientDetails(null);
                    setShowDetailsForm(true);
                }
                setCheckedId(true);
            } catch (error) {
                console.error("Error checking patient:", error);
                setCheckedId(true);
                setShowDetailsForm(true);
            }
        };

        if (location.state?.patientId) {
            setPatientId(location.state.patientId);
            checkPatient(location.state.patientId);
        }
    }, [location.state]);

    const handleCheckId = async () => {
        try {
            const patientData = await window.electronAPI.getPatient(patientId);
            if (patientData) {
                setPatientDetails(patientData);
                setShowDetailsForm(false);
            } else {
                setPatientDetails(null);
                setShowDetailsForm(true);
            }
            setCheckedId(true);
        } catch (error) {
            console.error("Error checking patient:", error);
            alert("Error checking patient ID: " + error.message);
        }
    };

    const handleDetailsChange = (e) => {
        const { name, value } = e.target;
        setPatientDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleScoreChange = (domain, param, value) => {
        setScores((prev) => ({
            ...prev,
            [domain]: { ...prev[domain], [param]: Number(value) },
        }));
    };

    const saveAssessment = async () => {
        try {
            // If this is a new patient, save the patient details first
            if (showDetailsForm && patientDetails) {
                await window.electronAPI.savePatient({
                    id: patientId,
                    ...patientDetails,
                });
            }

            // Save the assessment
            await window.electronAPI.saveAssessment({ patientId, scores });
            navigate("/results", { state: { scores, patientId } });
        } catch (error) {
            console.error("Error saving:", error);
            alert("Error saving assessment: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue10 via-blue10 to-white flex flex-col items-center py-12 px-6">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-2xl font-semibold text-blue3">
                    Add Assessment Record
                </h1>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-blue9 mb-10">
                {/* Patient ID Entry */}
                <div className="flex items-center space-x-4 mb-6">
                    <User className="text-blue4" size={28} />
                    <div className="flex items-center space-x-3 flex-1">
                        <label className="text-lg font-semibold text-blue6">
                            Patient ID:
                        </label>
                        <input
                            value={patientId}
                            onChange={(e) => setPatientId(e.target.value)}
                            className="w-40 px-4 py-2 text-lg border border-blue8 rounded-xl focus:border-blue5 focus:ring-2 focus:ring-blue8 transition-all duration-200 shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={handleCheckId}
                            className="ml-2 px-4 py-2 bg-blue4 text-white rounded-lg hover:bg-blue3 transition-all"
                        >
                            Check
                        </button>
                        {/* Search button removed - accessible from home page */}
                    </div>
                </div>

                {/* Patient Details */}
                {checkedId && patientDetails && (
                    <div className="mb-8 p-4 bg-blue10 border border-blue8 rounded-xl">
                        <div className="font-semibold text-blue3 mb-2">
                            Patient Found:
                        </div>
                        <div>Name: {patientDetails.name}</div>
                        <div>Age: {patientDetails.age}</div>
                        <div>Gender: {patientDetails.gender}</div>
                        {patientDetails.notes && (
                            <div className="mt-2">
                                <div className="font-medium text-sm text-blue6">
                                    Notes:
                                </div>
                                <div className="text-sm text-blue4">
                                    {patientDetails.notes}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {checkedId && showDetailsForm && (
                    <div className="mb-8 p-4 bg-blue10 border border-blue8 rounded-xl">
                        <div className="font-semibold text-blue3 mb-2">
                            New Patient - Enter Details:
                        </div>
                        <div className="flex flex-col gap-2">
                            <input
                                name="name"
                                placeholder="Name"
                                className="px-3 py-2 border rounded-lg"
                                onChange={handleDetailsChange}
                            />
                            <input
                                name="age"
                                placeholder="Age"
                                type="number"
                                className="px-3 py-2 border rounded-lg"
                                onChange={handleDetailsChange}
                            />
                            <input
                                name="gender"
                                placeholder="Gender"
                                className="px-3 py-2 border rounded-lg"
                                onChange={handleDetailsChange}
                            />
                            <textarea
                                name="notes"
                                placeholder="Notes"
                                className="px-3 py-2 border rounded-lg"
                                rows={4}
                                onChange={handleDetailsChange}
                            />
                        </div>
                    </div>
                )}

                {/* Domains (Always show below patient info) */}
                <div className="space-y-8">
                    {Object.entries(DOMAINS).map(([domain, params]) => (
                        <div
                            key={domain}
                            className="border border-blue9 bg-gradient-to-br from-white to-blue10 
                         rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="px-6 py-4 bg-gradient-to-r from-blue4 to-blue3">
                                <h2 className="text-xl font-bold text-white tracking-wide">
                                    {domain}
                                </h2>
                            </div>

                            <div className="p-6">
                                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
                                    {params.map((param) => (
                                        <div
                                            key={param}
                                            className="bg-blue10 rounded-xl p-4 border border-blue8 hover:border-blue6 transition-colors"
                                        >
                                            <label className="block text-blue6 font-medium mb-3">
                                                {param}
                                            </label>
                                            <div className="space-y-2">
                                                {getOptionsForDomainSubdomain(domain, param).map(
                                                    (option) => (
                                                        <div
                                                            key={option.value}
                                                            className="flex items-center"
                                                        >
                                                            <input
                                                                type="radio"
                                                                id={`${domain}-${param}-${option.value}`}
                                                                name={`${domain}-${param}`}
                                                                value={
                                                                    option.value
                                                                }
                                                                onChange={(e) =>
                                                                    handleScoreChange(
                                                                        domain,
                                                                        param,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                checked={
                                                                    scores[
                                                                        domain
                                                                    ]?.[
                                                                        param
                                                                    ] ===
                                                                    option.value
                                                                }
                                                                className="w-4 h-4 text-blue4 border-blue8 focus:ring-blue5"
                                                            />
                                                            <label
                                                                htmlFor={`${domain}-${param}-${option.value}`}
                                                                className="ml-3 block"
                                                            >
                                                                <span className="font-medium text-blue6">
                                                                    {option.description || `${option.value}`}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Save Button */}
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={saveAssessment}
                        className="inline-flex items-center gap-2 px-8 py-3 text-lg font-semibold text-white 
                     bg-gradient-to-r from-blue4 to-blue3 rounded-xl shadow-lg 
                     hover:from-blue3 hover:to-blue2 transform hover:-translate-y-0.5 
                     transition-all duration-200 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-blue5"
                    >
                        <Save size={22} />
                        Save Assessment
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add-assessment" element={<AssessmentForm />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/search" element={<PatientSearch />} />
                <Route
                    path="/patient-assessments"
                    element={<PatientAssessments />}
                />
                <Route
                    path="/assessment-detail"
                    element={<AssessmentDetail />}
                />
            </Routes>
        </Router>
    );
}
