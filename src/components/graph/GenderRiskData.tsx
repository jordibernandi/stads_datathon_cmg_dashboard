"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useFilterStore } from "@/store"; // Zustand store
import { fetchStateGenderRiskData } from "@/services/api"; // Assuming same API fetch function

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const GenderRiskData: React.FC = () => {
    const { masterState, masterEndDate, masterStartDate } = useFilterStore(); // Get selected state from Zustand store
    const [genderRiskData, setGenderRiskData] = useState<{ absolute: number; gender: string; risk_groups: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!masterState) return; // Exit if no state is selected

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchStateGenderRiskData({ fromDate: masterStartDate, toDate: masterEndDate, kvRegion: masterState.name }); // Pass state ID
                if (data) {
                    setGenderRiskData(data);
                }
            } catch (error) {
                console.error('Error fetching state data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [masterState, masterStartDate, masterEndDate]);

    // Prepare Plotly Data (Group by Gender)
    const plotData = ["f", "m"].map((gender) => ({
        x: genderRiskData.filter((d) => d.gender === gender).map((d) => d.risk_groups),
        y: genderRiskData.filter((d) => d.gender === gender).map((d) => d.absolute),
        type: "bar" as const,
        name: gender === "f" ? "Female" : "Male",
    }));

    // Define layout for the chart
    const layout = {
        title: `Vaccinations by Gender & Risk Group (${masterState?.name || "Select a State"})`,
        xaxis: { title: "Risk Group" },
        yaxis: { title: "Number of Vaccinations" },
        barmode: "group",
    };

    return (
        <div className="border rounded shadow bg-white p-4 mt-6">
            <h3 className="text-lg font-semibold mb-2">Gender-Based Risk Group Vaccination Data</h3>

            {loading ? (
                <div className="text-center">Loading data...</div>
            ) : genderRiskData.length === 0 ? (
                <div className="text-center">No data available</div>
            ) : (
                <Plot data={plotData} layout={layout} config={{ responsive: true }} style={{ width: "80%", height: "500px" }} />
            )}
        </div>
    );
};

export default GenderRiskData;
