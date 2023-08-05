"use client";

// Import required modules and components
import { useState, useEffect } from "react";
import MainHeader from "@/components/headers/MainHeader";
import Image from "next/image";

export default function Home() {
  // States
  const [gotUserData, setGotUserData] = useState(false);
  const [userID, setUserID] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  // Fetch user data when the component mounts
  useEffect(() => {
    getUserData();
    sessionStorage.removeItem("userEmail");
  }, []);

  // Fetch user data from the server
  const getUserData = async () => {
    try {
      const response = await fetch("https://api-trivago.gangoo.eu/user", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        const errorText = data.msg;
        console.log(errorText || "Server responded with an error.");
        return;
      }

      // Update states with fetched user data
      setUserID(data.id);
      setUserEmail(data.email);
      setCreatedAt(data.createdAt);
      setGotUserData(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://api-trivago.gangoo.eu/auth/logout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (response.ok) {
        console.log("Logout successful");
        // Refresh the page after successful logout
        window.location.reload();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      {/* Render the main header */}
      <div className="flex h-14 flex-col border-b-[1px] border-light-gray px-0 sm:px-4">
        <MainHeader gotUserData={gotUserData} handleLogout={handleLogout} />
      </div>

      {/* Render user information if user data is available */}
      {gotUserData && (
        <main className="flex h-full flex-col items-center bg-white px-3.5 py-6 text-center">
          <div className="flex w-full max-w-sm flex-col items-start gap-1 rounded-md bg-gray-200 p-6 text-left">
            <div className="flex h-20 w-20 items-center justify-center self-center rounded-full bg-primary p-1">
              <Image
                src="/icons/profile-icon.svg"
                width="80"
                height="80"
                alt="profile picture"
                className="aspect-square h-full w-full"
                priority
              />
            </div>

            {/* User Account Information */}
            <p className=" mt-6 text-secondary">
              <b>Account informations</b>
            </p>
            <div className="mb-2 h-[1px] w-full bg-light-gray"></div>

            <p className="text-secondary">
              <b>User ID: </b>
              {userID}
            </p>
            <p className="text-secondary">
              <b>Email address: </b>
              {userEmail}
            </p>
            <p className="text-secondary">
              <b>Registered: </b>
              {createdAt.split("T")[0]}
            </p>
          </div>
        </main>
      )}
    </>
  );
}
