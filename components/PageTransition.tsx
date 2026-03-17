"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Cursor from "./Cursor";

const pageVariants = {
  initial: { opacity: 0, scale: 0.985, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1,     filter: "blur(0px)" },
  exit:    { opacity: 0, scale: 0.985, filter: "blur(4px)" },
};

const pageTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={pageTransition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <Cursor />
    </>
  );
}