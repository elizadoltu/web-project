// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to delete a cookie
function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=0; path=/;';
}

// Check if the rememberMe cookie exists and redirect if it does
document.addEventListener('DOMContentLoaded', function() {
    const rememberedEmail = getCookie('rememberMe');
    if (rememberedEmail) {
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
            deleteCookie('rememberedEmail'); // Delete the existing cookie before setting it
            setCookie('rememberedEmail', email, 1); // Set cookie for 1 day

            if (rememberMe) {
                setCookie('rememberMe', 'true', 30); // Set cookie for 30 days
            }

            window.location.href = '/frontend/pages/foryouPage.html'; 
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});
