import React from 'react';
import Spinner from "../../../../ui/Loading";

const statusOptions = [
  { key: 'NotAllowed', label: 'غیر مجاز' },
  { key: 'Allowed', label: 'مجاز' },
  { key: 'Needed', label: 'نیاز است' },
  { key: 'NotNeeded', label: 'نیاز نیست' },
];

const EditHouseStayRules = ({ loading, loadingSubmit }) => {
  const rules = [
    { key: 'rule1', label: 'قانون 1' },
    { key: 'rule2', label: 'قانون 2' },
    { key: 'rule3', label: 'قانون 3' },
  ];

  return (
    <div className="relative">
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-auto scrollbar-thin max-h-[70vh] pr-2 w-full min-h-[70vh]">
          {/* Static Header */}
          <div className="text-center font-bold text-xl my-4">
            قوانین اقامتگاه
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <div key={rule.key} className="mt-4">
                {/* Rule Label */}
                <span className="block text-sm font-medium mb-2">{rule.label}</span>

                {/* Radio Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((option) => (
                    <label key={option.key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`rule-${rule.key}`}
                        className="sr-only"
                      />
                      <div
                        className={`h-6 w-6 rounded-full transition-colors ease-in-out duration-200 bg-gray-200`}
                      >
                        <svg
                          className="w-3 h-3 text-white absolute inset-0 m-auto hidden"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>

                {/* Description Input */}
                <div className="mt-2 xl:w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">یادداشت:</label>
                  <textarea
                    className="block p-2 border rounded-xl w-full outline-none"
                    placeholder="یادداشت خود را وارد کنید"
                    rows="1"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-xl"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? 'در حال بارگذاری...' : 'ثبت اطلاعات'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditHouseStayRules;
