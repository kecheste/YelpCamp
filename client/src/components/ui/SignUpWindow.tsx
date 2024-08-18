import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import LoadingButton from "./LoadingButton";
import LoginWithGoogleButton from "./LoginWithGoogleButton";
import Input from "./Input";
import { useAuthStore } from "@/stores/authStore";
import { useAuthWindowStore } from "@/stores/authWindow";
import toast from "react-hot-toast";

function SignUpWindow() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const register = useAuthStore((state) => state.register);

  const setSignUpWindowOpen = useAuthWindowStore(
    (state) => state.setSignUpOpen
  );

  const handleRegister = async () => {
    setLoading(true);
    try {
      if (email.length > 5 && username.length > 4 && password.length > 5) {
        await register(email, username, password);

        const { loading, user, error } = useAuthStore.getState();

        if (loading) {
          toast.loading("Registering...");
        } else {
          if (user) {
            toast.dismiss();
            toast.success("Registered successfully");
            setLoading(false);
            setSignUpWindowOpen(false);
          } else if (error) {
            toast.dismiss();
            toast.error(error);
            setLoading(false);
          } else {
            toast.dismiss();
            toast.error("Registration failed");
            setLoading(false);
          }
        }
      } else {
        toast.error(
          "Email, username, and password must meet the required length"
        );
        setLoading(false);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Registration failed");
      setLoading(false);
    }
  };

  const handleCloseSignUp = () => {
    setSignUpWindowOpen(false);
  };

  return (
    <div
      className="absolute lg:w-auto w-full h-auto bg-white rounded-lg flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Content of the absolute component */}
      <div className="flex flex-col divide-y divide-gray-400 items-center gap-4 w-full">
        <div className="flex items-center gap-6 px-4 pt-2 self-start w-full">
          <div className="cursor-pointer" onClick={handleCloseSignUp}>
            <RxCross1 size={20} color="black" />
          </div>
          <p className="text-black">Register with a new account</p>
        </div>
        <div className="flex gap-4 mb-5 flex-col px-2 py-4 sm:px-4 lg:px-6 w-full">
          {true ? (
            <div className="px-4 flex p-4 pb-10 gap-4 flex-col items-center w-full">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                name="email"
                type="text"
              />
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                name="username"
                type="text"
              />
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                name="password"
                type="password"
              />
              <LoadingButton
                onClick={() => handleRegister()}
                disabled={loading}
                loading={loading}
              >
                Sign Up
              </LoadingButton>
            </div>
          ) : (
            <div className="px-4 flex p-4 pb-10 gap-4 flex-col">
              <Input
                value={"phone"}
                onChange={(e) => {}}
                placeholder="Phone"
                name="phone"
                type="text"
              />
              <div id="recaptcha-container" />
              <LoadingButton onClick={() => {}} disabled={false} loading={true}>
                Send OTP
              </LoadingButton>
            </div>
          )}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or Sign Up with
              </span>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-3">
            <LoginWithGoogleButton />
          </div>
        </div>
      </div>
      {/* Content ends here */}
    </div>
  );
}

export default SignUpWindow;
