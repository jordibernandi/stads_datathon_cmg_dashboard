/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useFilterStore } from '@/store';
import { fetchStateVaccineCountData } from '@/services/api';
import { StateData } from '@/types/StateData';

const stateIdMap: { [key: string]: string } = {
    'Baden-Württemberg': 'DE-BW',
    'Bayern': 'DE-BY',
    'Berlin': 'DE-BE',
    'Brandenburg': 'DE-BB',
    'Bremen': 'DE-HB',
    'Hamburg': 'DE-HH',
    'Hessen': 'DE-HE',
    'Mecklenburg-Vorpommern': 'DE-MV',
    'Niedersachsen': 'DE-NI',
    'Nordrhein-Westfalen': 'DE-NW',
    'Rheinland-Pfalz': 'DE-RP',
    'Saarland': 'DE-SL',
    'Sachsen': 'DE-SN',
    'Sachsen-Anhalt': 'DE-ST',
    'Schleswig-Holstein': 'DE-SH',
    'Thüringen': 'DE-TH',
};

const GermanyMap: React.FC = () => {
    const [geoData, setGeoData] = useState<any>(null);
    const [stateData, setStateData] = useState<StateData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { masterState, setMasterState, masterStartDate, masterEndDate } = useFilterStore();

    const handleStateClick = (id: string) => {
        const state = stateData.find(state => state.id === id);
        setMasterState(state || null);
    };

    useEffect(() => {
        // Fetch the GeoJSON data for German states
        fetch('/4_niedrig.geo.json')
            .then(response => response.json())
            .then(data => {
                setGeoData(data);
            })
            .catch(error => console.error('Error loading GeoJSON:', error));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await fetchStateVaccineCountData({ fromDate: masterStartDate, toDate: masterEndDate });
                if (result) {
                    const formattedData = result.map((state: any) => ({
                        id: stateIdMap[state.name] || 'UNKNOWN',
                        name: state.name,
                        vaccine_count: state.vaccine_count
                    }));
                    setStateData(formattedData);
                    setMasterState(null);
                }
            } catch (error) {
                console.error('Error fetching state data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [masterStartDate, masterEndDate]);

    // Get the population range for color scaling
    const vaccineCount = stateData.map(state => state.vaccine_count);
    const minVaccineCount = Math.min(...vaccineCount);
    const maxVaccineCount = Math.max(...vaccineCount);

    // Generate color based on population density
    const getStateColor = (stateId: string) => {
        if (masterState?.id === stateId) {
            return '#2563eb'; // Highlight selected state
        }

        const state = stateData.find(s => s.id === stateId);
        if (!state) return '#d1e7ff'; // Default light blue

        // Calculate color intensity based on population
        const normalized = (state.vaccine_count - minVaccineCount) / (maxVaccineCount - minVaccineCount);
        const intensity = Math.floor(normalized * 200); // 0-200 scale for blue intensity

        return `rgb(${55 + intensity}, ${137 + (normalized * 50)}, ${230})`; // Blue scale
    };

    // Style function for GeoJSON
    const style = (feature: any) => {
        const stateId = feature.properties.id;
        return {
            fillColor: getStateColor(stateId),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    };

    // Event handlers for GeoJSON layer
    const onEachFeature = (feature: any, layer: any) => {
        const stateId = feature.properties.id;
        const state = stateData.find(s => s.id === stateId);

        if (state) {
            layer.bindTooltip(state.name);

            layer.on({
                click: () => {
                    handleStateClick(stateId);
                },
                mouseover: (e: any) => {
                    const layer = e.target;
                    layer.setStyle({
                        weight: 3,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 0.9
                    });
                    layer.bringToFront();
                },
                mouseout: (e: any) => {
                    const layer = e.target;
                    layer.setStyle(style(feature));
                }
            });
        }
    };

    if (loading || !geoData || stateData.length === 0) {
        return (
            <div className="flex-grow border rounded shadow bg-white p-4 flex flex-col items-center justify-center h-[710px] w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                <p className="mt-4 text-gray-600 animate-pulse">Loading map data...</p>
            </div>
        );
    }

    return (
        <div className="flex-grow border rounded shadow bg-white p-4">
            <MapContainer
                center={[51.1657, 10.4515]}
                zoom={6}
                style={{ height: "600px", width: "100%" }}
                zoomControl={true}
            >
                <TileLayer
                    attribution=''
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    opacity={0.3}
                />

                <GeoJSON
                    data={geoData}
                    style={style}
                    onEachFeature={onEachFeature}
                />
            </MapContainer>

            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Vaccine Count Density</h3>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-4 h-4" style={{ backgroundColor: `rgb(55, 137, 230)` }}></div>
                        <span className="ml-2">Low</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4" style={{ backgroundColor: `rgb(155, 187, 230)` }}></div>
                        <span className="ml-2">Medium</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4" style={{ backgroundColor: `rgb(255, 187, 230)` }}></div>
                        <span className="ml-2">High</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GermanyMap;