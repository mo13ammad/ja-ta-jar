import React, { useState } from 'react'
import PeopleDropdown from './PeopleNumberDropDown'

function ReserveMenuDesktop() {
    const [reserveDateFrom, setreServeDateFrom] = useState("10/8/1403");
    const [reserveDateTo, setreServeDateTo] = useState(null);
  return (
    <div>
          <div className="flex flex-col w-full px-4">
            {/* Add the content you want to display when expanded */}
            <p className="my-1">
                 تاریخ رزرو
            </p>
            <div className="h-12 my-1.5 w-full flex items-center justify-between rounded-xl shadow-centered bg-gray-100 px-4">
                  
            
                       <div className="flex-1 flex items-center justify-center  w-full h-full text-gray-700 text-sm">
                       {reserveDateFrom ?
                              <div className="h-full flex flex-col items-center justify-center w-full ">
                                <p className='text-md'>ورود</p>
                                <p>{reserveDateFrom}</p>
                              </div>
                                :
                              <div className="h-full flex items-center justify-center w-full">
                                <p className='text-md'>تاریخ ورود</p>
                              </div> 
                           }
                        </div>

                      {/*separator*/}
                      <div className="w-px h-6 bg-gray-400 mx-2"></div>

                   
                      <div className="flex-1 flex items-center justify-center  w-full h-full text-gray-700 text-sm">
                            {reserveDateTo ?
                              <div className="h-full flex flex-col items-center justify-center w-full ">
                                <p className='text-md'>خروج</p>
                                <p>{reserveDateTo}</p>
                              </div>
                                :
                              <div className="h-full flex items-center justify-center w-full">
                                <p className='text-md'>تاریخ خروج</p>
                              </div>
                           }
                       </div>
                 </div>
                  
                  <div className="my-2 mt-4">      
                  <p className="mb-1">تعداد نفرات :</p>
                    <PeopleDropdown/>
                  </div>
           

                 <div className="w-full my-3 mt-6">
                  <button className="w-full btn rounded-3xl bg-primary-500 hover:bg-primary-600 transition-all duration-300 px-4 py-2">رزرو</button>
                 </div>
          </div>
    </div>
  )
}

export default ReserveMenuDesktop