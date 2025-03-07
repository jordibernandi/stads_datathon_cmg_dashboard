/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { germanyStates } from '@/data/germanyStates';
import { useFilterStore } from '@/store';

const GermanyMap: React.FC = () => {
    const [geoData, setGeoData] = useState<any>(null);
    const { masterState, setMasterState } = useFilterStore();

    const handleStateClick = (id: string) => {
        const state = germanyStates.find(state => state.id === id);
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

    // Get the population range for color scaling
    const populations = germanyStates.map(state => state.population);
    const minPopulation = Math.min(...populations);
    const maxPopulation = Math.max(...populations);

    // Generate color based on population density
    const getStateColor = (stateId: string) => {
        if (masterState?.id === stateId) {
            return '#2563eb'; // Highlight selected state
        }

        const state = germanyStates.find(s => s.id === stateId);
        if (!state) return '#d1e7ff'; // Default light blue

        // Calculate color intensity based on population
        const normalized = (state.population - minPopulation) / (maxPopulation - minPopulation);
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
        const state = germanyStates.find(s => s.id === stateId);

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

    if (!geoData) {
        return <div className="border rounded shadow bg-white p-4 h-96 flex items-center justify-center">Loading map data...</div>;
    }

    return (
        <div className="border rounded shadow bg-white p-4">
            <MapContainer
                center={[51.1657, 10.4515]}
                zoom={6}
                style={{ height: "600px", width: "100%" }}
                zoomControl={true}
            >
                <TileLayer
                    attribution=''
                    url=""
                    opacity={0.0}
                />

                <GeoJSON
                    data={geoData}
                    style={style}
                    onEachFeature={onEachFeature}
                />
            </MapContainer>

            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Population Density</h3>
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