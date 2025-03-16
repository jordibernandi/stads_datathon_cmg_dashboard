import { DateTimeInputData } from "@/types/DateTimeInputData";
import { LlmInputData } from "@/types/LlmInputData";
import { StatsInputData } from "@/types/StatsInputData";

export const fetchStateVaccineCountData = async (data: DateTimeInputData) => {
    try {
        const response = await fetch('http://localhost:5000/state_vaccine_count', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error('Error fetching data:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching state data:', error);
        throw error;
    }
};

export const fetchStateAgeGenderData = async (data: StatsInputData) => {
    try {
        const response = await fetch('http://localhost:5000/state_age_gender_stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error('Error fetching data:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching state data:', error);
        throw error;
    }
};

export const fetchStateGenderRiskData = async (data: StatsInputData) => {
    try {
        const response = await fetch('http://localhost:5000/state_gender_risk_stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error('Error fetching data:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching state data:', error);
        throw error;
    }
};

export const fetchStateAgeRiskData = async (data: StatsInputData) => {
    try {
        const response = await fetch('http://localhost:5000/state_age_risk_stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error('Error fetching data:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching state data:', error);
        throw error;
    }
};

export const fetchLlmGenAgeGenderData = async (data: LlmInputData) => {
    try {
        const response = await fetch('http://localhost:5000/llm_generation_age_gender_stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error('Error fetching data:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching state data:', error);
        throw error;
    }
};

export const fetchLlmGenAgeRiskData = async (data: LlmInputData) => {
    try {
        const response = await fetch('http://localhost:5000/llm_generation_age_risk_stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error('Error fetching data:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching state data:', error);
        throw error;
    }
};

export const fetchLlmGenGenderRiskData = async (data: LlmInputData) => {
    try {
        const response = await fetch('http://localhost:5000/llm_generation_gender_risk_stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error('Error fetching data:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching state data:', error);
        throw error;
    }
};