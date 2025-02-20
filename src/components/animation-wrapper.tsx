"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, MotionProps } from "framer-motion";
import { memo, useEffect, useState, ReactNode } from "react";
type Animation = {
  initial: MotionProps["initial"];
  animate: MotionProps["animate"];
  exit: MotionProps["exit"];
};

interface AnimatedComponentProps {
  children: ReactNode;
  animation: Animation;
  pathname: string;
}
const AnimatedComponent = memo(
  ({ children, animation, pathname }: AnimatedComponentProps) => (
    <motion.div
      key={pathname}
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflowX: "hidden" }} // Prevents horizontal overflow during animation
    >
      {children}
    </motion.div>
  ),
  (prevProps, nextProps) => prevProps.pathname === nextProps.pathname // Only re-render when the pathname changes
);
AnimatedComponent.displayName = "AnimatedComponent";

const AnimationWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // Get the current route
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== currentPath) {
      setCurrentPath(pathname);
    }
  }, [pathname, currentPath]);

  const animations = {
    default: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 },
    },
    product: {
      initial: { opacity: 0, x: 100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -100 },
    },
    custom: (direction = 1) => ({
      initial: { opacity: 0, x: 100 * direction },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -100 * direction },
    }),
  };

  // Choose animation based on the route
  const getAnimation = () => {
    if (pathname.startsWith("/product")) return animations.product;
    if (pathname.startsWith("/custom")) return animations.custom(-1);
    return animations.default;
  };

  const animation = getAnimation();
  return (
    <AnimatePresence mode="wait">
      <AnimatedComponent animation={animation} pathname={pathname}>
        {children}
      </AnimatedComponent>
    </AnimatePresence>
  );
};

export default AnimationWrapper;
