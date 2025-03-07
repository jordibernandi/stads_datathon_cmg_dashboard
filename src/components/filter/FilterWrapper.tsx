"use client"

import dynamic from 'next/dynamic';
import DateRange from './DateRange';

const GermanyMap = dynamic(() => import('@/components/filter/GermanyMap'), {
    ssr: false,
});

const FilterWrapper = () => {
    return (
        <>
            <GermanyMap />
            <DateRange />
        </>
    );
}

export default FilterWrapper;