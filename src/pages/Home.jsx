import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Mizban from '../../public/assets/Mizban.jpg';
import Beach from '../../public/assets/1.webp';
import Mountain from '../../public/assets/4.webp';
import Forest from '../../public/assets/2.webp';
import Desert from '../../public/assets/3.webp';

function MainPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2024-12-02T12:00:00'); // تاریخ افتتاحیه سایت
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="container min-h-96 mx-auto p-4 max-w-5xl px-8">
      {/* لینک به داشبورد */}
      <a href="/dashboard">
        <img src={Mizban} alt="Mizban" className="w-full min-h-40 rounded-3xl" />
      </a>

      {/* تایمر شمارش معکوس */}
      <div className="text-center my-8">
        <h2 className="text-2xl font-bold">افتتاحیه سایت</h2>
        <div className="text-xl mt-4">
          <span>{timeLeft.days} روز </span>
          <span>{timeLeft.hours} ساعت </span>
          <span>{timeLeft.minutes} دقیقه </span>
          <span>{timeLeft.seconds} ثانیه </span>
        </div>
      </div>

      {/* اسلایدر */}
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

export default MainPage;
