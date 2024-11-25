const toPersianNumber = (input) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return input.toString().replace(/\d/g, (digit) => persianDigits[digit]);
  };
  
  export default toPersianNumber;
  