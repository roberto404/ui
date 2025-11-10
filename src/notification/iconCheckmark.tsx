import React, { CSSProperties } from "react";
import { motion } from "framer-motion";

interface IconCheckmarkProps {
  size?: number;
  duration?: number;
  className?: string;
}

const IconCheckmark: React.FC<IconCheckmarkProps> = ({
  size = 20,
  duration = 1.5,
  className = "w-2 h-2 circle bg-green-dark",
}) => {

  const popIn = Math.min(0.6, duration * 0.45);
  const opacityDuration = Math.min(0.12, popIn * 0.25);

  const scaleKeyframes = [0.6, 1.12, 1];
  const strokeWidth = Math.max(1.6, size * 0.1);

  return (
    <motion.div
      aria-label="success"
      role="img"
      className={className}
      initial={{ opacity: 0, scale: scaleKeyframes[0] }}
      animate={{ opacity: 1, scale: scaleKeyframes }}
      transition={{
        opacity: {
          duration: opacityDuration,
          ease: "linear"
        },
        scale: {
          duration: popIn,
          times: [0, 0.6, 1],
          ease: [0.17, 0.67, 0.3, 1.01],
        },
      }}
    >
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full m-auto"
      >
        <motion.path
          d="M6 12.5l4 4L18 9"
          fill="none"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
            delay: popIn * 0.5,
          }}
        />
      </svg>
    </motion.div>
  );
};

export default IconCheckmark;