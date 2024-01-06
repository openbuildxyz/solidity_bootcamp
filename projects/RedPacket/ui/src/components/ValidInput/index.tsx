import { useFirst } from "@/utils/hooks/useFirst";
import { noop } from "@/utils/noop";
import { Input, type InputProps } from "@nextui-org/react";
import { ethers } from "ethers";
import React, { useEffect, useImperativeHandle } from "react";
import { useState } from "react";

type VaildInputProps =
  | {
      value?: any;
      onChange?: (val: any) => void;
      validate?: (val: any) => any;
      description?: string;
    }
  | InputProps;

// 验证相关逻辑
const useInvalid = ({ value, first, validate }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const innerValidateFunc = () => {
    if (!validate) {
      return true;
    }
    // 返回值为true或者报错信息
    const vaild = validate(value);
    if (vaild === true) {
      return true;
    } else {
      setErrorMessage(vaild);
      return false;
    }
  };

  const validateFunc = () => {
    if (first) return false;
    const key = innerValidateFunc();
    setIsInvalid(!key);
    return key;
  };

  useEffect(() => {
    validateFunc();
  }, [value]);

  return { errorMessage, isInvalid, validateFunc };
};

const InnerVaildInput = (
  { value, validate, onChange, description='', ...otherProps }: VaildInputProps,
  ref
) => {
  const first = useFirst(value);
  const { errorMessage, isInvalid, validateFunc } = useInvalid({
    value,
    first,
    validate,
  });
  useImperativeHandle(
    ref,
    () => ({
      validate: validateFunc,
    }),
    [validate]
  );
  return (
    <Input
      isInvalid={isInvalid}
      errorMessage={isInvalid && errorMessage}
      value={value}
      onChange={onChange}
      // 其他的参数设置
      {...otherProps}
      description={
        value > 0
          ? `${value}  link ${description}`
          : description
      }
    />
  );
};

const VaildInput = React.forwardRef(InnerVaildInput);

export default VaildInput;
