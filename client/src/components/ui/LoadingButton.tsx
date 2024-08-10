import { ButtonHTMLAttributes } from "react";
import Spinner from "./Spinner";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

const LoadingButton = (props: LoadingButtonProps) => {
  return (
    <button
      className="transition-colors w-full bg-sky-400 text-white font-medium px-4 py-3 rounded-md hover:bg-sky-500 disabled:bg-sky-300"
      disabled={props.loading || props.disabled}
      {...props}
    >
      {props.loading ? (
        props.loadingText ? (
          props.loadingText
        ) : (
          <div className="w-full flex items-center justify-center">
            <Spinner theme="light" />
          </div>
        )
      ) : (
        props.children
      )}
    </button>
  );
};

export default LoadingButton;
