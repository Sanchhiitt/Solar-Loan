import { motion } from "framer-motion";

export function BackgroundSuns() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Top-left corner sun (small) */}
      <motion.div 
        className="absolute top-8 left-8 w-24 h-24 sun-3d animate-rotate-slow"
        whileHover={{ scale: 1.1, filter: "brightness(1.2)" }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Top-right corner sun (medium) */}
      <motion.div 
        className="absolute top-12 right-12 w-32 h-32 sun-3d animate-rotate-reverse"
        whileHover={{ scale: 1.1, filter: "brightness(1.2)" }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Bottom-left corner sun (medium) */}
      <motion.div 
        className="absolute bottom-16 left-16 w-28 h-28 sun-3d animate-rotate-slow"
        style={{ animationDelay: "-5s" }}
        whileHover={{ scale: 1.1, filter: "brightness(1.2)" }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Bottom-right corner sun (small) */}
      <motion.div 
        className="absolute bottom-8 right-8 w-20 h-20 sun-3d animate-rotate-reverse"
        style={{ animationDelay: "-8s" }}
        whileHover={{ scale: 1.1, filter: "brightness(1.2)" }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Side floating suns */}
      <motion.div 
        className="absolute top-1/3 left-4 w-16 h-16 sun-3d animate-float"
        style={{ animationDelay: "-2s" }}
        whileHover={{ scale: 1.1, filter: "brightness(1.2)" }}
        transition={{ duration: 0.3 }}
      />
      <motion.div 
        className="absolute bottom-1/3 right-4 w-14 h-14 sun-3d animate-float"
        style={{ animationDelay: "-6s" }}
        whileHover={{ scale: 1.1, filter: "brightness(1.2)" }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Floating particles */}
      <motion.div 
        className="floating-particle w-2 h-2 top-1/4 left-1/4"
        style={{ animationDelay: "-1s" }}
        animate={{ 
          y: [0, -20, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="floating-particle w-1 h-1 top-3/4 right-1/4"
        style={{ animationDelay: "-3s" }}
        animate={{ 
          y: [0, -15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="floating-particle w-1.5 h-1.5 bottom-1/4 left-3/4"
        style={{ animationDelay: "-7s" }}
        animate={{ 
          y: [0, -25, 0],
          scale: [1, 1.08, 1]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Additional random particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="floating-particle"
          style={{
            width: Math.random() * 4 + 1 + 'px',
            height: Math.random() * 4 + 1 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animationDelay: Math.random() * 10 + 's'
          }}
          animate={{
            y: [0, -Math.random() * 30 - 10, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: Math.random() * 5 + 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
