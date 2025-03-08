"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useFilterStore } from "@/store";
import { fetchLlmGenAgeGenderData, fetchStateAgeGenderData } from "@/services/api";

// Dynamically import Plotly to prevent SSR issues in Next.js
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const AgeGenderData: React.FC = () => {
    const { masterState, masterEndDate, masterStartDate } = useFilterStore(); // Get selected state from Zustand store
    const [ageGenderData, setAgeGenderData] = useState<{ absolute: number; age_group: string; gender: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [llmAnalysis, setLlmAnalysis] = useState<string | null>(null);
    const [llmLoading, setLlmLoading] = useState(false);

    useEffect(() => {
        if (!masterState) return;

        setLlmAnalysis(null);

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
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        };

        fetchData();
    }, [masterState, masterStartDate, masterEndDate]);

    const handleAnalysisClick = async () => {
        if (!masterState) return;

        setLlmLoading(true);
        setLlmAnalysis(null);

        try {
            const result = await fetchLlmGenAgeGenderData({
                fromDate: masterStartDate,
                toDate: masterEndDate,
                kvRegion: masterState.name,
                data: ageGenderData
            });

            if (result && result.response) {
                setLlmAnalysis(result.response);
            } else {
                setLlmAnalysis("No analysis available");
            }
        } catch (error) {
            console.error('Error fetching LLM analysis:', error);
            setLlmAnalysis("Error fetching analysis");
        } finally {
            setLlmLoading(false);
        }
    };

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
        <div className="border rounded shadow bg-white p-4 mt-6 min-h-[600px]">
            <h3 className="text-lg font-semibold mb-2">Age & Gender-Based Vaccination Data</h3>

            {loading ? (
                <div className="flex-grow bg-white p-4 flex flex-col items-center justify-center h-[555px] w-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                    <p className="mt-4 text-gray-600 animate-pulse">Loading map data...</p>
                </div>
            ) : ageGenderData.length === 0 ? (
                <div className="text-center">No data available</div>
            ) : <>
                <Plot data={plotData} layout={layout} config={{ responsive: true }} style={{ width: "100%", height: "500px" }} />

                <div className="mt-4">
                    <button
                        onClick={handleAnalysisClick}
                        disabled={llmLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {llmLoading ? "Generating Analysis..." : "Generate AI Analysis"}
                    </button>
                </div>

                {llmLoading && (
                    <div className="mt-4 text-center">
                        <p>Analyzing data, please wait...</p>
                    </div>
                )}

                {llmAnalysis && (
                    <div className="mt-4 p-4 border rounded bg-gray-50">
                        <h4 className="font-semibold mb-2">AI Analysis</h4>
                        <div className="whitespace-pre-line">{llmAnalysis}</div>
                    </div>
                )}
            </>}
        </div>
    );
};

export default AgeGenderData;
