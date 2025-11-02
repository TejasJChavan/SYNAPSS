import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export default function Header() {
    const navigate = useNavigate();
    return (
        <div className="w-full bg-white/90 border-b border-blue9 py-3 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-blue4 hover:text-blue3"
                >
                    <Home />
                    <span className="font-semibold">Home</span>
                </button>
            </div>
        </div>
    );
}
