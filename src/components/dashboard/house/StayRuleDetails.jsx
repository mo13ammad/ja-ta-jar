import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Spinner from './Spinner'; // Assuming this component exists

const statusOptions = [
  { key: 'NotAllowed', label: 'غیر مجاز' },
  { key: 'Allowed', label: 'مجاز' },
  { key: 'Needed', label: 'نیاز است' },
  { key: 'NotNeeded', label: 'نیاز نیست' },
];

const StayRuleDetails = ({ token, houseUuid, rules }) => {
  const [fetchedRules, setFetchedRules] = useState([]); // Fetched rules from the server
  const [selectedRules, setSelectedRules] = useState({}); // Selected rule statuses
  const [descriptions, setDescriptions] = useState({}); // Descriptions for each rule
  const [loading, setLoading] = useState(true); // Loading state for fetching rules
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Loading state for submission

  useEffect(() => {
    // Fetch rules from backend
    const fetchRules = async () => {
      try {
        const response = await axios.get(
          'https://portal1.jatajar.com/api/assets/types/rules/detail',
          {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          }
        );

        if (response.status === 200) {
          const fetchedRulesData = response.data.data; // Assuming response.data.data contains the rules
          console.log('Fetched Rules:', fetchedRulesData);
          setFetchedRules(fetchedRulesData); // Store fetched rules in the state

          // Initialize selected rules based on fetched rules and the `rules` prop
          const initialSelectedRules = fetchedRulesData.reduce((acc, rule) => {
            const matchedRule = rules.find((r) => r.key === rule.key);
            acc[rule.key] = matchedRule ? matchedRule.status.key : null; // Set status if exists, otherwise null
            return acc;
          }, {});

          const initialDescriptions = fetchedRulesData.reduce((acc, rule) => {
            const matchedRule = rules.find((r) => r.key === rule.key);
            acc[rule.key] = matchedRule ? matchedRule.description : ""; // Set description if exists, otherwise empty string
            return acc;
          }, {});

          setDescriptions(initialDescriptions);

          setSelectedRules(initialSelectedRules);
        } else {
          toast.error('Failed to fetch rules from server');
        }
      } catch (error) {
        toast.error('Error fetching rules from server');
        console.error('Error:', error);
      } finally {
        setLoading(false); // Stop loading once the data is processed
      }
    };

    fetchRules();
  }, [token, rules]);

  // Function to handle radio button status changes
  const handleStatusChange = (key, status) => {
    setSelectedRules((prevSelected) => ({
      ...prevSelected,
      [key]: status,
    }));
  };

  // Function to handle Descriptions changes
  const handleDescriptionChange = (key, value) => {
    setDescriptions((prevDescriptions) => ({
      ...prevDescriptions,
      [key]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    setLoadingSubmit(true);
    try {
      const requestData = {
        rules: Object.keys(selectedRules).map((key) => ({
          key: key,
          status: selectedRules[key] || 'NotAllowed', // Default to 'NotAllowed' only if it's explicitly selected or null
          description: descriptions[key] || "", // Add the Description for each rule
        })),
      };

      console.log('Submitting Data:', requestData);

      const response = await axios.put(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast.success('اطلاعات با موفقیت ثبت شد');
      } else {
        toast.error('خطایی در ثبت اطلاعات پیش آمد');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('متاسفانه مشکلی پیش آمده لطفا دوباره امتحان کنید');
    } finally {
      setLoadingSubmit(false); // Stop loading after submission
    }
  };

  // Display spinner while loading data
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  // Display the rules form after loading is complete
  return (
    <div className="relative flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-thin max-h-full pl-4">
        <h2 className="text-xl font-semibold mb-4">قوانین اقامتگاه</h2>
        <div className="space-y-4">
          {fetchedRules.map((rule) => (
            <div key={rule.key} className="flex flex-col">
              <div className="flex items-center mb-2">
                <span className="xl:text-lg mb-1 font-medium">{rule.label}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {statusOptions.map((option) => (
                  <label key={option.key} className="flex items-center cursor-pointer space-x-2">
                    <input
                      type="radio"
                      name={`rule-${rule.key}`}
                      value={option.key}
                      checked={selectedRules[rule.key] === option.key}
                      onChange={() => handleStatusChange(rule.key, option.key)}
                      className="sr-only"
                    />
                    <div
                      className={`h-6 w-6 flex items-center justify-center rounded-full transition-colors ease-in-out duration-200 
                        ${selectedRules[rule.key] === option.key ? 'bg-green-500' : 'bg-gray-200'}
                      `}
                    >
                      {selectedRules[rule.key] === option.key && (
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

              <div className="mt-2 xl:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">یادداشت:</label>
                <textarea
                  value={descriptions[rule.key] || ""}
                  onChange={(e) => handleDescriptionChange(rule.key, e.target.value)}
                  className="block p-2 border rounded-xl w-full outline-none"
                  placeholder="یادداشت خود را وارد کنید"
                  rows="1"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-xl"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? 'در حال بارگذاری...' : 'ثبت اطلاعات'}
        </button>
      </div>
    </div>
  );
};

export default StayRuleDetails;