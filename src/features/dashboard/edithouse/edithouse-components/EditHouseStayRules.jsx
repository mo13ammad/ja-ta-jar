import React, { useState, useEffect } from 'react';
import Spinner from "../../../../ui/Loading";
import TextArea from "../../../../ui/TextArea";
import { useFetchRules } from "../../../../services/fetchDataService";
import TextField from '../../../../ui/TextField';

const statusOptions = [
  { key: 'NotAllowed', label: 'غیر مجاز' },
  { key: 'Allowed', label: 'مجاز' },
  { key: 'Needed', label: 'نیاز است' },
  { key: 'NotNeeded', label: 'نیاز نیست' },
];

const EditHouseStayRules = ({ houseData, loadingHouse }) => {
  const { data: rulesData = [], isLoading: loadingRules } = useFetchRules();
  const [selectedRules, setSelectedRules] = useState({});

  useEffect(() => {
    if (rulesData) {
      console.log("Fetched rules data:", rulesData);
    }
  }, [rulesData]);

  const handleOptionChange = (ruleKey, optionKey) => {
    setSelectedRules((prev) => ({
      ...prev,
      [ruleKey]: { ...prev[ruleKey], status: optionKey },
    }));
  };

  const handleNoteChange = (ruleKey, value) => {
    setSelectedRules((prev) => ({
      ...prev,
      [ruleKey]: { ...prev[ruleKey], note: value },
    }));
  };

  if (loadingHouse || loadingRules) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]:"><Spinner /></div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-auto scrollbar-thin  pt-2 px-2 lg:px-4 w-full ">
      <div className="text-right font-bold lg:text-lg ">قوانین اقامت :</div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rulesData.map((rule) => (
            <div key={rule.key} className="mt-4 p-4 border rounded-xl shadow-centered">
              <span className="block text-sm font-medium mb-2">{rule.label}</span>

              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((option) => (
                  <label key={option.key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`rule-${rule.key}`}
                      checked={selectedRules[rule.key]?.status === option.key}
                      onChange={() => handleOptionChange(rule.key, option.key)}
                      className="sr-only"
                    />
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        selectedRules[rule.key]?.status === option.key ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      {selectedRules[rule.key]?.status === option.key && (
                        <svg
                          className="w-3 h-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>

              <div className="mt-2">
                <TextField
                  label="یادداشت"
                  placeholder="یادداشت خود را وارد کنید (اختیاری)"
                  value={selectedRules[rule.key]?.note || ''}
                  onChange={(e) => handleNoteChange(rule.key, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 w-full lg:col-span-2 flex justify-end">
          <button
            className="btn bg-primary-600 text-white px-4 py-2 shadow-lg hover:bg-primary-800 transition-colors duration-200"
            onClick={()=>{}}
          >
            ثبت اطلاعات
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHouseStayRules;
