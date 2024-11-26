// src/components/edithouse-components/EditHouseStayRules.jsx

import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import Spinner from "../../../../ui/Loading";
import TextField from "../../../../ui/TextField";
import ToggleSwitch from "../../../../ui/ToggleSwitch";
import { useFetchRules } from "../../../../services/fetchDataService";
import { toast } from "react-hot-toast";

const statusOptions = [
  { key: "NotAllowed", label: "غیر مجاز" },
  { key: "Allowed", label: "مجاز" },
  { key: "Needed", label: "نیاز است" },
  { key: "NotNeeded", label: "نیاز نیست" },
];

const EditHouseStayRules = forwardRef(
  ({ houseData, handleEditHouse, loadingHouse, refetchHouseData }, ref) => {
    const { data: rulesData = [], isLoading: loadingRules } = useFetchRules();
    const [selectedRules, setSelectedRules] = useState({});
    const [descriptions, setDescriptions] = useState({});
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const [errorList, setErrorList] = useState([]);

    useEffect(() => {
      if (rulesData.length > 0 && Array.isArray(houseData?.rules?.types)) {
        const initialSelectedRules = rulesData.reduce((acc, rule) => {
          const matchedRule = houseData.rules.types.find(
            (r) => r.key === rule.key,
          );
          acc[rule.key] = matchedRule ? matchedRule.status.key : null;
          return acc;
        }, {});

        const initialDescriptions = rulesData.reduce((acc, rule) => {
          const matchedRule = houseData.rules.types.find(
            (r) => r.key === rule.key,
          );
          acc[rule.key] = matchedRule?.description || "";
          return acc;
        }, {});

        setSelectedRules(initialSelectedRules);
        setDescriptions(initialDescriptions);
      }
    }, [rulesData, houseData.rules]);

    const handleOptionToggle = (ruleKey, optionKey) => {
      setSelectedRules((prev) => ({
        ...prev,
        [ruleKey]: prev[ruleKey] === optionKey ? null : optionKey, // Toggle selection
      }));
      setIsModified(true);
    };

    const handleNoteChange = (ruleKey, value) => {
      setDescriptions((prev) => ({
        ...prev,
        [ruleKey]: value,
      }));
      setIsModified(true);
    };

    const validateAndSubmit = async () => {
      if (!isModified) {
        console.log("No changes detected, submission skipped.");
        return true;
      }

      setLoadingSubmit(true);
      setErrorList([]);

      try {
        const updatedData = {
          rules: Object.keys(selectedRules)
            .filter((key) => selectedRules[key] !== null)
            .map((key) => ({
              key,
              status: selectedRules[key],
              description: descriptions[key] || "",
            })),
        };

        await handleEditHouse(updatedData);
        await refetchHouseData(); // Refetch house data after submission
        toast.success("اطلاعات با موفقیت ثبت شد");
        setIsModified(false);
        return true;
      } catch (error) {
        console.error("Error submitting rules:", error);
        toast.error("خطایی در ثبت اطلاعات پیش آمد");
        setErrorList(["Failed to update rules. Please try again."]);
        return false;
      } finally {
        setLoadingSubmit(false);
      }
    };

    useImperativeHandle(ref, () => ({
      validateAndSubmit,
    }));

    if (loadingHouse || loadingRules) {
      return (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner />
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="overflow-auto scrollbar-thin pt-2 px-2 lg:px-4 w-full">
          <div className="text-right font-bold lg:text-lg mb-4">
            قوانین اقامت :
          </div>

          {errorList.length > 0 && (
            <div className="error-list mb-4">
              {errorList.map((error, index) => (
                <div key={index} className="text-red-500 text-sm">
                  {error}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rulesData.map((rule) => (
              <div
                key={rule.key}
                className="mt-4 p-4 border rounded-xl shadow-centered"
              >
                <span className="block text-sm font-medium mb-2">
                  {rule.label}
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((option) => (
                    <ToggleSwitch
                      key={option.key}
                      checked={selectedRules[rule.key] === option.key}
                      onChange={() => handleOptionToggle(rule.key, option.key)}
                      label={option.label}
                    />
                  ))}
                </div>

                <div className="mt-2">
                  <TextField
                    label="یادداشت"
                    placeholder="یادداشت خود را وارد کنید (اختیاری)"
                    value={descriptions[rule.key] || ""}
                    onChange={(e) => handleNoteChange(rule.key, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 w-full lg:col-span-2 flex justify-end">
            <button
              className="btn bg-primary-600 text-white px-4 py-2 shadow-lg hover:bg-primary-800 transition-colors duration-200"
              onClick={validateAndSubmit}
              disabled={loadingSubmit}
            >
              {loadingSubmit ? "در حال بارگذاری..." : "ثبت اطلاعات"}
            </button>
          </div>
        </div>
      </div>
    );
  },
);

export default EditHouseStayRules;
