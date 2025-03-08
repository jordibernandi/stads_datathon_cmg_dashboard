"use client"

import React from 'react';
import { useFilterStore } from '@/store';
import AgeGenderData from './graph/AgeGenderData';
import GenderRiskData from './graph/GenderRiskData';
import RiskGroupData from './graph/AgeRiskData';
import { ScrollArea } from './ui/scroll-area';

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

    return (
        <ScrollArea className="h-[1px] flex-grow w-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{masterState.name}</h2>
            <div className="space-y-2">
                <p><span className="font-medium">Vaccine Count:</span> {masterState.vaccine_count.toLocaleString()}</p>
            </div>

            <AgeGenderData />
            <GenderRiskData />
            <RiskGroupData />
        </ScrollArea>
    );
};

export default StateInfo;