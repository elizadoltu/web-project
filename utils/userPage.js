document.addEventListener('DOMContentLoaded', function() {
  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  const email = getCookie('rememberedEmail');
  if (email) {
    document.getElementById('email').textContent = email;

    fetch(`/api/getUserInfo?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.username) {
        document.getElementById('username').textContent = data.username;
      } else {
        document.getElementById('username').textContent = 'User not found';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('username').textContent = 'Error loading user';
    });
  } else {
    document.getElementById('username').textContent = 'No email found';
    document.getElementById('email').textContent = 'No email found';
  }

  document.getElementById('logout-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor behavior

    function deleteCookie(name) {
      document.cookie = name + '=; Max-Age=0; path=/;'; // Set the cookie expiration to the past
    }

    // Delete the rememberedEmail cookie
    deleteCookie('rememberedEmail');
    deleteCookie('rememberMe');

    // Redirect to index.html
    window.location.href = '/index.html';
  });
});
