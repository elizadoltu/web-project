window.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('sign-up-button');
    const logInUserButton = document.getElementById('log-in-button');
    const logInAsAdminButton = document.getElementById('log-in-as-admin-button');
    signUpButton.addEventListener('click', function() {
 
      window.location.href = "/frontend/pages/signUpPage.html"; 
    });
    logInUserButton.addEventListener('click', function() {
      window.location.href = "/frontend/pages/loginUserPage.html";
    });
    logInAsAdminButton.addEventListener('click', function() {
      window.location.href = "/frontend/pages/loginAdminPage.html";
    });
    
  });
  

const continueButton = document.getElementById('continue-button-user');

continueButton.addEventListener('click', function(event) {
  event.preventDefault(); 
    window.location.href = '/frontend/pages/foryouPage.html'; 
});

const recipeButton = document.getElementById('recipe-button');
    recipeButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/frontend/pages/foryouPage.html';
});

const adminButton = document.getElementById('admin-continue-button');
    adminButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/frontend/pages/adminPage.html';
});
