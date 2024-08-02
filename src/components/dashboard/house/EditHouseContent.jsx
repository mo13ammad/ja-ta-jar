import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import EditHouseSidebar from "./EditHouseSidebar"; // Ensure correct import
import Spinner from "../../Spinner";

const EditHouseContent = ({ houseData, token, onUpdate }) => {
  const [isGeneralLoading, setIsGeneralLoading] = useState(false);

  const handleUpdateSuccess = () => {
    setIsGeneralLoading(true);
    onUpdate(); // Call the onUpdate prop function (fetchData)
    setTimeout(() => setIsGeneralLoading(false), 2000);
  };

  const handleEditStart = () => {
    setIsGeneralLoading(true);
  };

  const handleEditEnd = () => {
    setIsGeneralLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      {isGeneralLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner />
        </div>
      )}
      <Tab.Group>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:max-h-[80vh] lg:overflow-auto">
            <EditHouseSidebar house={houseData} token={token} />
          </div>
          <div className="col-span-1 lg:col-span-3 lg:max-h-[85vh] overflow-auto border p-4 rounded-xl bg-white">
            <Tab.Panels>
              <Tab.Panel>
                <p>جزئیات عمومی</p>
              </Tab.Panel>
              <Tab.Panel>
                <p>تجهیزات</p>
              </Tab.Panel>
              <Tab.Panel>
                <p>هزینه‌ها</p>
              </Tab.Panel>
              <Tab.Panel>
                <p>اندازه</p>
              </Tab.Panel>
              <Tab.Panel>
                <p>طراحی داخلی</p>
              </Tab.Panel>
              <Tab.Panel>
                <p>امنیت</p>
              </Tab.Panel>
              <Tab.Panel>
                <p>آدرس</p>
              </Tab.Panel>
              <Tab.Panel>
                <p>دسترسی‌ها</p>
              </Tab.Panel>
              <Tab.Panel>
                <p>محیط اطراف</p>
              </Tab.Panel>
            </Tab.Panels>
          </div>
        </div>
      </Tab.Group>
    </div>
  );
};

export default EditHouseContent;
