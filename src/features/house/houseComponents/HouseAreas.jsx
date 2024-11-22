import React from 'react';

const areas = [
  {
    color: "#ffa800",
    icon: "https://test.jatajar.com/storage/svg/cache/fas-cow.svg",
    key: "Village",
    label: "روستایی",
  },
  {
    color: "#000000",
    icon: "https://test.jatajar.com/storage/svg/cache/hugeicons-city-03.svg",
    key: "Countryside",
    label: "حومه شهری",
  },
  {
    color: "#00f7ff",
    icon: "https://test.jatajar.com/storage/svg/cache/maki-beach.svg",
    key: "Beach",
    label: "ساحلی",
  },
  {
    color: "#120101",
    icon: "https://test.jatajar.com/storage/svg/cache/maki-town.svg",
    key: "Town",
    label: "شهری",
  },
  {
    color: "#42ff00",
    icon: "https://test.jatajar.com/storage/svg/cache/gmdi-forest-o.svg",
    key: "Forest",
    label: "جنگلی",
  },
  {
    color: "#080000",
    icon: "https://test.jatajar.com/storage/svg/cache/lineawesome-mountain-solid.svg",
    key: "Mountainou",
    label: "کوهستانی",
  },
  {
    color: "#f50e0e",
    icon: "https://test.jatajar.com/storage/svg/cache/phosphor-mountains-thin.svg",
    key: "Summerhouse",
    label: "ییلاقی",
  },
  {
    color: "#1a0101",
    icon: "https://test.jatajar.com/storage/svg/cache/hugeicons-desert.svg",
    key: "Desert",
    label: "بیابانی",
  },
];

const HouseAreas = () => {
  return (
    <div>
        <p>بافت محیط :</p>
    <div className="flex flex-wrap w-full gap-1 my-1">
        
      {areas.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-primary-50 shadow"
          
        >
          <img
            src={item.icon}
            alt={item.label}
            className="w-6 h-6"
          />
          <span className="font-medium">{item.label}</span>
        </div>
      ))}
    </div>
    </div>
  );
};

export default HouseAreas;
