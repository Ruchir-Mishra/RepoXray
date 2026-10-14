/**
 * Repo X-Ray - Landing Page Script
 * Pure Vanilla JavaScript: Search validation, glassmorphism modal toggle, and real GitHub OAuth initiation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // DOM Elements
  // --------------------------------------------------------------------------
  const searchForm = document.getElementById('repo-search-form');
  const searchInput = document.getElementById('repo-url-input');
  const analyzeBtn = document.getElementById('analyze-button');
  const searchBar = document.querySelector('.search-bar');

  const openModalBtn = document.getElementById('github-nav-btn');
  const closeModalBtn = document.getElementById('modal-close-btn');
  const oauthModal = document.getElementById('oauth-modal');
  const modalSignInBtn = document.getElementById('modal-signin-btn');

  // --------------------------------------------------------------------------
  // Search Flow Functionality
  // --------------------------------------------------------------------------
  function handleSearch(event) {
    if (event) {
      event.preventDefault();
    }

    // Button bounce effect on click
    if (analyzeBtn) {
      analyzeBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        analyzeBtn.style.transform = '';
      }, 150);
    }

    const rawUrl = searchInput ? searchInput.value.trim() : '';

    // Empty URL Validation: Trigger visual shake animation
    if (!rawUrl) {
      if (searchBar) {
        searchBar.classList.remove('shake');
        // Force reflow to re-trigger CSS shake animation
        void searchBar.offsetWidth;
        searchBar.classList.add('shake');

        searchBar.addEventListener(
          'animationend',
          () => {
            searchBar.classList.remove('shake');
          },
          { once: true }
        );
      }
      if (searchInput) {
        searchInput.focus();
      }
      return;
    }

    // Valid URL: Redirect to dashboard with real encoded URL parameter
    const encodedUrl = encodeURIComponent(rawUrl);
    window.location.href = `dashboard.html?url=${encodedUrl}`;
  }

  if (searchForm) {
    searchForm.addEventListener('submit', handleSearch);
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', handleSearch);
  }

  // --------------------------------------------------------------------------
  // GitHub OAuth Modal Controls
  // --------------------------------------------------------------------------
  function openModal() {
    if (!oauthModal) return;
    oauthModal.classList.add('active');
    oauthModal.setAttribute('aria-hidden', 'false');
    if (openModalBtn) {
      openModalBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!oauthModal) return;
    oauthModal.classList.remove('active');
    oauthModal.setAttribute('aria-hidden', 'true');
    if (openModalBtn) {
      openModalBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  // Open modal on navbar <> GitHub click
  if (openModalBtn) {
    openModalBtn.addEventListener('click', openModal);
  }

  // Close modal on 'X' button click
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Close modal on overlay backdrop click
  if (oauthModal) {
    oauthModal.addEventListener('click', (event) => {
      if (event.target === oauthModal) {
        closeModal();
      }
    });
  }

  // Close modal on Escape key press
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && oauthModal && oauthModal.classList.contains('active')) {
      closeModal();
    }
  });

  // --------------------------------------------------------------------------
  // Real GitHub OAuth Initiation
  // --------------------------------------------------------------------------
  if (modalSignInBtn) {
    modalSignInBtn.addEventListener('click', () => {
      // Button click bounce
      modalSignInBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        modalSignInBtn.style.transform = '';
      }, 150);

      // Instantly initiate the real server-side GitHub OAuth flow
      window.location.href = '/api/auth/github';
    });
  }
});
