// src/components/edithouse-components/EditHouseDocuments.jsx

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { uploadHouseDocument } from "../../../../services/houseService";

const EditHouseDocuments = ({ houseData, houseId, refetchHouseData }) => {
  const [loading, setLoading] = useState(false);
  const [documentFiles, setDocumentFiles] = useState({});

  useEffect(() => {
    console.log("Loaded houseData:", houseData);
  }, [houseData]);

  // Function to display errors based on error.response.data.message
  const displayError = (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || "خطایی رخ داده است";
    toast.error(errorMessage);
  };

  const handleDocumentChange = (event, documentType) => {
    const file = event.target.files[0];
    if (!file) return;

    setDocumentFiles((prevFiles) => ({
      ...prevFiles,
      [documentType]: file,
    }));
    console.log(`File for ${documentType} selected:`, file);
  };

  const handleDocumentUpload = async (documentType, file) => {
    const documentData = {
      document_type: documentType,
      document: file,
    };

    console.log("Uploading document data:", documentData);

    try {
      await uploadHouseDocument(houseId, documentData);
      // Removed individual success toast
    } catch (error) {
      displayError(error);
      console.error("Document Upload Error:", error);
      // Re-throw to propagate error to handleSubmitAll
      throw error;
    }
  };

  const handleSubmitAll = async () => {
    setLoading(true);

    const uploadPromises = Object.entries(documentFiles).map(
      ([documentType, file]) => handleDocumentUpload(documentType, file),
    );

    try {
      const results = await Promise.allSettled(uploadPromises);

      const allFulfilled = results.every(
        (result) => result.status === "fulfilled",
      );
      if (allFulfilled) {
        toast.success(" مدارک با موفقیت بارگذاری شدند.");
      } else {
        toast.error("خطا در بارگذاری برخی مدارک.");
      }
      refetchHouseData();
      // Clear selected files
      setDocumentFiles({});
    } catch (error) {
      toast.error("خطا در بارگذاری مدارک.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-upload-container p-4">
      <h2 className="font-bold mb-4">مدارک مورد نیاز</h2>

      {houseData?.documents?.map((doc, index) => {
        return (
          <div key={`${doc.type.key}-${index}`} className="mb-6">
            <div className="flex gap-2 m-1">
              <img
                src={doc?.type?.icon}
                alt={`${doc?.type?.label} icon`}
                className="w-6 h-6"
              />
              <label className="block font-medium mb-1">
                {doc?.type?.label}
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="file"
                disabled={!doc.can_edit}
                onChange={(event) => handleDocumentChange(event, doc.type.key)}
                className={`border rounded-lg p-2 w-full ${doc.can_edit ? "bg-white" : "bg-gray-200"}`}
              />
            </div>
            <div className="mt-1 text-sm text-gray-600">
              وضعیت:{" "}
              <span className={`text-${doc.type.color}`}>
                {doc.status.label}
              </span>
            </div>
          </div>
        );
      })}

      <button
        onClick={handleSubmitAll}
        disabled={loading || Object.keys(documentFiles).length === 0}
        className="btn bg-primary-600"
      >
        {loading ? "در حال بارگذاری..." : "ثبت همه مدارک"}
      </button>
    </div>
  );
};

export default EditHouseDocuments;
