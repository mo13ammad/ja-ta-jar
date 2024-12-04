import React from "react";
import Vote from "../../../ui/Vote";

function HouseComments({ houseData }) {
  const { comments } = houseData || {};

  // If no comments, return a fallback message
  if (!comments || comments.length === 0) {
    return <p className="text-gray-500 text-sm mt-4">هنوز نظری ثبت نشده است.</p>;
  }

  return (
    <div className="px-2">
      <h2 className="text-lg font-semibold mb-4">نظرات کاربران</h2>
    <div className="w-full mt-6 py-1 px-1 bg-gray-50 rounded-2xl ">
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div
            key={index}
            className="flex items-center     gap-4 border-b p-2"
          >
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
            <Vote vote={comment.vote} size="sm"/>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default HouseComments;
