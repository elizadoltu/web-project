// Function to get a cookie by name
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

// Function to set a cookie with SameSite and Secure attributes
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=None; Secure`;
}

document.addEventListener('DOMContentLoaded', function() {
    const email = getCookie('rememberedEmail');
    if (email) {
        fetch(`/api/getUserAllergies?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.allergies) {
                const allergiesContainer = document.getElementById('user-allergies');
                allergiesContainer.innerHTML = ''; // Clear existing content

                data.allergies.forEach(allergy => {
                    const allergyItem = document.createElement('div');
                    allergyItem.textContent = allergy;
                    allergiesContainer.appendChild(allergyItem);
                });
            } else {
                console.error('Error fetching allergies:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.error('No rememberedEmail cookie found');
    }
});

document.getElementById('update-button').addEventListener('click', function() {
    const email = getCookie('rememberedEmail'); // cookie created when logging in or when creating account
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;

    const userData = { email, newUsername, newPassword };

    fetch('/api/updateUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    }).then(response => {
        if (response.ok) {
            alert('Update successful');
        } else {
            response.text().then(text => alert('Error: ' + text));
        }
    });
});

// Dietary Preference Script
function updateDietaryPreference(preference) {
    const email = getCookie('rememberedEmail');

    fetch('/api/updateDietaryPreference', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, preference })
    }).then(response => {
        if (response.ok) {
            alert(`${preference.charAt(0).toUpperCase() + preference.slice(1)} preference updated successfully`);
        } else {
            response.text().then(text => alert('Error: ' + text));
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}

document.querySelector('.vegetarian-button').addEventListener('click', function() {
    updateDietaryPreference('vegetarian');
});

document.querySelector('.vegan-button').addEventListener('click', function() {
    updateDietaryPreference('vegan');
});

// Join Group Script
document.getElementById('join-group-button').addEventListener('click', function() {
    const groupId = document.getElementById('group-id').value;
    if (groupId.length === 4 && !isNaN(groupId)) {
        const email = getCookie('rememberedEmail');
        fetch('/api/joinGroup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, groupId })
        }).then(response => {
            if (response.ok) {
                setCookie('groupID', groupId, 1); // Set groupID cookie for 1 day
                alert('Joined group successfully');
            } else {
                response.text().then(text => alert('Error: ' + text));
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert('Please enter a valid 4-digit group ID');
    }
});

// Download Statistics
document.getElementById('download-csv').addEventListener('click', function() {
    const email = getCookie('rememberedEmail');
    window.location.href = `/api/generateCSV?email=${encodeURIComponent(email)}`;
});

document.getElementById('download-pdf').addEventListener('click', function() {
    const email = getCookie('rememberedEmail');
    window.location.href = `/api/generatePDF?email=${encodeURIComponent(email)}`;
});
