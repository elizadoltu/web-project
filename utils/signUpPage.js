// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to delete a cookie
function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=0; path=/;';
}

document.getElementById('form-sign-up').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const terms = document.getElementById('terms').checked;

    if (!terms) {
        alert('You must agree to the terms and conditions');
        return;
    }

    const userData = { email, username, password };

    fetch('/api/registerUser', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    }).then(response => {
        if (response.ok) {
            alert('Registration successful');
            // Delete existing rememberedEmail cookie before setting it
            deleteCookie('rememberedEmail');
            // Set username in a cookie
            setCookie('rememberedEmail', email, 15);
            setCookie('username', username, 1); // Cookie expires in 1 day
            window.location.href = '/frontend/pages/configUserPage.html';
        } else {
            response.text().then(text => alert('Error: ' + text));
        }
    });
});
