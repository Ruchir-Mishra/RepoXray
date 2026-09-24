import React, { useState } from 'react';

export function FooterLogo({ onReset }) {
  const [flash, setFlash] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setFlash(false);
    // Force reflow
    void document.body.offsetWidth;
    setFlash(true);
    
    // Allow animation to start before dispatching reset state
    setTimeout(() => {
      onReset();
    }, 150);
  };

  return (
    <footer className="footer">
      <div className="divider"></div>
      <a 
        href="/" 
        className={`repo-logo-btn ${flash ? 'haptic-flash' : ''}`} 
        onClick={handleClick}
        onAnimationEnd={() => setFlash(false)}
      >
        <span className="logo-text">Repo</span><span className="logo-x">X</span><span className="logo-text">ray</span>
      </a>
    </footer>
  );
}
