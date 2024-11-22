
  const HouseViews = ({houseViews}) => {
    const views = houseViews || []
    return (

    <div className='mt-1'>
        <p>منظره اقامتگاه :</p>
      <div className="flex flex-wrap w-full gap-1 my-1">
        {views.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-secondary-100 shadow-centered"
           
          >
            <img
              src={item.icon}
              alt={item.label}
              className="w-6 h-6"
            />
            <span className=" font-medium">{item.label}</span>
          </div>
        ))}
      </div>
      </div>
    );
  };
  
  export default HouseViews;