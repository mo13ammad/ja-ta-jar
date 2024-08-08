import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Mizban from '../assets/mizban.jpg';
import Beach from '../assets/1.png';
import Mountain from '../assets/4.png';
import Forest from '../assets/2.png';
import Desert from '../assets/3.png';

function Body() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className=" container min-h-96 mx-auto p-4 max-w-5xl  pt-8 px-8 ">
      <img src={Mizban} alt="Mizban" className="w-full min-h-40  rounded-3xl" />
      
      <Slider {...settings} className="">
        <div>
          <img src={Beach} alt="Beach" className="w-full min-h-40 mt-10 rounded-3xl" />
        </div>
        <div>
          <img src={Mountain} alt="Mountain" className="w-full min-h-40 mt-10 rounded-3xl" />
        </div>
        <div>
          <img src={Forest} alt="Forest" className="w-full min-h-40 mt-10 rounded-3xl" />
        </div>
        <div>
          <img src={Desert} alt="Desert" className="w-full min-h-40 mt-10 rounded-3xl" />
        </div>
      </Slider>
    </div>
  );
}

export default Body;
