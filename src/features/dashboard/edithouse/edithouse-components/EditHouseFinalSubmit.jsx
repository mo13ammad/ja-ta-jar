import React, { useState } from "react";
import { toast } from "react-hot-toast";
import ToggleSwitch from "../../../../ui/ToggleSwitch";
import { publishHouse } from "../../../../services/houseService";
import { useNavigate } from "react-router-dom";

const EditHouseFinalSubmit = ({ houseId, refetchHouseData }) => {
  const [publishing, setPublishing] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleFinalSubmit = async () => {
    if (!confirmationChecked) return;

    setPublishing(true);
    setErrorMessages([]);
    setGeneralErrorMessage("");

    try {
      await publishHouse(houseId);
      toast.success("اقامتگاه با موفقیت ثبت شد.");
      navigate("/dashboard");
      
    } catch (error) {
      if (error.response?.data) {
        const { message, errors } = error.response.data;

        if (message) {
          setGeneralErrorMessage(message);
        }

        if (errors?.fields) {
          const formattedErrors = Object.values(errors.fields).flat();
          setErrorMessages(formattedErrors);
        } else {
          toast.error("خطایی در ثبت نهایی اقامتگاه رخ داده است.");
        }
      } else {
        toast.error("خطایی در ثبت نهایی اقامتگاه رخ داده است.");
      }
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex flex-col justify-end p-4">
      {/* Display General Error Message */}
      {generalErrorMessage && (
        <div className="bg-red-100 text-red-600 p-4 rounded-md mb-4">
          <h3 className="font-semibold">پیام خطا:</h3>
          <p>{generalErrorMessage}</p>
        </div>
      )}

      {/* Display Field-Specific Error Messages */}
      {errorMessages.length > 0 && (
        <div className="bg-red-100 text-red-600 p-4 rounded-md mb-4">
          <h3 className="font-semibold">خطاها:</h3>
          <ul className="list-disc list-inside">
            {errorMessages.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <div className="w-full flex justify-end">
        <button
          className={`btn w-44 shadow-centered bg-primary-600 text-white mt-4 ${
            !confirmationChecked ? "opacity-50" : ""
          }`}
          onClick={handleFinalSubmit}
          disabled={!confirmationChecked || publishing}
        >
          {publishing ? "در حال ثبت ..." : "ثبت نهایی اقامتگاه"}
        </button>
      </div>

      {/* Confirmation Toggle */}
      <div className="flex flex-col shadow-centered p-4 rounded-2xl justify-between mt-4">
        <ToggleSwitch
          checked={confirmationChecked}
          onChange={setConfirmationChecked}
          label="با قوانین و شرایط ثبت اقامتگاه موافقم"
        />
        <div className="mt-4  px-3 lg:px-5 scrollbar-thumb-primary-500 scrollbar-track-gray-200 p-2">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              میزبان متعهد می‌شود مشخصات اقامتگاهی که در سایت ثبت می‌کند، با اطلاعات و قوانین اقامتگاه (مانند دربست بودن، حیاط مشترک، آپارتمانی، مشاء، تعداد اتاق خواب و دوش، امکانات و قوانین رزرو) تداخل و مغایرت نداشته باشد.
            </li>
            <li>
              میزبان متعهد می‌شود اقامتگاه حداقل استانداردهای امنیت، نظافت، دسترسی و امکانات را دارا باشد.
            </li>
            <li>
              میزبان متعهد می‌شود قبل از ورود مهمانان، نظافت اقامتگاه (شامل جارو، نظافت یخچال، سینک ظرف‌شویی، سرویس بهداشتی، تعویض ملحفه، تخلیه سطل آشغال، تمیز کردن آب استخر و ...) را انجام داده و اقلام بهداشتی و امکانات مصرفی ثبت‌شده را تامین نماید.
            </li>
            <li>
              میزبان متعهد می‌شود خود یا نماینده قانونی‌اش، اقامتگاه را هنگام ورود مهمانان تحویل داده و تایید ورود مهمانان را در سایت برای انجام امور مالی ثبت نماید.
            </li>
            <li>
              میزبان متعهد می‌شود عکس‌ها، امکانات و شرایط اقامتگاه که در سایت وارد می‌کند یا ارائه می‌دهد واقعی باشند و در صورت تغییر، آن‌ها را در کمترین زمان ممکن به‌روز کند.
            </li>
            <li>
              میزبان آگاه است که مسئولیت انطباق امکانات، شرایط و عکس‌های اقامتگاه بر عهده اوست و در صورت مغایرت، سایت جات آجار می‌تواند رزرو را یک‌طرفه کنسل کرده، مبلغ مهمان را بازگرداند و ۲۰ درصد مبلغ پرداختی مهمان را از حساب بانک مجازی میزبان کسر کند.
            </li>
            <li>
              میزبان می‌تواند قیمت‌ها و تقویم اقامتگاه را تغییر دهد، مشروط به اینکه در تاریخ موردنظر، رزرو تایید نشده، در حال بررسی یا منتظر پرداخت مهمان نباشد.
            </li>
            <li>
              میزبان متعهد می‌شود در صورت فعال نبودن رزرو آنی، حداکثر طی ۳ ساعت پس از دریافت پیامک درخواست رزرو، آن را در پنل کاربری تایید یا رد کند. در غیر این صورت، درخواست رزرو به‌صورت خودکار لغو می‌شود.
            </li>
            <li>
              میزبان متعهد می‌شود پس از تایید درخواست مهمان، حداکثر ۳ ساعت اقامتگاه را تا پرداخت مبلغ توسط مهمان خالی نگه دارد. در صورتی که بخواهد در این مدت اقامتگاه را به مهمان دیگری اجاره دهد، باید مراتب را قبل از پر کردن اقامتگاه به جات آجار اعلام نماید.
            </li>
            <li>
              میزبان متعهد می‌شود تقویم قیمت، امکان رزرو و وضعیت پر یا خالی بودن اقامتگاه را همواره به‌روز نگه دارد تا امکان رزرو افزایش و رد رزرو کاهش یابد.
            </li>
            <li>
              میزبان در صورت فعال کردن رزرو سریع، موظف است تقویم اقامتگاه را کاملاً به‌روز نگه دارد. تبعات عدم به‌روز کردن تقویم بر عهده میزبان است.
            </li>
            <li>
              پس از تایید رزرو و تکمیل مراحل پرداخت، در صورت کنسل شدن رزرو از طرف هر یک از طرفین، قوانین لغو رزرو (سهل‌گیرانه، متعادل، سخت‌گیرانه) که میزبان در صفحه اقامتگاه انتخاب کرده است، اجرا خواهد شد.
            </li>
            <li>
              میزبان متعهد به عقد قرارداد فیزیکی با مهمان است و می‌تواند کارت شناسایی مهمان را تا پایان زمان اقامت نزد خود نگه دارد. در صورت نیاز، جات آجار می‌تواند قرارداد منعقدشده را از میزبان دریافت کند.
            </li>
            <li>
              کاربران برای ارتقاء حساب کاربری از مهمان به میزبان، باید مدرک شناسایی (کارت ملی) و جواز گردشگری اقامتگاه خود را در سایت بارگذاری کنند تا پنل کاربری توسط کارشناسان سایت به میزبان ارتقاء یابد.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditHouseFinalSubmit;
