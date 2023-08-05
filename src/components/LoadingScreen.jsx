import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="flex h-screen flex-col items-center bg-white py-20">
      {/* Loading animation */}
      <Image
        src="/otherAssets/loading-animation.svg"
        width="80"
        height="80"
        alt="loading-animation"
        priority
      />
      {/* Loading text */}
      <p className="font-bold text-secondary">Loading...</p>
    </div>
  );
}
