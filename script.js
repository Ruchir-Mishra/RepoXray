// Function to send authentications request to Backend
async function handleLogin(provider) {
  console.log(`Logging in with ${provider}...`);

  try {
    // Replace URL with your Node.js server API route
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ provider }),
    });

    const data = await response.json();
    alert(data.message);
  } catch (error) {
    console.error('Error connecting to backend:', error);
    alert(`Attempted sign in with ${provider}. (Backend connection required)`);
  }
}
