"use client"

import dynamic from 'next/dynamic';
import DateRange from './DateRange';
// import { useState } from 'react';
import { fetchStateData } from '@/services/api';

const GermanyMap = dynamic(() => import('@/components/filter/GermanyMap'), {
    ssr: false,
});

const FilterWrapper = () => {
    //     const [loading, setLoading] = useState(false);
    //   const [response, setResponse] = useState(null);
    //   const [error, setError] = useState(null);

    const handleTestApi = async () => {
        // setLoading(true);
        // setError(null);
        // setResponse(null);

        try {
            const result = await fetchStateData({
                "fromDate": "Baby",
                "toDate": "Baby",
                "state": "Baby"
            });

            if (result.success) {
                console.log(result.data);
            } else {
                console.log(result.error);
            }
        } catch (err) {
            console.log(err);
        } finally {
        }
    };

    return (
        <>
            <button
                onClick={handleTestApi}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
            >
                TEST
            </button>
            <GermanyMap />
            <DateRange />
        </>
    );
}

export default FilterWrapper;