import React, { useState } from 'react';
import EditHouseSidebar from './EditHouseSidebar';
import EditHouseContent from './EditHouseContent';

function EditHouseContainer() {
  const [selectedTab, setSelectedTab] = useState('profile'); 

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 w-full min-h-[83vh] h-full">
      
      <div className="md:col-span-3 w-full bg-gray-50  border-gray-200 border-t border-opacity-50 shadow-centered rounded-xl  p-1.5 md:p-3">
        <EditHouseSidebar setSelectedTab={setSelectedTab} /> 
      </div>

      {/* Main Content */}
      <div className="md:col-span-9 flex-grow w-full bg-gray-50  border-gray-200 border-t border-opacity-50 shadow-centered rounded-xl ">
        <EditHouseContent selectedTab={selectedTab} /> 
      </div>
    </div>
  );
}

export default EditHouseContainer;
