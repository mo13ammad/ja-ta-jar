// src/components/HouseCard.jsx

import { useNavigate } from "react-router-dom";

const HouseCard = ({ house, onDelete }) => {
  const navigate = useNavigate();
  const isPending = house.status.key === "Pending";
  return (
    <div className="house-card-container shadow-centered max-h-64">
      <div className="house-info-container">
        <div className="info-item">
          <p className="font-semibold">نام :</p>
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
  className={`btn bg-primary-500 hover:opacity-100 ${
    isPending ? "opacity-50 cursor-not-allowed hover:opacity-50" : ""
  }`}
  onClick={() => navigate(`/dashboard/edit-house/${house.uuid}`)}
  disabled={isPending}
  title={isPending ? "در حال بررسی، امکان ویرایش در دسترس نیست" : "ویرایش اقامتگاه"}
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
