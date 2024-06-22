document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/getUsers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.users) {
        const userListContainer = document.getElementById('user-list');
        userListContainer.innerHTML = ''; // Clear existing content
  
        data.users.forEach(user => {
          const userDiv = document.createElement('div');
          userDiv.classList.add('user');
          userDiv.innerHTML = `
            <span class="username">${user.username}</span>
            <button class="ban-button" data-email="${user.email}">Ban</button>
            <button class="unban-button" data-email="${user.email}">Unban</button>
            <button class="delete-button" data-email="${user.email}">Delete</button>
          `;
          userListContainer.appendChild(userDiv);
        });
  
        document.querySelectorAll('.ban-button').forEach(button => {
          button.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            fetch('/api/banUser', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email })
            })
            .then(response => response.json())
            .then(data => {
              if (data.message) {
                alert(data.message);
              } else {
                alert('Error banning user: ' + data.error);
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
          });
        });
  
        document.querySelectorAll('.unban-button').forEach(button => {
          button.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            fetch('/api/unbanUser', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email })
            })
            .then(response => response.json())
            .then(data => {
              if (data.message) {
                alert(data.message);
              } else {
                alert('Error unbanning user: ' + data.error);
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
          });
        });
  
        document.querySelectorAll('.delete-button').forEach(button => {
          button.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            fetch('/api/deleteUser', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email })
            })
            .then(response => response.json())
            .then(data => {
              if (data.message) {
                alert(data.message);
                // Optionally remove the user from the DOM
                this.parentElement.remove();
              } else {
                alert('Error deleting user: ' + data.error);
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
          });
        });
      } else {
        console.error('Error fetching users:', data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
  