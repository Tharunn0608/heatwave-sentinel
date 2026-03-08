import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="gradient-mesh absolute inset-0" />
      {/* Floating orbs */}
      <motion.div
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-[15%] w-72 h-72 rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, hsl(152, 68%, 38%), transparent 70%)' }}
      />
      <motion.div
        animate={{ y: [15, -25, 15], x: [8, -12, 8] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-40 right-[10%] w-96 h-96 rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, hsl(200, 75%, 42%), transparent 70%)' }}
      />
      <motion.div
        animate={{ y: [10, -15, 10] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-20 left-[40%] w-64 h-64 rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, hsl(38, 95%, 54%), transparent 70%)' }}
      />
    </div>
  );
}
