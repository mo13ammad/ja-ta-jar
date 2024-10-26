
const HouseCard = ({ house, onDelete }) => {
    return (
      <div className="house-card-container">
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
          <div className="action-buttons-container">
            <button className="btn hover:opacity-100 bg-primary-500">ویرایش</button>
            <button className="btn hover:opacity-100 bg-gray-400">مشاهده</button>
            <button className="btn hover:opacity-100 bg-red-500" onClick={onDelete}>
              حذف
            </button>
          </div>
        </div>
        <img src={house.image} className="house-image" alt="house" />
      </div>
    );
  };
  

  export default HouseCard;