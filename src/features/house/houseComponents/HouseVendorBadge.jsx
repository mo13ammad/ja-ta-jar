import React from 'react'


function HouseVendorBadge({hostInfo}) {

  return (
    <div className='w-full flex gap-1 h-14 rounded-3xl  p-1 '>
        
        <div className='w-12  overflow-hidden  h-full  rounded-full'>
          <img src={hostInfo.avatar} alt="" className='block'   />
        </div>
        
        <div className='flex  flex-col p-1 justify-center items-center'>
            <p className='text-sm font-medium truncate'>{hostInfo.name}</p>     
        </div>


    </div>
  )
}

export default HouseVendorBadge