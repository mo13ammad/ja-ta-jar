import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import EditHouseSidebar from "./EditHouseSidebar";
import Spinner from "../../Spinner";
import GeneralDetails from "./GeneralDetails";
import EquipmentDetails from "./EquipmentDetails";
import CostDetails from "./CostDetails";
import SizeDetails from "./SizeDetails";
import InteriorDesignDetails from "./InteriorDesignDetails";
import SecurityDetails from "./SecurityDetails";
import AddressDetails from "./AddressDetails";
import AccessibilityDetails from "./AccessibilityDetails";
import SurroundingsDetails from "./SurroundingsDetails";

const tabs = [
  { key: "general", label: "جزئیات عمومی" },
  { key: "equipment", label: "تجهیزات" },
  { key: "costs", label: "هزینه‌ها" },
  { key: "size", label: "اندازه" },
  { key: "interiorDesign", label: "طراحی داخلی" },
  { key: "security", label: "امنیت" },
  { key: "address", label: "آدرس" },
  { key: "accessibility", label: "دسترسی‌ها" },
  { key: "surroundings", label: "محیط اطراف" }
];

const EditHouseContent = ({ houseData, token, onUpdate }) => {
  const [isGeneralLoading, setIsGeneralLoading] = useState(false);

  const handleUpdateSuccess = () => {
    setIsGeneralLoading(true);
    onUpdate();
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
            <EditHouseSidebar tabs={tabs} />
          </div>
          <div className="col-span-1 lg:col-span-3 lg:max-h-[85vh] overflow-auto border p-4 rounded-xl bg-white">
            <Tab.Panels>
              {tabs.map((tab) => (
                <Tab.Panel key={tab.key}>
                  {tab.key === "general" && <GeneralDetails />}
                  {tab.key === "equipment" && <EquipmentDetails />}
                  {tab.key === "costs" && <CostDetails />}
                  {tab.key === "size" && <SizeDetails />}
                  {tab.key === "interiorDesign" && <InteriorDesignDetails />}
                  {tab.key === "security" && <SecurityDetails />}
                  {tab.key === "address" && <AddressDetails />}
                  {tab.key === "accessibility" && <AccessibilityDetails />}
                  {tab.key === "surroundings" && <SurroundingsDetails />}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </div>
        </div>
      </Tab.Group>
    </div>
  );
};

export default EditHouseContent;
