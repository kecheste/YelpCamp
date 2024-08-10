import Image from "next/image";

const LoginWithGoogleButton = () => {
  return (
    <button
      className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
      onClick={() => {}}
    >
      <Image
        src="/google-g-logo.svg"
        alt="Google logo"
        layout="intrinsic"
        height={20}
        width={20}
      />
      <div className="ml-2">Google</div>
    </button>
  );
};

export default LoginWithGoogleButton;
