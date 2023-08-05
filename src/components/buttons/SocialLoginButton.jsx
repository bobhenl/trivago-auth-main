import Image from "next/image";

// SocialLoginButton component displays a button for social login with a specified service.
// Props:
// - service: The name of the social login service (e.g., "Google", "Apple", "Facebook").
// - link: The URL to the authentication endpoint for the social login service.
// - logo: The URL of the logo for the social login service.

export default function SocialLoginButton({ service, link, logo }) {
  // Styles for the button
  const defaultStyle =
    "mb-[15px] grid grid-cols-[24px_auto] items-center rounded-lg border-[1px] border-tertiary p-3.5 text-center font-normal text-secondary hover:bg-gray-50 hover:text-white";
  // If 'link' is missing -> opacity 50%, pointer-events none
  const disabledStyle =
    "pointer-events-none mb-[15px] grid cursor-default grid-cols-[24px_auto] items-center rounded-lg border-[1px] border-tertiary p-3.5 text-center font-normal text-secondary opacity-50 hover:bg-gray-50 hover:text-white";

  // Render the social login button with the specified service and logo
  return (
    <a href={link} className={link ? defaultStyle : disabledStyle}>
      <Image
        src={logo}
        width={24}
        height={24}
        alt="service logo"
        className="aspect-square"
        priority
      />
      Continue with {service}
    </a>
  );
}
