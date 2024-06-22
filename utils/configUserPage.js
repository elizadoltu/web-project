// Function to get a cookie by name
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

window.addEventListener('DOMContentLoaded', function() {
    const username = getCookie('username');
    if (username) {
        document.getElementById('hey-username').textContent = `Hey, ${username}!`;
    }

    const buttons = document.querySelectorAll('#buttons-container button');
    const continueButton = document.getElementById('continue-and-submit-button');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const allergy = this.textContent;
            const email = sessionStorage.getItem('rememberedEmail');

            fetch('/api/addUserAllergy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, allergy })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });

    continueButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/frontend/pages/foryouPage.html';
    });
});
