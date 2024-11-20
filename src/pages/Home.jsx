import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Mizban from '../../public/assets/Mizban.jpg';
import Beach from '../../public/assets/1.webp';
import Mountain from '../../public/assets/4.webp';
import Forest from '../../public/assets/2.webp';
import Desert from '../../public/assets/3.webp';

function MainPage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  }

  return (
    <div className="container min-h-96 mx-auto p-4 max-w-5xl px-8">
      <a href="/dashboard">
        <img src={Mizban} alt="Mizban" className="w-full min-h-40 rounded-3xl" />
      </a>      
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
  )
}

export default MainPage
