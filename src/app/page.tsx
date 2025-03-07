import React from 'react';
import StateInfo from '@/components/StateInfo';
import FilterWrapper from '@/components/filter/FilterWrapper';

export default function Home() {

  return (
    <div className="flex flex-grow">
      <div className="grid grid-cols-6 gap-8 w-full">
        <div className="col-span-2">
          <FilterWrapper />
        </div>
        <div className="col-span-4 flex flex-col gap-4">
          {/* <Suspense key={searchParamsKey} fallback={<ContentWrapperLoading />}> */}
          <StateInfo />
          {/* </Suspense> */}
        </div>
      </div>
    </div>
  );
}