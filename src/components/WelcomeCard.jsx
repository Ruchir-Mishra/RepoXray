import React from 'react';
import { motion } from 'framer-motion';
import { HeroHeading } from '../HeroHeading.jsx';

export function WelcomeCard({ onNavigate }) {
  return (
    <motion.div
      className="content-wrapper glass-panel"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", bounce: 0, duration: 0.5 }}
    >
      <motion.div 
        className="hero-section"
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <HeroHeading />
      </motion.div>

      <div className="actions-section">
        <motion.button 
          className="primary-btn" 
          onClick={() => onNavigate('signup')}
          layoutId="signup-button-bg"
          initial={{ borderRadius: 9999 }}
        >
          <motion.span layoutId="signup-title" className="inline-block relative z-10">
            Sign up
          </motion.span>
        </motion.button>
        
        <div className="secondary-action">
          <span className="muted-text">Already a member?</span>
          <button className="secondary-btn" onClick={() => onNavigate('login')}>Login</button>
        </div>
      </div>
    </motion.div>
  );
}
