document.getElementById('admin-login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/loginAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Admin login successful') {
            window.location.href = '/frontend/pages/adminPage.html'; // Redirect to the admin page
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});
