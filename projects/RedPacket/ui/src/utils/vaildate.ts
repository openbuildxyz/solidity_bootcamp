export const moneyVaildate = (val: number) => {
  if (val > 0) {
    return true;
  } else {
    return "金额不可为0";
  }
};
