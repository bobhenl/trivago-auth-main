"use client";

// Import required modules and components
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import AuthHeader from "@/components/headers/AuthHeader";
import AlertContainer from "@/components/forms/FormAlert";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  // Initialize Next.js router
  const router = useRouter();

  // States
  const [formAlertMsg, setFormAlertMsg] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Handle close form alert message
  const handleCloseFormAlertMsg = () => {
    setFormAlertMsg("");
  };

  // Get email from sessionStorage on component mount
  useEffect(() => {
    try {
      const storedEmail = sessionStorage.getItem("userEmail");
      if (!storedEmail) {
        // If email is not set in sessionStorage, redirect to the authentication page
        router.push("/auth");
      }
      // Set the email state variable from sessionStorage
      setEmail(storedEmail);
    } catch (error) {
      console.log(error);
      router.push("/auth");
    }
  }, [router]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  // Function to log in the user
  const loginUser = async (e) => {
    e.preventDefault();
    setFormAlertMsg("");
    setFormDisabled(true);

    try {
      // Send a request to the server to log in the user
      const response = await fetch("https://api-trivago.gangoo.eu/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      // Parse the response data
      const data = await response.json();

      if (!response.ok) {
        // If there is an error, display the error message
        const errorMsg = data.msg;
        console.log(errorMsg || "Server responded with an error.");
        setFormAlertMsg(errorMsg || "Server responded with an error.");
        setFormDisabled(false);
        return;
      }

      // If login is successful, redirect to the home page
      router.push("/");
    } catch (error) {
      console.log(error);
      setFormAlertMsg("An error occurred. Please try again later.");
    } finally {
      setFormDisabled(false);
    }
  };

  // If email is not set (loading from sessionStorage), show a loading screen
  if (!email) {
    return (
      <>
        <LoadingScreen />
      </>
    );
  }

  return (
    <>
      {/* Render the authentication header */}
      <AuthHeader />

      {/* Main content */}
      <main className="mx-auto my-20 max-w-[360px] px-4 xl:mt-0">
        <div className="mx-auto max-w-[328px]">
          {/* Navigation link to go back to the authentication page */}
          <nav>
            <Link href="/auth" className="mb-2 flex items-baseline gap-3.5">
              <Image
                src="/icons/chevron-left.svg"
                width="5"
                height="10"
                alt="left arrow"
                className=" h-[10px] w-[5px]"
              />
              <span className="text-secondary">{email}</span>
            </Link>
          </nav>

          {/* Page title */}
          <h1 className="mb-7 text-[2rem] font-bold leading-[1.25] text-secondary">
            Enter your password
          </h1>

          {/* Display form alert message, if any */}
          {formAlertMsg && (
            <AlertContainer
              alertMsg={formAlertMsg}
              onClose={handleCloseFormAlertMsg}
            />
          )}

          {/* Password input form */}
          <form className="flex flex-col" onSubmit={loginUser}>
            <div className="mb-[7px] flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-bold">
                Password
              </label>

              {/* Button to toggle password visibility */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="rounded px-1 py-0.5 hover:bg-gray-200"
              >
                <Image
                  src={
                    passwordVisible
                      ? "/icons/eye-open.svg"
                      : "/icons/eye-closed.svg"
                  }
                  width="24"
                  height="24"
                  alt="toggle password"
                  className="h-6 w-6"
                />
              </button>
            </div>
            <div className="mt-1 flex h-11 items-center justify-between gap-2 rounded-lg border-[1px] border-light-gray px-[6px] py-3 outline-1 outline-primary focus-within:outline">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                disabled={formDisabled}
                onChange={handlePasswordChange}
                id="password"
                className="w-full text-dark-gray outline-none disabled:bg-white"
                required
              ></input>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={formDisabled}
              className="mb-[15px] mt-4 h-[46.4px] cursor-pointer rounded-lg bg-primary px-3.5 font-bold text-white hover:bg-primary-current focus:border-2 focus:border-secondary disabled:cursor-default disabled:bg-primary-disabled"
            >
              Log in
            </button>
          </form>

          {/* Link to reset password */}
          <Link
            href="/forgot-password"
            className="text-primary underline underline-offset-4"
          >
            Forgot your password?
          </Link>
        </div>
      </main>
    </>
  );
}
