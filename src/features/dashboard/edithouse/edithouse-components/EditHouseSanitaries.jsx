// src/components/edithouse-components/EditHouseSanitaries.jsx

import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { toast, Toaster } from 'react-hot-toast';
import Loading from '../../../../ui/Loading';
import { useFetchSanitaryOptions } from '../../../../services/fetchDataService';
import ToggleSwitch from '../../../../ui/ToggleSwitch';

const EditHouseSanitaries = forwardRef((props, ref) => {
  const { houseId, houseData, handleEditHouse, loadingHouse } = props;
  const { data: sanitaryOptions = [], isLoading } = useFetchSanitaryOptions();
  const [selectedSanitaries, setSelectedSanitaries] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorList, setErrorList] = useState([]);

  useEffect(() => {
    if (Array.isArray(houseData?.sanitaries)) {
      setSelectedSanitaries(houseData.sanitaries.map((sanitary) => sanitary.key));
    }
  }, [houseData]);

  const toggleSanitary = (key) => {
    setSelectedSanitaries((prevSelected) => {
      const updatedSelection = prevSelected.includes(key)
        ? prevSelected.filter((sanitary) => sanitary !== key)
        : [...prevSelected, key];
      setIsModified(true);
      return updatedSelection;
    });
  };

  const validateAndSubmit = async () => {
    if (!isModified) {
      console.log('No changes detected, submission skipped.');
      return true;
    }

    setErrors({});
    setErrorList([]);
    console.log('Validating and submitting sanitaries data.');

    const updatedData = { sanitaries: selectedSanitaries };

    try {
      await handleEditHouse(updatedData);
      toast.success('اطلاعات بهداشتی با موفقیت ثبت شد');
      setIsModified(false);
      return true;
    } catch (errorData) {
      console.error('Submission Error:', errorData);
      if (errorData.errors || errorData.message) {
        if (errorData.errors?.fields) {
          const fieldErrors = errorData.errors.fields;
          const updatedErrors = {};
          const errorsArray = Object.values(fieldErrors).flat();

          for (let field in fieldErrors) {
            updatedErrors[field] = fieldErrors[field];
          }
          setErrors(updatedErrors);
          setErrorList(errorsArray);
        }

        if (errorData.message) {
          toast.error(errorData.message);
        }
      } else {
        toast.error('خطایی در ثبت اطلاعات پیش آمد');
      }
      return false;
    }
  };

  useImperativeHandle(ref, () => ({
    validateAndSubmit,
  }));

  if (isLoading || loadingHouse) {
    console.log('Loading data...');
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full p-2">
      <Toaster />
      {errorList.length > 0 && (
        <div className="error-list mb-4">
          {errorList.map((error, index) => (
            <div key={index} className="text-red-500 text-sm">
              {error}
            </div>
          ))}
        </div>
      )}
      <form className="flex-1 overflow-y-auto scrollbar-thin max-h-full">
        <h4 className="text-right font-bold lg:text-lg mb-2 px-1">امکانات بهداشتی :</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sanitaryOptions.map((option) => (
            <div key={option.key} className="flex items-center space-x-2">
              <ToggleSwitch
                checked={selectedSanitaries.includes(option.key)}
                onChange={() => toggleSanitary(option.key)}
                label={option.label}
                icon={option.icon}
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
});

export default EditHouseSanitaries;
