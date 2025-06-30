import { LineWave, TailSpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <TailSpin
        visible={true}
        height="20"
        width="20"
        color="#FFFFFF"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};
import React, { useState, useEffect } from "react";
import { LoadingScreenProps } from "@/interfaces/typeinterfaces";

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  progress,
  showProgressBar = true,
  spinnerColor = "border-blue-500",
  backgroundColor = "bg-black bg-opacity-80",
  textColor = "text-white",
}) => {
  const [localProgress, setLocalProgress] = useState(0);

  // Simulate progress if not provided
  useEffect(() => {
    if (progress !== undefined) {
      setLocalProgress(progress);
      return;
    }

    const interval = setInterval(() => {
      setLocalProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center z-50 ${backgroundColor}`}
    >
      <div className="relative">
        {/* Spinner */}
        <div
          className={`w-12 h-12 border-4 border-opacity-30 rounded-full animate-spin ${spinnerColor}`}
          style={{ borderTopColor: "transparent" }}
        />

        {/* Optional center icon/text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold">⌛</span>
        </div>
      </div>

      {/* Message */}
      <p className={`mt-4 text-lg font-medium ${textColor}`}>{message}</p>

      {/* Progress bar */}
      {showProgressBar && (
        <div className="w-64 h-2 mt-6 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${localProgress}%` }}
          />
        </div>
      )}

      {/* Percentage indicator */}
      {showProgressBar && (
        <p className={`mt-2 text-sm ${textColor}`}>
          {Math.min(100, Math.round(localProgress))}%
        </p>
      )}

      {/* Optional dots animation */}
      <div className={`mt-2 flex space-x-1 ${textColor}`}>
        {[1, 2, 3].map((dot) => (
          <span
            key={dot}
            className="opacity-0 animate-pulse"
            style={{ animationDelay: `${dot * 0.2}s` }}
          >
            .
          </span>
        ))}
      </div>
    </div>
  );
};

export { LoadingScreen, Loader };
