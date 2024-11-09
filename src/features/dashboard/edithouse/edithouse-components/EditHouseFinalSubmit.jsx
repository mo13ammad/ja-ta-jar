import React, { useState } from "react";
import { publishHouse } from "../../../../services/houseService";
import { toast } from "react-hot-toast";

const EditHouseFinalSubmit = ({ houseId, refetchHouseData }) => {
  const [publishing, setPublishing] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [generalErrorMessage, setGeneralErrorMessage] = useState('');

  const handleFinalSubmit = async () => {
    setPublishing(true);
    setErrorMessages([]);
    setGeneralErrorMessage('');

    try {
      await publishHouse(houseId);
      toast.success("اقامتگاه با موفقیت ثبت شد.");
      refetchHouseData(); // Optionally refresh data after publishing
    } catch (error) {
      if (error.response?.data) {
        const { message, errors } = error.response.data;

        // Set the general error message if it exists
        if (message) {
          setGeneralErrorMessage(message);
        }

        // Extract only the field-specific error messages in Persian
        if (errors?.fields) {
          const formattedErrors = Object.values(errors.fields).flat();
          setErrorMessages(formattedErrors);
        } else {
          toast.error("خطایی در ثبت نهایی اقامتگاه رخ داده است.");
        }
      } else {
        toast.error("خطایی در ثبت نهایی اقامتگاه رخ داده است.");
      }
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex flex-col justify-end p-4">
      {/* Display general error message if present */}
      {generalErrorMessage && (
        <div className="bg-red-100 text-red-600 p-4 rounded-md mb-4">
          <h3 className="font-semibold">پیام خطا:</h3>
          <p>{generalErrorMessage}</p>
        </div>
      )}

      {/* Display field-specific error messages if any */}
      {errorMessages.length > 0 && (
        <div className="bg-red-100 text-red-600 p-4 rounded-md mb-4">
          <h3 className="font-semibold">خطاها:</h3>
          <ul className="list-disc list-inside">
            {errorMessages.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        className="btn shadow-centered bg-primary-600 text-white mt-4"
        onClick={handleFinalSubmit}
        disabled={publishing} // Disable button during publishing
      >
        {publishing ? "در حال ثبت ..." : "ثبت نهایی اقامتگاه"}
      </button>
    </div>
  );
};

export default EditHouseFinalSubmit;
