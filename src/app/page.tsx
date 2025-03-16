import React from 'react';
import StateInfo from '@/components/stateinfo/StateInfo';
import FilterWrapper from '@/components/filter/FilterWrapper';

export default function Home() {

  return (
    <div className="flex flex-grow">
      <div className="grid grid-cols-6 gap-8 w-full">
        {/* Fixed FilterWrapper */}
        <div className="col-span-2 h-screen sticky top-0">
          <FilterWrapper />
        </div>

        {/* Scrollable StateInfo */}
        <div className="col-span-4 flex flex-col gap-4">
          <StateInfo />
        </div>
      </div>
    </div>
  );
}