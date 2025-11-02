import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";
import chartColors from "../data/chartColors";
import { rgba } from "../data/colors";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

// Use the vibrant chart palette (chartColors). Each domain gets a distinct color
const getColorForDomainIndex = (index) => {
    const color = chartColors[index % chartColors.length];
    return {
        backgroundColor: rgba(color, 0.25),
        borderColor: color,
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
    };
};

export default function ChartView({ scores }) {
    const domains = Object.keys(scores);
    if (!domains.length) return null;

    // Prepare data arrays for continuous plotting
    const allParameters = [];
    const parametersByDomain = new Map();
    let startIndex = 0;

    // First, collect all parameters and their indices
    domains.forEach((domain) => {
        const paramNames = Object.keys(scores[domain]);
        parametersByDomain.set(domain, {
            start: startIndex,
            end: startIndex + paramNames.length - 1,
        });
        paramNames.forEach((param) => {
            allParameters.push({
                domain,
                param,
                value: scores[domain][param],
            });
        });
        startIndex += paramNames.length;
    });

    // Create one dataset per domain that includes connection to next domain
    const datasets = domains.map((domain, domainIndex) => {
        const colors = getColorForDomainIndex(domainIndex);
        const { start, end } = parametersByDomain.get(domain);
        const nextDomain = domains[(domainIndex + 1) % domains.length];
        const nextStart = parametersByDomain.get(nextDomain).start;

        // Get values for this domain plus first point of next domain for connection
        const data = Array(allParameters.length).fill(null);
        for (let i = start; i <= end; i++) {
            data[i] = allParameters[i].value;
        }
        // Add first point of next domain to connect the line
        data[nextStart] = allParameters[nextStart].value;

        return {
            label: domain,
            data: data,
            backgroundColor: colors.backgroundColor,
            borderColor: colors.borderColor,
            borderWidth: 2,
            pointBackgroundColor: colors.pointBackgroundColor,
            pointBorderColor: colors.pointBorderColor,
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: colors.borderColor,
            fill: true,
        };
    });

    // Create labels array with domain names at the correct positions
    const labels = allParameters.map((param, index) => {
        // Check if this is the middle parameter of the domain
        const domainBounds = parametersByDomain.get(param.domain);
        const domainMiddle = Math.floor(
            (domainBounds.start + domainBounds.end) / 2
        );
        return index === domainMiddle ? param.domain : "";
    });

    const data = {
        labels: labels,
        datasets: datasets,
    };

    const options = {
        indexAxis: "y", // Horizontal bar chart
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                beginAtZero: true,
                min: 0,
                max: 4,
                ticks: {
                    stepSize: 1,
                    font: {
                        size: 12,
                    },
                    callback: function (value) {
                        if (value === 0) return "Absent";
                        if (value === 1) return "Mild";
                        if (value === 2) return "Moderate";
                        if (value === 3) return "Severe";
                        if (value === 4) return "Extreme";
                        return value;
                    },
                },
                grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                },
                angleLines: {
                    color: "rgba(0, 0, 0, 0.1)",
                },
                pointLabels: {
                    font: {
                        size: 14,
                        weight: "bold",
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const paramInfo = allParameters[context.dataIndex];
                        if (!paramInfo || !context.parsed.r) return null;
                        return `${paramInfo.domain} - ${
                            paramInfo.param
                        }: ${context.parsed.r.toFixed(2)}`;
                    },
                    afterLabel: function (context) {
                        const value = Math.round(context.parsed.r || 0);
                        if (value === 0) return "Absent";
                        if (value === 1) return "Mild";
                        if (value === 2) return "Moderate";
                        if (value === 3) return "Severe";
                        if (value === 4) return "Extreme";
                        return "";
                    },
                },
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                padding: 12,
                titleFont: {
                    size: 13,
                    weight: "bold",
                },
                bodyFont: {
                    size: 12,
                },
            },
        },
    };

    return (
        <div style={{ width: "100%", maxWidth: "1200px", margin: "40px auto" }}>
            {/* Domain Legend */}
            <div className="mb-6 flex flex-wrap gap-3 justify-center">
                {domains.map((domain, idx) => {
                    const c = getColorForDomainIndex(idx);
                    return (
                        <div
                            key={domain}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2"
                            style={{
                                borderColor: c.borderColor,
                                backgroundColor: c.backgroundColor,
                            }}
                        >
                            <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: c.borderColor }}
                            />
                            <span
                                className="font-semibold text-sm"
                                style={{ color: c.borderColor }}
                            >
                                {domain}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Chart Container */}
            <div className="relative h-[600px] w-full">
                <Radar data={data} options={options} />
            </div>
        </div>
    );
}
