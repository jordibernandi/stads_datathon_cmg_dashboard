"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { fetchStateAgeRiskData } from "@/services/api"; // Assuming same API fetch function
import { useFilterStore } from "@/store";


// Dynamically import Plotly to prevent SSR issues in Next.js
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const AgeRiskData: React.FC = () => {
    const { masterState, masterEndDate, masterStartDate } = useFilterStore(); // Get selected state from Zustand store
    const [ageRiskData, setAgeRiskData] = useState<{ absolute: number; age_group: string; risk_groups: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!masterState) return; // Exit if no state is selected

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchStateAgeRiskData({ fromDate: masterStartDate, toDate: masterEndDate, kvRegion: masterState.name }); // Pass state ID
                if (data) {
                    setAgeRiskData(data);
                }
            } catch (error) {
                console.error('Error fetching state data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [masterState, masterStartDate, masterEndDate]);

    // Get unique risk groups
    const riskGroups = Array.from(new Set(ageRiskData.map((item) => item.risk_groups)));

    // Prepare Plotly Data
    const plotData = riskGroups.map((group) => ({
        x: ageRiskData.filter((d) => d.risk_groups === group).map((d) => d.age_group), // Age Groups on X-axis
        y: ageRiskData.filter((d) => d.risk_groups === group).map((d) => d.absolute), // Absolute Values on Y-axis
        type: "bar" as const,
        name: group, // Grouping by Risk Group
    }));

    // Define layout for the chart
    const layout = {
        title: "Vaccinations by Age Group and Risk Group",
        xaxis: { title: "Age Group" },
        yaxis: { title: "Number of Vaccinations" },
        barmode: "group", // Grouped bar chart
    };

    return (
        <div className="border rounded shadow bg-white p-4 mt-6">
            <h3 className="text-lg font-semibold mb-2">Risk Group Vaccination Data</h3>

            {loading ? (
                <div className="text-center">Loading data...</div>
            ) : ageRiskData.length === 0 ? (
                <div className="text-center">No data available</div>
            ) : (
                <Plot
                    data={plotData}
                    layout={layout}
                    config={{ responsive: true }}
                    style={{ width: "100%" }}
                />
            )}
        </div>
    );
};

export default AgeRiskData;
