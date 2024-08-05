import React from "react";

const GeneralDetails = () => {
  return (
    <div className="relative ">
      <div className="overflow-auto max-h-[80vh] pr-2">
        <div className="flex flex-col">
          <label className="text-gray-700">Field 1</label>
          <input type="text" className="p-2 border rounded" />
        </div>
        <div className="flex flex-col mt-4">
          <label className="text-gray-700">Field 2</label>
          <input type="text" className="p-2 border rounded" />
        </div>
        <div className="flex flex-col mt-4">
          <label className="text-gray-700">Select Option</label>
          <select className="p-2 border rounded">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        </div>
      </div>
      <button className="bg-green-600 text-white py-2 px-4 rounded fixed bottom-6 left-6">
        ثبت تغییرات
      </button>
    </div>
  );
};

export default GeneralDetails;
