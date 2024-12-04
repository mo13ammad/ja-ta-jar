import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid'
import { StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline'
import React from 'react'
import toPersianNumber from './../utils/toPersianNumber';

function Vote({ vote, size = 'sm' }) {
  if (size === 'sm') {
    // Small version: single star and number
    return (
      <div className="flex py-0.5 bg-primary-50 rounded-2xl px-2 items-center">
        <SolidStarIcon className="h-4 w-4 text-primary-600" />
        <span className='mr-1 pt-0.5'>{toPersianNumber(vote)}</span>
      </div>
    )
  }

  // Large version: full set of stars and number
  const stars = []

  for (let i = 1; i <= 5; i++) {
    const starFill = Math.min(Math.max(vote - (i - 1), 0), 1)
    if (starFill === 1) {
      // Full star
      stars.push(
        <SolidStarIcon key={i} className="h-5 w-5 text-primary-600" />
      )
    } else if (starFill > 0) {
      // Partially filled star (filled from the right)
      stars.push(
        <div key={i} className="relative h-5 w-5" key={i}>
          <SolidStarIcon
            className="absolute inset-0 text-primary-600"
            style={{ clipPath: `inset(0 0 0 ${100 - starFill * 100}%)` }}
          />
          <OutlineStarIcon className="absolute inset-0 text-primary-600" />
        </div>
      )
    } else {
      // Empty star
      stars.push(
        <OutlineStarIcon key={i} className="h-5 w-5 text-primary-600" />
      )
    }
  }

  return (
    <div className="flex py-0.5   items-center">
      {stars}
      <span className='mr-1 pt-0.5 text-base'>{toPersianNumber(vote)}</span>
    </div>
  )
}

export default Vote
