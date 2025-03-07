"use client"

import React from 'react';
import { useFilterStore } from '@/store';

const StateInfo: React.FC = () => {
    const { masterState } = useFilterStore();

    if (!masterState) {
        return (
            <div className="border rounded shadow bg-white p-4 h-full flex items-center justify-center">
                <p className="text-gray-500 text-center">
                    Select a federal state (Bundesland) on the map to view its information
                </p>
            </div>
        );
    }

    // Calculate population density
    const populationDensity = Math.round(masterState.population * 1000000 / masterState.area);

    return (
        <div className="border rounded shadow bg-white p-4">
            <h2 className="text-2xl font-bold mb-4">{masterState.name}</h2>
            <div className="space-y-2">
                <p><span className="font-medium">Capital:</span> {masterState.capital}</p>
                <p><span className="font-medium">Population:</span> {masterState.population.toLocaleString()} million</p>
                <p><span className="font-medium">Area:</span> {masterState.area.toLocaleString()} km²</p>
                <p><span className="font-medium">Population Density:</span> {populationDensity.toLocaleString()} people/km²</p>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Population Distribution</h3>
                <div className="bg-gray-200 w-full h-4 rounded-full overflow-hidden">
                    <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${(masterState.population / 18) * 100}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    {Math.round((masterState.population / 18) * 100)}% of Germanys highest population state
                </p>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Actions</h3>
                <div className="space-x-2">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => alert(`You can implement custom logic for ${masterState.name}`)}
                    >
                        View Details
                    </button>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        onClick={() => alert(`Loading economic data for ${masterState.name}...`)}
                    >
                        Economic Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StateInfo;