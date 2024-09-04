import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

          // Initialize selectedRules with existing house data
          const initialSelectedRules = rulesData.reduce((acc, rule) => {
            const existingRule = Array.isArray(houseData.rules)
              ? houseData.rules.find((r) => r.key === rule.key)
              : null;
            acc[rule.key] = existingRule ? existingRule.status : 'NotAllowed'; // Default to 'NotAllowed'
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
      const requestData = Object.keys(selectedRules).map((key, index) => ({
        [`rules[${index}][key]`]: key,
        [`rules[${index}][status]`]: selectedRules[key],
      }));

      const flattenedRequestData = requestData.reduce((acc, item) => {
        Object.entries(item).forEach(([k, v]) => {
          acc[k] = v;
        });
        return acc;
      }, {});

      // Log the request data
      console.log('Request Data:', JSON.stringify(flattenedRequestData, null, 2));

      const response = await axios.put(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}`,
        flattenedRequestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Log the response data
      console.log('Response Data:', response.data);

      if (response.status === 200) {
        toast.success('اطلاعات با موفقیت ثبت شد');
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
      <div className="space-y-2">
        {rules.map((rule) => (
          <div key={rule.key} className="border p-2 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{rule.label}</span>
              <select
                className="border rounded-lg p-1 bg-white focus:ring-0 focus:outline-none"
                value={selectedRules[rule.key]}
                onChange={(e) => handleStatusChange(rule.key, e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
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
