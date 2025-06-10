import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl px-4 py-2 w-fit">
      <motion.div
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop",
          delay: 0.2,
        }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop",
          delay: 0.4,
        }}
      />
    </div>
  );
};

export default TypingIndicator; 