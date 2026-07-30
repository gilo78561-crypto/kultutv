import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const KEY = "kultu-intro-seen";

export function IntroSplash() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(KEY)) return;
    setVisible(true);
    window.sessionStorage.setItem(KEY, "1");
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <img src="/logo-icon.png" alt="" className="mx-auto h-20 w-auto" />
            <h1 className="display mt-6 text-5xl tracking-[calc(0.3em+1px)] md:text-7xl">KULTU</h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              className="gradient-ember mx-auto mt-4 h-[3px] w-56 origin-left rounded-full"
            />
            <p className="mt-4 text-xs uppercase tracking-[0.5em] text-muted-foreground">
              TV · Radio · Kultu Webzine
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
