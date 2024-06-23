// Function to get session storage
function getSessionItem(name) {
    return sessionStorage.getItem(name);
}


// Check if the rememberMe session storage exists and redirect if it does
document.addEventListener('DOMContentLoaded', function() {
    const rememberMe = getSessionItem('rememberMe');
    if (rememberMe) {
        window.location.href = '/frontend/pages/foryouPage.html';
    }
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('terms').checked;

    fetch('/api/loginUser', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            sessionStorage.setItem('rememberedEmail', email);

            if (rememberMe) {
                sessionStorage.setItem('rememberMe', 'true');
            
            }

            window.location.href = '/frontend/pages/foryouPage.html'; 
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});
