import React from 'react';
import logo from "../../../public/assets/jatajarlogo.webp";
import TextField from '../../ui/TextField';
import Loading from '../../ui/Loading';

function SendOTPForm({ phone, onChange, onSubmit, loading, error }) {
  return (
    <div className="rounded-2xl  p-8 bg-gray-100 shadow-sm">
      <form onSubmit={onSubmit}>
        <div className="mb-2">
          <img src={logo} alt="Logo" className="max-w-40 mx-auto rounded-3xl" />
        </div>
        <p className="opacity-90 text-lg font-bold mb-5">ورود</p>

        <TextField
          name="phone"
          value={phone}
          onChange={onChange}
          label="شماره تلفن همراه خود را وارد کنید"
          placeholder="******0912"
        />

        <div className="my-3">
          {loading ? (
            <Loading />
          ) : (
            <button className="btn hover:bg-primary-700 bg-primary-600 w-full" type="submit">
              ارسال کد تایید
            </button>
          )}
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <p className="text-xs opacity-80 leading-normal">
          ثبت نام یا ورود شما به منظور پذیرش قوانین و مقررات جات آجار می باشد.
        </p>
      </form>
    </div>
  );
}

export default SendOTPForm;
