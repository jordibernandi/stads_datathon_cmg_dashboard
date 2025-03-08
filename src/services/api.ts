export const fetchStateVaccineCountData = async (data) => {
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
            console.log(result);
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

export const fetchStateAgeGenderData = async (data) => {
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
            console.log(result);
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

export const fetchStateGenderRiskData = async (data) => {
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
            console.log(result);
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

export const fetchStateAgeRiskData = async (data) => {
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
            console.log(result);
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