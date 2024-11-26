import React from "react";
import toPersianNumber from "../../../utils/toPersianNumber";

function HouseSpace({ houseData }) {
  const { structure, reservation, areas } = houseData;

  return (
    <div className="w-full px-3">
      {/* Title */}
      <h3 className="text-lg font-bold text-gray-800 mb-2">فضای اقامتگاه :</h3>

      {/* Content Section */}
      <div className="flex flex-row gap-5 xs:gap-7 px-1">
        {/* Left Column */}
        <div className="flex flex-col w-1/2 lg:w-auto gap-2">
          {/* Standard Capacity */}
          <div className="flex items-center gap-3">
            <strong className="text-gray-700">ظرفیت استاندارد:</strong>
            <span>
              {toPersianNumber(reservation?.capacity?.normal) || "نامشخص"} نفر
            </span>
          </div>

          {/* Building Size */}
          <div className="flex items-center gap-3">
            <strong className="text-gray-700">متراژ زیربنا:</strong>
            <span>
              {toPersianNumber(structure?.size) || "نامشخص"} متر
            </span>
          </div>

          {/* Type of Accommodation */}
          <div className="flex items-center gap-3">
            <strong className="text-gray-700">نوع اقامتگاه:</strong>
            <span>{structure?.label || "نامشخص"}</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col w-1/2 lg:w-auto gap-2">
          {/* Maximum Capacity */}
          <div className="flex items-center gap-3">
            <strong className="text-gray-700">حداکثر ظرفیت:</strong>
            <span>
              {toPersianNumber(reservation?.capacity?.maximum) || "نامشخص"} نفر
            </span>
          </div>

          {/* Land Size */}
          <div className="flex items-center gap-3">
            <strong className="text-gray-700">متراژ محوطه:</strong>
            <span>
              {toPersianNumber(structure?.land_size) || "نامشخص"} متر
            </span>
          </div>

          {/* Region */}
          <div className="flex flex-wrap items-center gap-3">
            <strong className="text-gray-700">منطقه:</strong>
            {areas && areas.length > 0
              ? areas.map((item, index) => (
                  <span key={index} className="font-medium">
                    {item.label}
                  </span>
                ))
              : "نامشخص"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HouseSpace;
