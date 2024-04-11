window.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('sign-up-button');
    const logInUserButton = document.getElementById('log-in-button');
    const logInAsAdminButton = document.getElementById('log-in-as-admin-button');
    signUpButton.addEventListener('click', function() {
 
      window.location.href = "/frontend/pages/signUpPage.html"; // Replace with your HTML file path
    });
    logInUserButton.addEventListener('click', function() {
      window.location.href = "/frontend/pages/loginUserPage.html";
    });
    logInAsAdminButton.addEventListener('click', function() {
      window.location.href = "/frontend/pages/loginAdminPage.html";
    })
  
  });
  