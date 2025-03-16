"use client"

import React from 'react';
import { useFilterStore } from '@/store';
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
import Graph from './graph/Graph';
import { GermanyState } from '@/types/GermanyState';

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
        const state = staticGermanyStates.find((state) => (state as GermanyState).id === id);
        return state
            ? {
                population: state.population,
                capital: state.capital,
                area: state.area,
            }
            : { population: 0, capital: "", area: 1 };
    };

    const selectedStaticData = getStateDetailsById(masterState.id);

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
                        {Math.round((selectedStaticData?.population / 18) * 100)}% of Germanys highest population state
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
                            <Graph
                                type="ageGender"
                                title="Vaccinations by Age Group & Gender"
                                subtitle="Age & Gender-Based Vaccination Data"
                            />
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div className="p-1">
                            <Graph
                                type="genderRisk"
                                title="Vaccinations by Gender & Risk Group"
                                subtitle="Gender-Based Risk Group Vaccination Data"
                            />
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div className="p-1">
                            <Graph
                                type="ageRisk"
                                title="Vaccinations by Age Group and Risk Group"
                                subtitle="Risk Group Vaccination Data"
                            />
                        </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </ScrollArea>
    );
};

export default StateInfo;