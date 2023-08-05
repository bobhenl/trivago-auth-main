"use client";

// Import required modules and components
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import AuthHeader from "@/components/headers/AuthHeader";
import AlertContainer from "@/components/forms/FormAlert";
import Image from "next/image";
import Link from "next/link";

export default function ChangePassword() {
  // Initialize Next.js router
  const router = useRouter();

  //States
  const [formAlertMsg, setFormAlertMsg] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uppercaseCount, setUppercaseCount] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState("empty");

  // Handle close form alert message
  const handleCloseFormAlertMsg = () => {
    setFormAlertMsg("");
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  // Toggle Confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };
  // Handle confirm password input change
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
  };

  // Update password strength and count uppercase characters on password change
  useEffect(() => {
    setUppercaseCount(countUppercaseCharacters(password));
    setPasswordStrength(checkPasswordStrength(password));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, uppercaseCount]);

  // Count uppercase characters in the password
  const countUppercaseCharacters = (password) => {
    const onlyUppercaseCharacters = password.replace(/[^A-Z]/g, "");
    return onlyUppercaseCharacters.length;
  };

  // Determine password strength based on the password rules
  const checkPasswordStrength = (password) => {
    let passwordStrength = "";
    if (password) {
      passwordStrength = "weak";
      if (password.length >= 10 && uppercaseCount > 0) {
        passwordStrength = "mid";
        const numbersInPassword = password.match(/[\d]/g);
        if (numbersInPassword && numbersInPassword.length >= 2) {
          passwordStrength = "strong";
        }
      }
    }
    // console.log(passwordStrength)
    return passwordStrength;
  };

  // Handle Submit
  const submitNewPassword = async (e) => {
    e.preventDefault();

    setFormAlertMsg("");

    // If password is weak, show an alert message
    if (passwordStrength === "weak") {
      setFormAlertMsg(
        "Password must contain a minimum of 10 characters and at least 1 uppercase letter",
      );
      return;
    }

    // If passwords do not match, show an alert message
    if (password !== confirmPassword) {
      setFormAlertMsg("The two passwords do not match");
      document.getElementById("confirmPassword").focus();
      return;
    }

    // Disable form submission while processing
    setFormDisabled(true);

    const resetToken = window.location.pathname.split("/").pop(); // Extract the reset token from the URL
    try {
      // Send a request to the server to change password
      const response = await fetch(
        "https://api-trivago.gangoo.eu/auth/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: resetToken, newPassword: password }),
          credentials: "include",
        },
      );
      const data = await response.json();

      // Handle errors
      if (!response.ok) {
        const errorText = data.msg;
        console.log(errorText || "Server responded with an error.");
        setFormAlertMsg(errorText || "Server responded with an error.");
        return;
      }

      // Password change successful, redirect to the home page
      console.log(data.msg);
      router.push("/");
    } catch (error) {
      // Handle any errors that occur during the API request
      console.log(error);
      setFormAlertMsg("An error occurred. Please try again later.");
    } finally {
      // Enable form submission after processing
      setFormDisabled(false);
    }
  };

  return (
    <>
      {/* Render the authentication header */}
      <AuthHeader />

      {/* Main content */}
      <main className="mx-auto my-20 max-w-[360px] px-4 xl:mt-0">
        <div className="mx-auto max-w-[328px]">
          {/* Page title */}
          <h1 className="mb-7 text-[2rem] font-bold leading-[1.25] text-secondary">
            Now you can create a new password
          </h1>

          {/* Display form alert message, if any */}
          {formAlertMsg && (
            <AlertContainer
              alertMsg={formAlertMsg}
              onClose={handleCloseFormAlertMsg}
            />
          )}

          {/*New Password input form */}
          <form className="flex flex-col" onSubmit={submitNewPassword}>
            <div className="mb-[7px] flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-bold">
                Create new password
              </label>

              {/* Toggle new password visibility button */}
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

            {/* New password Input */}
            <div className="mt-1 flex h-11 items-center justify-between gap-2 rounded-lg border-[1px] border-light-gray px-[6px] py-3 outline-1 outline-primary focus-within:outline">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                disabled={formDisabled}
                onChange={handlePasswordChange}
                className="w-full text-dark-gray outline-none disabled:bg-white"
                required
              ></input>

              {/* Password strength indicator */}
              <div className="flex h-1 w-11 overflow-hidden rounded-sm bg-password-empty">
                <div
                  className={
                    passwordStrength === "weak"
                      ? "w-1/4 bg-password-weak duration-500"
                      : passwordStrength === "mid"
                      ? "w-1/2 bg-password-mid duration-500"
                      : passwordStrength === "strong"
                      ? "w-full bg-password-strong duration-500"
                      : "w-0 bg-password-weak duration-500"
                  }
                ></div>
              </div>
            </div>

            {/* Password strength requirements */}
            <div className="mb-[18px] mt-3.5">
              <p className="text-sm text-secondary">
                {passwordStrength === "mid" || passwordStrength === "strong"
                  ? "Your password is good and secure"
                  : "Your password should have at least:"}
              </p>
              <ul className="mt-2 flex flex-col text-sm text-gray-50">
                <li className="mb-[3px] flex items-center justify-between">
                  <span>• 10 characters</span>
                  <span className="font-bold">{password.length}/10</span>
                </li>
                <li className="mb-[3px] flex items-center justify-between">
                  <span>• 1 uppercase letter</span>
                  <span className="font-bold">{uppercaseCount}/1</span>
                </li>
              </ul>
            </div>

            <div className="mb-[7px] flex items-center justify-between">
              <label htmlFor="confirmPassword" className="text-sm font-bold">
                Confirm new password
              </label>

              {/* Toggle confirm new password visibility button */}
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="rounded px-1 py-0.5 hover:bg-gray-200"
              >
                <Image
                  src={
                    confirmPasswordVisible
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

            {/* Confirm new password Input */}
            <div className="mt-1 flex h-11 items-center justify-between gap-2 rounded-lg border-[1px] border-light-gray px-[6px] py-3 outline-1 outline-primary focus-within:outline">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                disabled={formDisabled}
                onChange={handleConfirmPasswordChange}
                className="w-full text-dark-gray outline-none disabled:bg-white"
                required
              ></input>
            </div>

            {/* Register button */}
            <button
              type="submit"
              disabled={formDisabled}
              className="mb-[15px] mt-4 h-[46.4px] cursor-pointer rounded-lg bg-primary px-3.5 font-bold text-white hover:bg-primary-current focus:border-2 focus:border-secondary disabled:cursor-default disabled:bg-primary-disabled"
            >
              Save
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
