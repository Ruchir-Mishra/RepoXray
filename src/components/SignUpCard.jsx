import React from 'react';
import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", bounce: 0, duration: 0.4 }
  }
};

export function SignUpCard({ onNavigate }) {
  return (
    <motion.div
      className="content-wrapper glass-panel"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", bounce: 0, duration: 0.5 }}
    >
      <div className="signup-header">
        <motion.div 
          className="signup-title-container"
          layoutId="signup-button-bg"
          initial={{ borderRadius: 0, backgroundColor: "transparent" }}
          animate={{ backgroundColor: "transparent" }}
        >
          <motion.h1 
            layoutId="signup-title" 
            className="text-3xl font-bold text-white tracking-tight mb-8"
          >
            Sign up
          </motion.h1>
        </motion.div>
      </div>

      <motion.div 
        className="auth-buttons-container w-full flex flex-col gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.button variants={staggerItem} className="auth-btn group">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="auth-icon" />
          <span>Continue with Google</span>
        </motion.button>

        <motion.button variants={staggerItem} className="auth-btn group">
          <svg className="auth-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
          <span>Continue with GitHub</span>
        </motion.button>

        <motion.button variants={staggerItem} className="auth-btn group">
          <svg className="auth-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <span>Continue with Email</span>
        </motion.button>
      </motion.div>

      <motion.div 
        className="secondary-action mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="muted-text">Already a member?</span>
        <span 
          className="login-link hover:text-white cursor-pointer underline decoration-white/30 underline-offset-4 transition-colors" 
          onClick={() => onNavigate('login')}
        >
          Login
        </span>
      </motion.div>
    </motion.div>
  );
}
