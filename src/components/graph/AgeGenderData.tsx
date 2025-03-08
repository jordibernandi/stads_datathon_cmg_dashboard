"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useFilterStore } from "@/store";
import { fetchStateAgeGenderData } from "@/services/api";

// Dynamically import Plotly to prevent SSR issues in Next.js
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const AgeGenderData: React.FC = () => {
    const { masterState, masterEndDate, masterStartDate } = useFilterStore(); // Get selected state from Zustand store
    const [ageGenderData, setAgeGenderData] = useState<{ absolute: number; age_group: string; gender: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!masterState) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchStateAgeGenderData({ fromDate: masterStartDate, toDate: masterEndDate, kvRegion: masterState.name }); // Pass state ID
                if (data) {
                    setAgeGenderData(data);
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
        x: ageGenderData.filter((d) => d.gender === gender).map((d) => d.age_group),
        y: ageGenderData.filter((d) => d.gender === gender).map((d) => d.absolute),
        type: "bar" as const,
        name: gender === "f" ? "Female" : "Male",
    }));

    // Define layout for the chart
    const layout = {
        title: `Vaccinations by Age Group & Gender (${masterState?.name || "Select a State"})`,
        xaxis: { title: "Age Group" },
        yaxis: { title: "Number of Vaccinations" },
        barmode: "group",
    };

    return (
        <div className="border rounded shadow bg-white p-4 mt-6">
            <h3 className="text-lg font-semibold mb-2">Age & Gender-Based Vaccination Data</h3>

            {loading ? (
                <div className="text-center">Loading data...</div>
            ) : ageGenderData.length === 0 ? (
                <div className="text-center">No data available</div>
            ) : (
                <Plot data={plotData} layout={layout} config={{ responsive: true }} style={{ width: "80%", height: "500px" }} />
            )}
        </div>
    );
};

export default AgeGenderData;
