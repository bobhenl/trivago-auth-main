"use client";

// Import required modules and components
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import AuthHeader from "@/components/headers/AuthHeader";
import AlertContainer from "@/components/forms/FormAlert";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
  // Initialize Next.js router
  const router = useRouter();

  //States
  const [formAlertMsg, setFormAlertMsg] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [uppercaseCount, setUppercaseCount] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState("empty");

  // Handle close form alert message
  const handleCloseFormAlertMsg = () => {
    setFormAlertMsg("");
  };

  // Get email from sessionStorage on component mount
  useEffect(() => {
    try {
      const storedEmail = sessionStorage.getItem("userEmail");
      if (!storedEmail) {
        // If email is not available in sessionStorage, redirect to authentication page
        router.push("/auth");
      } else {
        // Set the email state variable from sessionStorage
        setEmail(storedEmail);
      }
    } catch (error) {
      console.error("Error while retrieving email from sessionStorage:", error);
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

  // Register User
  const registerUser = async (e) => {
    e.preventDefault();

    setFormAlertMsg("");

    // If password is weak, show an alert message
    if (passwordStrength === "weak") {
      setFormAlertMsg(
        "Password must contain a minimum of 10 characters and at least 1 uppercase letter",
      );
      return;
    }

    // Disable form submission while processing
    setFormDisabled(true);

    try {
      // Send a request to the server to register the user
      const response = await fetch(
        "https://api-trivago.gangoo.eu/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
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

      // Registration successful, redirect to the home page
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
          {/* Back navigation link */}
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
            Create a password for your new account
          </h1>

          {/* Display form alert message, if any */}
          {formAlertMsg && (
            <AlertContainer
              alertMsg={formAlertMsg}
              onClose={handleCloseFormAlertMsg}
            />
          )}

          {/* Password input form */}
          <form className="flex flex-col" onSubmit={registerUser}>
            <div className="mb-[7px] flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-bold">
                Password
              </label>

              {/* Toggle password visibility button */}
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

            <div className="mb-[18px] mt-3.5">
              {/* Password strength information */}
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

            {/* Register button */}
            <button
              type="submit"
              disabled={formDisabled}
              className="mb-[15px] mt-4 h-[46.4px] cursor-pointer rounded-lg bg-primary px-3.5 font-bold text-white hover:bg-primary-current focus:border-2 focus:border-secondary disabled:cursor-default disabled:bg-primary-disabled"
            >
              Create account
            </button>
          </form>

          {/* Privacy policy and terms of use links */}
          <div className="text-sm">
            By creating an account, you agree to our
            <a href="" target="_blank" className="text-primary">
              {" "}
              Privacy policy{" "}
            </a>
            and
            <a href="" target="_blank" className="text-primary">
              {" "}
              Terms of use
            </a>
            .
          </div>
        </div>
      </main>
    </>
  );
}
