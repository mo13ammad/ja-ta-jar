import React from "react";
import { Rating } from "flowbite-react";

function HouseHeader() {
  // Static rating value for demonstration
  const staticRating = 4;
  const fullStars = Math.floor(staticRating); // Number of full stars
  const hasHalfStar = staticRating % 1 !== 0; // Check if there's a half star
  const emptyStars = 5 - Math.ceil(staticRating); // Remaining empty stars

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">عنوان اقامتگاه</h1>
      <div className="flex max-w-40 items-center rounded-xl gap-2 px-3 py-2 mt-2 bg-secondary-50">
        <Rating >
          {/* Full stars */}
          {Array.from({ length: fullStars }, (_, index) => (
            <Rating.Star
              key={`full-${index}`}
              className="text-primary-600"
              filled={true}
            />
          ))}

          {/* Half star */}
          {hasHalfStar && (
            <Rating.Star
              className="relative text-primary-600 overflow-hidden"
            >
              <div
                className="absolute inset-0 w-1/2 h-full bg-primary-600"
                style={{ clipPath: "inset(0 50% 0 0)" }}
              ></div>
            </Rating.Star>
          )}

          {/* Empty stars */}
          {Array.from({ length: emptyStars }, (_, index) => (
            <Rating.Star
              key={`empty-${index}`}
              className="text-secondary-900"
              filled={false}
            />
          ))}
        </Rating>
        <span className="text-sm text-primary-700">({staticRating.toFixed(1)})</span> {/* Static rating value */}
      </div>
    </div>
  );
}

export default HouseHeader;
