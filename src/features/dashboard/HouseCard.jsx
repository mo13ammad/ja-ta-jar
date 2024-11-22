// src/components/HouseCard.jsx

import { useNavigate } from "react-router-dom";

const HouseCard = ({ house, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="house-card-container shadow-centered max-h-64">
      <div className="house-info-container">
        <div className="info-item">
          <p className="font-semibold w-7 md:w-9">نام :</p>
          <p>{house.name}</p>
        </div>
        <div className="info-item">
          <p className="font-semibold">نوع اقامتگاه :</p>
          <p>{house.structure.label}</p>
        </div>
        <div className="info-item">
          <p className="font-semibold">وضعیت :</p>
          <p>{house.status.label}</p>
        </div>
        <div className="action-buttons-container flex flex-col">
          <div className="flex gap-1">
          <button
            className="btn hover:opacity-100 bg-primary-500"
            onClick={() => navigate(`/dashboard/edit-house/${house.uuid}`)}
          >
            ویرایش
          </button>
          <button
            className="btn hover:opacity-100 bg-primary-500"
            onClick={() => navigate(`/house/${house.uuid}`)}
          >
            مشاهده
          </button>
          <button
            className="btn hover:opacity-100 bg-red-500"
            onClick={onDelete}
          >
            حذف
          </button>
          </div>
          <div>
          <button
            className="btn hover:opacity-100 bg-primary-500"
            onClick={()=>{}}
          >
            تقویم
          </button>
          </div>
        </div>
      </div>
      <img src={house.image} className="house-image" alt="house" />
    </div>
  );
};

export default HouseCard;
