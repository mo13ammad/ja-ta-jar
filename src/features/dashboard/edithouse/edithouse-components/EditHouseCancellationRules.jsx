// src/components/edithouse-components/EditHouseCancellationRules.jsx

import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useFetchCancellationRules } from '../../../../services/fetchDataService';
import Loading from '../../../../ui/Loading';
import ToggleSwitch from './../../../../ui/ToggleSwitch';
import { toast, Toaster } from 'react-hot-toast';

const EditHouseCancellationRules = forwardRef((props, ref) => {
  const { houseData, handleEditHouse, loadingHouse } = props;
  const { data: cancellationRules, isLoading, error } = useFetchCancellationRules();
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [initialRuleId, setInitialRuleId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Set initial selectedRuleId based on houseData after rules are fetched
  useEffect(() => {
    if (houseData?.cancellation_rule?.id && cancellationRules?.length) {
      setSelectedRuleId(houseData.cancellation_rule.id);
      setInitialRuleId(houseData.cancellation_rule.id);
    }
  }, [houseData, cancellationRules]);

  const handleToggle = (ruleId) => {
    const newSelectedRuleId = selectedRuleId === ruleId ? null : ruleId;
    setSelectedRuleId(newSelectedRuleId);
    setIsModified(newSelectedRuleId !== initialRuleId);
    setErrors({});
  };

  const validateAndSubmit = async () => {
    if (!isModified) {
      console.log('No changes detected, submission skipped.');
      return true;
    }

    setErrors({});

    if (!selectedRuleId) {
      setErrors({ cancellation_rule_id: ['لطفاً یک قانون کنسلی را انتخاب کنید.'] });
      toast.error('لطفاً یک قانون کنسلی را انتخاب کنید.');
      return false;
    }

    setLoadingSubmit(true);

    try {
      await handleEditHouse({ cancellation_rule_id: selectedRuleId });
      toast.success('قوانین کنسلی با موفقیت به‌روزرسانی شد');
      setIsModified(false);
      setInitialRuleId(selectedRuleId);
      return true;
    } catch (errorData) {
      console.error('Error submitting cancellation rules:', errorData);
      if (errorData.errors?.fields) {
        setErrors(errorData.errors.fields);
      }
      toast.error('خطایی رخ داده است.');
      return false;
    } finally {
      setLoadingSubmit(false);
    }
  };

  useImperativeHandle(ref, () => ({
    validateAndSubmit,
  }));

  if (isLoading || loadingHouse) {
    console.log('Loading data...');
    return (
      <div className='flex justify-center items-center min-h-[50vh]'>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching cancellation rules.</div>;
  }

  return (
    <div className="p-1.5 lg:p-3">
      <Toaster />
      {errors.cancellation_rule_id && (
        <p className="mt-2 text-sm text-red-600">{errors.cancellation_rule_id[0]}</p>
      )}
      <h2 className="text-lg font-bold">قوانین کنسلی</h2>
      <div>
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
      </div>
    </div>
  );
});

export default EditHouseCancellationRules;
