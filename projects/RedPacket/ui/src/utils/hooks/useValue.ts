import { useState } from "react";

export const useValue = (val: object) => {
  const [value, _setValue] = useState(val);

  // 覆盖操作
  // isAll 支持全覆盖
  const setValue = (_val: object, isAll: boolean = false) => {
    if (isAll) {
      _setValue(_val);
    }
    _setValue({ ...value, ..._val });
  };
  return [value, setValue];
};
