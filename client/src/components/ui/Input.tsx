import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * @param props All props accepted by an input element
 * @returns
 */
const Input = (props: InputProps) => {
  return (
    <input
      className="border text-md text-gray-600 rounded-lg px-4 py-2 outline-none focus:border-gray-400 min-w-[400px]"
      {...props}
    />
  );
};

export default Input;
