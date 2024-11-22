import React from 'react'
const data = [
    {
      color: "#00f7ff",
      icon: "https://test.jatajar.com/storage/svg/cache/iconoir-sea-and-sun.svg",
      key: "SeaView",
      label: "رو به دریا",
    },
    {
      color: "#ffa800",
      icon: "https://test.jatajar.com/storage/svg/cache/phosphor-mountains-light.svg",
      key: "MountainView",
      label: "رو به کوهستان",
    },
    {
      color: "#02030f",
      icon: "https://test.jatajar.com/storage/svg/cache/phosphor-city.svg",
      key: "Facingthecity",
      label: "رو به شهر",
    },
    {
      color: "#42ff00",
      icon: "https://test.jatajar.com/storage/svg/cache/gmdi-forest-o.svg",
      key: "ForestView",
      label: "رو به جنگل",
    },
    {
      color: "#18e647",
      icon: "https://test.jatajar.com/storage/svg/cache/healthicons-o-village.svg",
      key: "Facingthevillage",
      label: "رو به روستا",
    },
    {
      color: "#dde306",
      icon: "https://test.jatajar.com/storage/svg/cache/gameicon-desert.svg",
      key: "Facingtheplain",
      label: "رو به دشت ",
    },
    {
      color: "#1029e3",
      icon: "https://test.jatajar.com/storage/svg/cache/fluentui-stream-20-o.svg",
      key: "Riverside",
      label: "رو به رودخانه",
    },
  ];
  const HouseViews = () => {
    return (

    <div className='mt-1'>
        <p>منظره اقامتگاه :</p>
      <div className="flex flex-wrap w-full gap-1 my-1">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-green-100 shadow"
           
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