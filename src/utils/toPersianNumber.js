const toPersianNumber = (number) => {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const englishDigits = '0123456789';
  
    return number
      .toString()
      .split('')
      .map((digit) =>
        englishDigits.includes(digit) ? persianDigits[englishDigits.indexOf(digit)] : digit
      )
      .join('');
  };
  
  export default toPersianNumber;
  