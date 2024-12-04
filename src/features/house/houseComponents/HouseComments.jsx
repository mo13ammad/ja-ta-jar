import React from "react";
import Vote from "../../../ui/Vote";

function HouseComments({ houseData }) {
  const { comments,vendor } = houseData || {};

  // If no comments, return a fallback message
  if (!comments || comments.length === 0) {
    return (
      <div className="px-2">
        <h2 className="text-lg font-semibold mb-4">نظرات کاربران</h2>
        <p className="text-gray-500 px-4 text-sm mt-4">هنوز نظری ثبت نشده است.</p>
      </div>
    );
  }

  return (
    <div className="px-2">
      <h2 className="text-lg font-semibold mb-4">نظرات کاربران</h2>
      <div className="w-full mt-6 py-1 px-1 bg-gray-50 rounded-2xl ">
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div
              key={index}
              className={`flex flex-col  gap-4 p-2 ${
                index !== comments.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="flex items-center  g">
              {/* Avatar */}
              <img
                src={comment.avatar}
                alt={comment.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {/* Comment Details */}
              <div className="flex-1">
                <div className="flex items-center ">
                  <h3 className="text-base font-semibold">{comment.name}</h3>
                  <span className="text-xs text-gray-400 mr-6">
                    {comment.created_at}
                  </span>
                </div>
                <p className="text-sm mt-2 text-gray-700">{comment.comment}</p>
                
              
              </div>
              {/* Vote */}
              <Vote vote={comment.vote} size="sm" />
              </div>
              {comment.replay && 
                <div className="p-2 pr-4 flex flex-col  rounded-2xl bg-gray-200 bg-opacity-50">
                <div className="w-full flex gap-1 h-14   p-1 ">
                   <div className="w-12  overflow-hidden  h-full  rounded-full">
                    <img src={vendor.avatar} alt="" className="block" />
                     </div>

                    <div className="flex  gap-4 p-1 justify-center items-center">
                   
                <h4 className="font-bold">پاسخ میزبان</h4>
                   </div>
                 </div>
                <p className="pr-3">{comment.replay}</p>
                </div>
                }
            </div>
            
          ))}
          
        </div>
      </div>
    </div>
  );
}

export default HouseComments;
