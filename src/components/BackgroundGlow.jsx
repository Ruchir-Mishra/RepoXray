import React, { useEffect, useRef } from 'react';

export function BackgroundGlow() {
  const containerRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    let animationFrameId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateGlow = () => {
      const easing = 0.05;
      glowX += (mouseX - glowX) * easing;
      glowY += (mouseY - glowY) * easing;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(calc(-50% + ${glowX - window.innerWidth / 2}px), calc(-50% + ${glowY - window.innerHeight / 2}px))`;
      }

      animationFrameId = requestAnimationFrame(animateGlow);
    };

    const handlePointerDown = (e) => {
      if (!containerRef.current) return;
      
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      
      const size = Math.max(window.innerWidth, window.innerHeight) * 0.2;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      
      ripple.style.left = `${e.clientX - size/2}px`;
      ripple.style.top = `${e.clientY - size/2}px`;
      
      containerRef.current.appendChild(ripple);
      
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 800);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('pointerdown', handlePointerDown);
    animateGlow();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div id="ambient-background" ref={containerRef}>
      <div className="ambient-glow" ref={glowRef}></div>
    </div>
  );
}
