// Function to handle login provider clicks
async function handleLogin(provider) {
  console.log(`Initiating sign-in with: ${provider}`);

  // Backend API URL (Replace with your actual backend URL when deployed, e.g. on Render/Heroku)
  const BACKEND_URL = 'http://localhost:5000/api/login';

  try {
    // Attempt to communicate with Express/MongoDB backend
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ provider, timestamp: new Date().toISOString() }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('MongoDB Log Success:', data);
      
      // Redirect to dashboard page
      window.location.href = 'dashboard.html';
    } else {
      throw new Error('Server responded with an error');
    }
  } catch (error) {
    console.warn('Backend unavailable or running on GitHub Pages standalone mode:', error.message);
    
    // Default fallback behavior for frontend testing on GitHub Pages
    alert(`Signed in with ${provider.toUpperCase()}!\n\n(Redirecting to dashboard...)`);
    
    // Uncomment this line to redirect to dashboard.html automatically
    // window.location.href = 'dashboard.html';
  }
}