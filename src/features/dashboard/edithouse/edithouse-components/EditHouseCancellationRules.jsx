import React, { useState, useEffect } from 'react';
import { useFetchCancellationRules } from '../../../../services/fetchDataService';
import Loading from '../../../../ui/Loading';
import ToggleSwitch from './../../../../ui/ToggleSwitch';
import { toast } from 'react-hot-toast';

function EditHouseCancellationRules({ houseData, handleEditHouse, editLoading }) {
  const { data: cancellationRules, isLoading, error } = useFetchCancellationRules();
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [errors, setErrors] = useState({});

  // Set initial selectedRuleId based on houseData after rules are fetched
  useEffect(() => {
    if (houseData?.cancellation_rule?.id && cancellationRules?.length) {
      setSelectedRuleId(houseData.cancellation_rule.id);
    }
  }, [houseData, cancellationRules]);

  if (isLoading) return <Loading />;
  if (error) return <div>Error fetching cancellation rules.</div>;

  // Handle toggle selection without submitting
  const handleToggle = (ruleId) => {
    const newSelectedRuleId = selectedRuleId === ruleId ? null : ruleId;
    setSelectedRuleId(newSelectedRuleId);
  };

  // Submit changes when the button is pressed
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!selectedRuleId) {
      setErrors({ cancellation_rule_id: ['لطفاً یک قانون کنسلی را انتخاب کنید.'] });
      toast.error('لطفاً یک قانون کنسلی را انتخاب کنید.');
      return;
    }

    try {
      await handleEditHouse({ cancellation_rule_id: selectedRuleId });
      toast.success('قوانین کنسلی با موفقیت به‌روزرسانی شد');
    } catch (error) {
      console.error('Error submitting cancellation rules:', error);
      if (error.response?.data?.errors?.fields) {
        setErrors(error.response.data.errors.fields);
      }
      toast.error('خطایی رخ داده است.');
    }
  };

  return (
    <div className="p-1.5 lg:p-3">
      <h2 className="text-lg font-bold">قوانین کنسلی</h2>
      <form onSubmit={handleSubmit}>
        {cancellationRules?.map((rule) => (
          <div
            key={rule.id}
            className={`border p-3 lg:p-4 rounded-2xl m-2 shadow-centered ${
              selectedRuleId === rule.id ? 'border-primary-400 bg-primary-50 border-opacity-30' : 'border-gray-300'
            }`}
            onClick={() => handleToggle(rule.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="flex items-center">
              <ToggleSwitch
                checked={selectedRuleId === rule.id}
                onChange={() => handleToggle(rule.id)}
                icon={null}
              />
              <h3 className="font-semibold">{rule.title}</h3>
            </div>
            <div className="text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: rule.description }} />
          </div>
        ))}
        {errors.cancellation_rule_id && (
          <p className="mt-2 text-sm text-red-600">{errors.cancellation_rule_id[0]}</p>
        )}
        <div className="mt-4 w-full lg:col-span-2 flex justify-end">
          <button
            type="submit"
            className="btn bg-primary-600 text-white px-3 py-1.6 shadow-xl hover:bg-primary-800 transition-colors duration-200"
            disabled={editLoading}
          >
            {editLoading ? 'در حال ذخیره...' : 'ثبت اطلاعات'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditHouseCancellationRules;
