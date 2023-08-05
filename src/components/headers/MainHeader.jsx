import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function MainHeader({ gotUserData, handleLogout }) {
  // States
  const [showMenu, setShowMenu] = useState(false);

  // Show the menu
  const displayMenu = () => {
    setShowMenu(true);
  };
  // Hide the menu
  const hideMenu = () => {
    setShowMenu(false);
  };

  return (
    <header className="mx-auto flex h-full w-full max-w-[980px] items-center justify-between px-3.5">
      <Link href="/">
        <Image
          src="/logos/logo.svg"
          width="102"
          height="32"
          alt="logo"
          className="h-[32px] w-[102px]"
          priority
        />
      </Link>

      {/* Navigation */}
      <nav>
        <ul>
          {/* If user data is not available, show login link */}
          {!gotUserData ? (
            <li>
              <Link
                href="/auth"
                className="flex h-[55px] items-center px-4 hover:bg-gray-200"
              >
                <Image
                  src="/icons/user.svg"
                  width="24"
                  height="24"
                  alt="user icon"
                  className="aspect-square"
                />
                <span className="hidden whitespace-nowrap px-2 text-sm sm:flex">
                  Log in
                </span>
              </Link>
            </li>
          ) : (
            /* If user data is available, show the profile menu */
            <li
              onMouseOver={displayMenu}
              onMouseOut={hideMenu}
              className="relative flex flex-col items-center"
            >
              {/* Profile menu button */}
              <button className="flex h-[55px] items-center px-4 hover:bg-gray-200">
                <Image
                  src="/icons/profile-icon.svg"
                  width="24"
                  height="24"
                  alt="profile icon"
                  className="aspect-square"
                />
                <span className="whitespace-nowrap px-2 text-sm max-sm:hidden">
                  Menu
                </span>
                <Image
                  src="/icons/chevron-left.svg"
                  width="12"
                  height="6"
                  alt="arrow"
                  className="ml-1 h-[12px] w-[6px] -rotate-90 max-md:hidden"
                />
              </button>

              {/* Profile menu dropdown */}
              {showMenu && (
                <div className="absolute top-12 flex w-[200px] flex-col items-center bg-transparent pt-3 max-lg:right-0">
                  <div className="relative flex w-full flex-col items-center rounded-md bg-white p-1 shadow-[rgba(0,0,0,0.35)_0px_0px_15px]">
                    <div className="absolute -top-1.5 h-4 w-4 rotate-45 bg-white max-lg:right-5"></div>
                    <a className="w-full cursor-pointer px-6 py-[14px] text-left text-sm font-normal text-secondary opacity-90 hover:bg-gray-200">
                      Account settings
                    </a>
                    <a className="w-full cursor-pointer px-6 py-[14px] text-left text-sm font-normal text-secondary opacity-90 hover:bg-gray-200">
                      Recently viewed
                    </a>
                    <a className="w-full cursor-pointer px-6 py-[14px] text-left text-sm font-normal text-secondary opacity-90 hover:bg-gray-200">
                      Help and support
                    </a>

                    {/* Log out button */}
                    <button
                      onClick={handleLogout}
                      className="w-full border-t border-gray-200 p-[14px] px-6 text-left text-sm font-normal text-secondary opacity-90 hover:bg-gray-200"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
