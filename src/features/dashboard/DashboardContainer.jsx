import React from 'react';
import DashboardContent from './DashboardContent';
import DashboardSidebar from './DashboardSidebar';

function DashboardContainer() {
  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-4  w-full min-h-[83vh] h-full ">
     
      <div className="md:col-span-3    w-full border border-gray-200 border-opacity-80 rounded-xl shadow-sm p-2 md:p-4">
        <DashboardSidebar />
      </div>
   
      <div className="md:col-span-9 flex-grow w-full border border-gray-200 border-opacity-80 rounded-xl shadow-sm p-2 md:p-4">
        <DashboardContent />
      </div>
    </div>
  );
}

export default DashboardContainer;
