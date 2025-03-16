"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useFilterStore } from "@/stores/store";
import {
    fetchStateGenderRiskData,
    fetchStateAgeGenderData,
    fetchStateAgeRiskData,
    fetchLlmGenGenderRiskData,
    fetchLlmGenAgeGenderData,
    fetchLlmGenAgeRiskData
} from "@/services/api";
import { AgeGenderData } from "@/types/AgeGenderData";
import { GenderRiskData } from "@/types/GenderRiskData";
import { AgeRiskData } from "@/types/AgeRiskData";
import { StatsInputData } from "@/types/StatsInputData";
import { GraphDataType } from "@/types/GraphDataType";
import { LlmInputData } from "@/types/LlmInputData";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type VisualizationType = "genderRisk" | "ageGender" | "ageRisk";

interface GraphProps {
    type: VisualizationType;
    title: string;
    subtitle: string;
}

const Graph: React.FC<GraphProps> = ({ type, title, subtitle }) => {
    const { masterState, masterEndDate, masterStartDate } = useFilterStore();
    const [data, setData] = useState<GraphDataType>([]);
    const [loading, setLoading] = useState(false);
    const [llmAnalysis, setLlmAnalysis] = useState<string | null>(null);
    const [llmLoading, setLlmLoading] = useState(false);

    useEffect(() => {
        if (!masterState) return;
        setLlmAnalysis(null);

        const fetchData = async () => {
            setLoading(true);
            try {
                let fetchedData;
                const params: StatsInputData = { fromDate: masterStartDate, toDate: masterEndDate, kvRegion: masterState.name };

                switch (type) {
                    case "genderRisk":
                        fetchedData = await fetchStateGenderRiskData(params);
                        break;
                    case "ageGender":
                        fetchedData = await fetchStateAgeGenderData(params);
                        break;
                    case "ageRisk":
                        fetchedData = await fetchStateAgeRiskData(params);
                        break;
                }

                if (fetchedData) {
                    setData(fetchedData as GraphDataType);
                }
            } catch (error) {
                console.error(`Error fetching ${type} data:`, error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        };

        fetchData();
    }, [masterState, masterStartDate, masterEndDate, type]);

    const handleAnalysisClick = async () => {
        if (!masterState) return;
        setLlmLoading(true);
        setLlmAnalysis(null);

        try {
            let result;
            const params: LlmInputData = {
                fromDate: masterStartDate,
                toDate: masterEndDate,
                kvRegion: masterState.name,
                data: data
            };

            switch (type) {
                case "genderRisk":
                    result = await fetchLlmGenGenderRiskData(params);
                    break;
                case "ageGender":
                    result = await fetchLlmGenAgeGenderData(params);
                    break;
                case "ageRisk":
                    result = await fetchLlmGenAgeRiskData(params);
                    break;
            }

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

    const getPlotData = () => {
        switch (type) {
            case "genderRisk": {
                const genderRiskData = data as GenderRiskData[];
                return ["f", "m"].map((gender) => ({
                    x: genderRiskData.filter((d) => d.gender === gender).map((d) => d.risk_groups),
                    y: genderRiskData.filter((d) => d.gender === gender).map((d) => d.absolute),
                    type: "bar" as const,
                    name: gender === "f" ? "Female" : "Male",
                }));
            }
            case "ageGender": {
                const ageGenderData = data as AgeGenderData[];
                return ["f", "m"].map((gender) => ({
                    x: ageGenderData.filter((d) => d.gender === gender).map((d) => d.age_group),
                    y: ageGenderData.filter((d) => d.gender === gender).map((d) => d.absolute),
                    type: "bar" as const,
                    name: gender === "f" ? "Female" : "Male",
                }));
            }
            case "ageRisk": {
                const ageRiskData = data as AgeRiskData[];
                const riskGroups = Array.from(new Set(ageRiskData.map((item) => item.risk_groups)));
                return riskGroups.map((group) => ({
                    x: ageRiskData.filter((d) => d.risk_groups === group).map((d) => d.age_group),
                    y: ageRiskData.filter((d) => d.risk_groups === group).map((d) => d.absolute),
                    type: "bar" as const,
                    name: group,
                }));
            }
            default:
                return [];
        }
    };

    const getLayout = () => {
        const baseLayout = {
            title: `${title} (${masterState?.name || "Select a State"})`,
            barmode: "group" as const,
        };

        switch (type) {
            case "genderRisk":
                return {
                    ...baseLayout,
                    xaxis: { title: "Risk Group" },
                    yaxis: { title: "Number of Vaccinations" },
                };
            case "ageGender":
                return {
                    ...baseLayout,
                    xaxis: { title: "Age Group" },
                    yaxis: { title: "Number of Vaccinations" },
                };
            case "ageRisk":
                return {
                    ...baseLayout,
                    xaxis: { title: "Age Group" },
                    yaxis: { title: "Number of Vaccinations" },
                };
            default:
                return baseLayout;
        }
    };

    return (
        <div className="border rounded shadow bg-white p-4 mt-6 min-h-[600px]">
            <h3 className="text-lg font-semibold mb-2">{subtitle}</h3>
            {loading ? (
                <div className="flex-grow bg-white p-4 flex flex-col items-center justify-center h-[555px] w-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                    <p className="mt-4 text-gray-600 animate-pulse">Loading data...</p>
                </div>
            ) : data.length === 0 ? (
                <div className="text-center">No data available</div>
            ) : (
                <>
                    <Plot
                        data={getPlotData()}
                        layout={getLayout()}
                        config={{ responsive: true }}
                        style={{ width: "100%", height: "500px" }}
                    />
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
                </>
            )}
        </div>
    );
};

export default Graph;