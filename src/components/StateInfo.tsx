"use client"

import React from 'react';
import { useFilterStore } from '@/store';
import AgeGenderData from './graph/AgeGenderData';
import GenderRiskData from './graph/GenderRiskData';
import RiskGroupData from './graph/AgeRiskData';
import { ScrollArea } from './ui/scroll-area';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { staticGermanyStates } from '@/data/dataset';
import LottieBot from './LottieBot';

const StateInfo: React.FC = () => {
    const { masterState } = useFilterStore();

    if (!masterState) {
        return (
            <div className="border rounded shadow bg-white p-4 flex items-center justify-center h-[905px] flex-col">
                <LottieBot />
                <p className="text-gray-500 text-center mt-2">
                    Select a federal state (Bundesland) on the map to view its information
                </p>
            </div>
        );
    }

    const getStateDetailsById = (id: string) => {
        const state = staticGermanyStates.find((state) => (state as any).id === id);
        return state
            ? {
                population: (state as any).population,
                capital: (state as any).capital,
                area: (state as any).area,
            }
            : null;
    };

    const selectedStaticData = getStateDetailsById(masterState.id);

    // const populations = staticGermanyStates.map(state => state.population);
    // const minPopulation = Math.min(...populations);
    // const maxPopulation = Math.max(...populations);

    const populationDensity = Math.round(selectedStaticData?.population * 1000000 / selectedStaticData?.area);

    return (
        <ScrollArea className="h-0 flex-1 w-full">
            <div className="border rounded shadow bg-white p-4">
                <h2 className="text-2xl font-bold mb-4">{masterState.name}</h2>
                <div className="grid grid-cols-3 gap-4">
                    <p><span className="font-medium">Vaccine Count:</span> {masterState.vaccine_count.toLocaleString()}</p>
                    <p><span className="font-medium">Capital:</span> {selectedStaticData?.capital}</p>
                    <p><span className="font-medium">Population:</span> {selectedStaticData?.population.toLocaleString()} million</p>
                    <p><span className="font-medium">Area:</span> {selectedStaticData?.area.toLocaleString()} km²</p>
                    <p><span className="font-medium">Population Density:</span> {populationDensity.toLocaleString()} people/km²</p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Population Distribution</h3>
                    <div className="bg-gray-200 w-full h-4 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${(selectedStaticData?.population / 18) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        {Math.round((selectedStaticData?.population / 18) * 100)}% of Germany's highest population state
                    </p>
                </div>
            </div>

            <Carousel className="w-full my-2 relative">
                {/* Buttons at the top */}
                <div className="absolute top-30 left-80 right-80 flex justify-between px-4 z-10">
                    <CarouselPrevious className="bg-white shadow-md p-2 rounded-full" />
                    <CarouselNext className="bg-white shadow-md p-2 rounded-full" />
                </div>
                <CarouselContent>
                    <CarouselItem>
                        <div className="p-1">
                            <AgeGenderData />
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div className="p-1">
                            <GenderRiskData />
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div className="p-1">
                            <RiskGroupData />
                        </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </ScrollArea>
    );
};

export default StateInfo;