export const fetchStateData = async (data) => {
    try {
        console.log("KESINI", data)
        const response = await fetch("http://172.10.10.203:5000/api/data") // Replace with your friend's IP
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error("Error:", error));

        // if (!response.ok) {
        //     console.log("ERROR");
        //     const errorData = await response.json().catch(() => null);
        //     throw new Error(errorData?.message || `Error: ${response.status} ${response.statusText}`);
        // }
        console.log(response);

        return await response.json();
    } catch (error) {
        console.error('Error fetching state data:', error);
        throw error;
    }
};