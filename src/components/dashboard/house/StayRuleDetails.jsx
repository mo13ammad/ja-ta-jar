import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RadioGroup } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import Spinner from './Spinner'; // Import your Spinner component

const statusOptions = [
  { key: 'NotAllowed', label: 'غیر مجاز' },
  { key: 'Allowed', label: 'مجاز' },
  { key: 'Needed', label: 'نیاز است' },
  { key: 'NotNeeded', label: 'نیاز نیست' },
];

const StayRuleDetails = ({ houseData, token, houseUuid }) => {
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get(
          'https://portal1.jatajar.com/api/assets/types/rules/detail',
          {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          }
        );

        if (response.status === 200) {
          const rulesData = response.data.data;

          // Initialize selectedRules with houseData.rules if it exists
          const initialSelectedRules = rulesData.reduce((acc, rule) => {
            const existingRule = Array.isArray(houseData.rules)
              ? houseData.rules.find((r) => r.key === rule.key)
              : null;

            // Set the status based on houseData.rules or default to 'NotAllowed'
            acc[rule.key] = existingRule && existingRule.status ? existingRule.status.key : 'NotAllowed'; 
            return acc;
          }, {});

          setRules(rulesData);
          setSelectedRules(initialSelectedRules);
        } else {
          toast.error('Failed to fetch rules data');
        }
      } catch (error) {
        console.error('Error fetching rules data:', error);
        toast.error('Error fetching rules data');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, [token, houseData]);

  const handleStatusChange = (key, status) => {
    setSelectedRules((prevSelected) => ({
      ...prevSelected,
      [key]: status,
    }));
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    try {
      // Ensure requestData is properly defined here
      const requestData = {
        rules: Object.keys(selectedRules).map((key) => ({
          key: key,
          status: selectedRules[key],
        })),
      };
    
      // Now you can log requestData since it's defined
      console.log('Request Data:', requestData);
    
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
    
      // Log the response data after successful submission
      console.log('Response Data:', response.data);
    
      if (response.status === 200) {
        toast.success('اطلاعات با موفقیت ثبت شد');
    
        const updatedRules = response.data.data.rules;
  
        // Check if updatedRules is an array
        if (Array.isArray(updatedRules)) {
          // Map the updated rules to selectedRules
          const updatedSelectedRules = updatedRules.reduce((acc, rule) => {
            acc[rule.key] = rule.status.key;
            return acc;
          }, {});
  
          // Update the state with the latest rules
          setSelectedRules(updatedSelectedRules);
        } else {
          console.error('Expected an array for updatedRules but got:', updatedRules);
          toast.error('Invalid data format returned from server.');
        }
      } else {
        toast.error('خطایی در ثبت اطلاعات پیش آمد');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('متاسفانه مشکلی پیش آمده لطفا دوباره امتحان کنید');
    } finally {
      setLoadingSubmit(false);
    }
  };
  
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">قوانین اقامتگاه</h2>
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.key} className="border p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{rule.label}</span>
            </div>

            <RadioGroup
              value={selectedRules[rule.key] || 'NotAllowed'}
              onChange={(status) => handleStatusChange(rule.key, status)}
            >
              <div className="grid grid-cols-4 gap-4">
                {statusOptions.map((option) => (
                  <RadioGroup.Option key={option.key} value={option.key}>
                    {({ checked }) => (
                      <div
                        className={`cursor-pointer p-2 border rounded-lg flex justify-center items-center text-sm font-medium ${
                          checked ? 'bg-green-600 text-white' : 'bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </div>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>
        ))}
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
