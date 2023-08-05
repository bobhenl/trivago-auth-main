"use client";

// Import required modules and components
import { useState, useEffect } from "react";
import AuthHeader from "@/components/headers/AuthHeader";
import AlertContainer from "@/components/forms/FormAlert";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPassword() {
  // States
  const [formAlertMsg, setFormAlertMsg] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);
  const [showCheckYourEmail, setShowCheckYourEmail] = useState(false);

  // If userEmail is stored in sessionStorage, prefill the email input
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("userEmail") || "";
    setResetEmail(storedEmail);
  }, []);

  // Handle close form alert message
  const handleCloseFormAlertMsg = () => {
    setFormAlertMsg("");
  };

  // Handle email input change
  const handleResetEmialInputChange = (e) => {
    const enteredEmail = e.target.value;
    setResetEmail(enteredEmail);
  };

  const submitResetPassword = async (e) => {
    e.preventDefault();

    setFormAlertMsg("");

    // Disable form submission while processing
    setFormDisabled(true);

    try {
      const response = await fetch(
        "https://api-trivago.gangoo.eu/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail }),
        },
      );
      const data = await response.json();

      // Handle server error
      if (!response.ok) {
        const errorText = data.msg;
        console.log(errorText || "Server responded with an error.");
        setFormAlertMsg(errorText || "Server responded with an error.");
        return;
      }

      // console.log(data);
      setShowCheckYourEmail(true);
    } catch (error) {
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
          {/* Navigation link to go back to the login page */}
          <nav>
            <Link href="/login" className="mb-2 flex items-baseline gap-3.5">
              <Image
                src="/icons/chevron-left.svg"
                width="5"
                height="10"
                alt="left arrow"
                className=" h-[10px] w-[5px]"
              />
              <span className="text-secondary">Back</span>
            </Link>
          </nav>

          {/* Page title */}
          {showCheckYourEmail ? (
            <h1 className="mb-7 max-w-[300px] text-[2rem] font-bold leading-[1.25] text-secondary">
              Check your email
            </h1>
          ) : (
            <h1 className="mb-7 max-w-[200px] text-[2rem] font-bold leading-[1.25] text-secondary">
              Forgot your password? No problem!
            </h1>
          )}

          {/* Display form alert message, if any */}
          {formAlertMsg && (
            <AlertContainer
              alertMsg={formAlertMsg}
              onClose={handleCloseFormAlertMsg}
            />
          )}

          {/* Explanation paragraph */}
          <p className="mb-[14px] text-secondary">
            {showCheckYourEmail
              ? `If you have a trivago account with the email address you just entered (${resetEmail}), you should have an email from us with a link for resetting your password`
              : "Enter your email address and we will send you a link for the password reset."}
          </p>

          {/* Form to enter email */}
          {!showCheckYourEmail && (
            <form className="flex flex-col" onSubmit={submitResetPassword}>
              <label
                htmlFor="email"
                className="mb-[7px] h-[18px] text-sm font-bold"
              >
                Your email address
              </label>
              <input
                type="email"
                id="email"
                value={resetEmail}
                disabled={formDisabled}
                onChange={handleResetEmialInputChange}
                className="lea mt-1 h-11 rounded-lg border-[1px] border-light-gray px-[6px] py-3 text-dark-gray outline-primary focus:outline-1"
                required
              ></input>

              {/* Submit button */}
              <button
                type="submit"
                disabled={formDisabled}
                className="mb-[15px] mt-4 h-[46.4px] cursor-pointer rounded-lg bg-primary px-3.5 font-bold text-white hover:bg-primary-current focus:border-2 focus:border-secondary disabled:cursor-default disabled:bg-primary-disabled"
              >
                Send reset link
              </button>
            </form>
          )}

          {/* resend email option */}
          {showCheckYourEmail && (
            <>
              <div className="mt-10 text-secondary">
                Email did not arrive? Try{" "}
                <button
                  type="button"
                  onClick={submitResetPassword}
                  className="text-primary"
                >
                  resending
                </button>
                .
              </div>

              <div className="mt-5 text-secondary">
                Don’t have an account?{" "}
                <Link href="/register" className="text-primary">
                  Create account
                </Link>
                .
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
