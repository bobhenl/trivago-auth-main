"use client";

// Import required modules and components
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthHeader from "@/components/headers/AuthHeader";
import AlertContainer from "@/components/forms/FormAlert";
import SocialLoginButton from "@/components/buttons/SocialLoginButton";

export default function Auth() {
  // Initialize Next.js router
  const router = useRouter();

  // States
  const [formAlertMsg, setFormAlertMsg] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);
  const [email, setEmail] = useState("");

  // Handle close form alert message
  const handleCloseFormAlertMsg = () => {
    setFormAlertMsg("");
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Check if the submitted email exists
  const checkIfEmailExist = async (e) => {
    e.preventDefault();

    // Reset form alert message
    setFormAlertMsg("");

    // Disable form submission while processing
    setFormDisabled(true);

    try {
      // Send a request to the server to check if the email exists
      const response = await fetch("https://api-trivago.gangoo.eu/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      // Parse the response data
      const data = await response.json();

      if (!response.ok) {
        // If there is an error, display the error message
        const errorText = data.msg;
        console.log(errorText || "Server responded with an error.");
        setFormAlertMsg(errorText || "Server responded with an error.");
        return;
      }

      // Save the submitted email to sessionStorage for future use
      sessionStorage.setItem("userEmail", email);

      // If email doesn't exist, redirect to /register page
      if (!data.emailExist) {
        router.push("/register");
      } else {
        // If the email already exists, redirect to /login page
        router.push("/login");
      }
    } catch (error) {
      // If an error occurs during the API request, display error message
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
            Log in or create an account
          </h1>

          {/* Display form alert message, if any */}
          {formAlertMsg && (
            <AlertContainer
              alertMsg={formAlertMsg}
              onClose={handleCloseFormAlertMsg}
            />
          )}

          {/* Email input form */}
          <form className="flex flex-col" onSubmit={checkIfEmailExist}>
            <label
              htmlFor="email"
              className="mb-[7px] h-[18px] text-sm font-bold"
            >
              Your email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              disabled={formDisabled}
              className="lea mt-1 h-11 rounded-lg border-[1px] border-light-gray px-[6px] py-3 text-dark-gray outline-primary focus:outline-1 disabled:bg-white"
              required
            ></input>
            <button
              type="submit"
              disabled={formDisabled}
              className="mb-[15px] mt-4 h-[46.4px] cursor-pointer rounded-lg bg-primary px-3.5 font-bold text-white hover:bg-primary-current focus:border-2 focus:border-secondary disabled:cursor-default disabled:bg-primary-disabled"
            >
              Next
            </button>
          </form>

          {/* OR divider */}
          <div className="mb-[22px] flex items-center gap-4 text-gray-50">
            <div className="h-[1px] w-full bg-gray-50"></div>
            OR
            <div className="h-[1px] w-full bg-gray-50"></div>
          </div>

          {/* Social login buttons */}
          <SocialLoginButton
            service="Google"
            link="https://api-trivago.gangoo.eu/auth/google"
            logo="/logos/google.svg"
          />
          <SocialLoginButton service="Apple" link="" logo="/logos/apple.svg" />
          <SocialLoginButton
            service="Facebook"
            link=""
            logo="/logos/facebook.svg"
          />

          {/* Privacy policy and terms of use */}
          <div className="text-sm">
            By creating an account, you agree to our
            <a className="text-primary"> Privacy policy </a>
            and
            <a className="text-primary"> Terms of use</a>.
          </div>
        </div>
      </main>
    </>
  );
}
