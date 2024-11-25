import React from "react";

function HouseSpace({ houseData }) {
  const { structure, reservation,areas } = houseData;

  return (
    <div className="rounded-xl w-full">
      {/* Title */}
      <h3 className="text-lg font-bold text-gray-800 mb-2">فضای اقامتگاه :</h3>

      {/* Content Section */}
      <div className="flex  gap-7 px-1 ">
        {/* Standard Capacity */}

        <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <strong className="text-gray-700">ظرفیت استاندارد:</strong>
          <span>{reservation?.capacity?.normal || "نامشخص"} نفر</span>
        </div>


        {/* Building Size */}
        <div className="flex items-center gap-3">
          <strong className="text-gray-700">متراژ زیربنا:</strong>
          <span>{structure?.size || "نامشخص"} متر</span>
        </div>
        {/* Type of Accommodation */}
        <div className="flex items-center gap-3">
          <strong className="text-gray-700">نوع اقامتگاه:</strong>
          <span>{structure?.label || "نامشخص"}</span>

        </div>
        </div>
        <div className="flex flex-col gap-2">
        {/* Maximum Capacity */}
        <div className="flex items-center gap-3">
          <strong className="text-gray-700">حداکثر ظرفیت:</strong>
          <span>{reservation?.capacity?.maximum || "نامشخص"} نفر</span>
        </div>
        {/* Land Size */}
        <div className="flex items-center gap-3">
          <strong className="text-gray-700">متراژ محوطه:</strong>
          <span>{structure?.land_size || "نامشخص"} متر</span>
        </div>


        {/* Region */}
        <div className="flex items-center gap-3">
          <strong className="text-gray-700">منطقه:</strong>
          {areas.map((item, index) => (
        <div
          key={index}
          className="flex items-center"
          
        >
         
          <span className="font-medium">{item.label}</span>
        </div>
      ))}
        </div>
        </div>
      </div>
    </div>
  );
}

export default HouseSpace;
