import React from 'react'
import VendorImage from '../imgs/vendor-image.jpg'

function HouseVendorBadge() {
  return (
    <div className='w-full flex gap-1 h-14 rounded-3xl bg-secondary-100 p-1'>
        
        <div className='w-12  overflow-hidden  h-full  rounded-full'>
          <img src={VendorImage} alt="" className='block'   />
        </div>
        
        <div className='flex  flex-col p-1 justify-center items-center'>
            <p className='text-sm font-medium'>محمد رضا قاسمی</p>     
        </div>


    </div>
  )
}

export default HouseVendorBadge