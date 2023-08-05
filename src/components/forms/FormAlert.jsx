import Image from "next/image";

// AlertContainer component displays an alert message with a close button.
// Props:
// - alertMsg: The message to be displayed in the alert.
// - onClose: Function to be called when the close button is clicked.

export default function AlertContainer({ alertMsg, onClose }) {
  return (
    // Container for the alert message
    <div className="relative mb-4 flex rounded-lg border border-red bg-light-red py-4 pl-4 pr-10">
      {/* Close button */}
      <button onClick={onClose} className="absolute right-4 top-4">
        <Image
          src="/icons/xmark-solid.svg"
          height="16"
          width="16"
          alt="close cross"
          className="h-4 w-4"
        ></Image>
      </button>

      {/* Alert message */}
      <span className="text-sm">{alertMsg}</span>
    </div>
  );
}
