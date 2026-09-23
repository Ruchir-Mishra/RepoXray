import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  initAmbientBackground();
  initRouting();
  initLogoInteraction();
});

function initAmbientBackground() {
  const container = document.getElementById('ambient-background');
  if (!container) return;

  // Create a dynamic glow element that follows the cursor
  const glow = document.createElement('div');
  glow.className = 'ambient-glow';
  container.appendChild(glow);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  // Track mouse movement
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth animation loop for the glow
  function animateGlow() {
    // Easing factor (lower = smoother/slower)
    const easing = 0.05;
    
    glowX += (mouseX - glowX) * easing;
    glowY += (mouseY - glowY) * easing;

    glow.style.transform = `translate(calc(-50% + ${glowX - window.innerWidth / 2}px), calc(-50% + ${glowY - window.innerHeight / 2}px))`;

    requestAnimationFrame(animateGlow);
  }

  // Add click ripple effect
  window.addEventListener('pointerdown', (e) => {
    // Create ripple element
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    // Calculate ripple size based on viewport
    const size = Math.max(window.innerWidth, window.innerHeight) * 0.2;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    
    // Position ripple at click coordinates
    ripple.style.left = `${e.clientX - size/2}px`;
    ripple.style.top = `${e.clientY - size/2}px`;
    
    container.appendChild(ripple);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 800); // matches animation duration
  });

  animateGlow();
}

function initRouting() {
  const signupBtn = document.getElementById('signup-btn');
  const loginBtn = document.getElementById('login-btn');
  const appContainer = document.querySelector('.app-container');

  const navigateTo = (path) => {
    // Trigger transition out
    appContainer.classList.add('page-transition-out');
    
    // Simulate routing delay
    setTimeout(() => {
      console.log(`Navigated to ${path}`);
      // In a real app, update history and render new view here
      // For now, we reset the animation to simulate a new page load
      appContainer.classList.remove('page-transition-out');
      
      // Update URL without reloading (mock SPA behavior)
      window.history.pushState({}, '', path);
    }, 300);
  };

  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      navigateTo('/signup');
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      navigateTo('/login');
    });
  }
}

function initLogoInteraction() {
  const logo = document.getElementById('brand-logo');
  if (!logo) return;

  logo.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default navigation

    // Add haptic flash animation class
    logo.classList.remove('haptic-flash');
    // Trigger reflow to restart animation
    void logo.offsetWidth;
    logo.classList.add('haptic-flash');

    // Reset routing state (mock reload)
    setTimeout(() => {
      window.history.pushState({}, '', '/');
      console.log('Reset to welcome view');
    }, 300);
  });
}
