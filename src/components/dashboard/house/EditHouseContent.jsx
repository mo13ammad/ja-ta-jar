import React, { useState } from "react";
import EditHouseSidebar from "./EditHouseSidebar";
import GeneralDetails from "./GeneralDetails";
import AddressDetails from "./AddressDetails";
import LocationDetails from "./LocationDetails";

const tabs = [
  { key: "address", label: "آدرس" },
  { key: "location", label: "موقعیت مکانی" },
  { key: "generalInfo", label: "اطلاعات اقامتگاه" },
  // other tabs...
];

const EditHouseContent = ({ houseData, token, houseUuid }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  return (
    <div className="container relative mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:h-[80vh] md:overflow-auto w-full">
          <EditHouseSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="col-span-1 md:col-span-3 md:max-h-[80vh] overflow-auto border p-4 rounded-xl bg-white scrollbar-thin">
          {activeTab === "generalInfo" && (
            <GeneralDetails
              data={houseData}  // Passing initial data to GeneralDetails
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "address" && (
            <AddressDetails
              data={houseData}  // Passing initial data to AddressDetails
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "location" && (
            <LocationDetails
              data={houseData}  // Passing initial data to LocationDetails
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {/* Add other tab components here... */}
        </div>
      </div>
    </div>
  );
};

export default EditHouseContent;
