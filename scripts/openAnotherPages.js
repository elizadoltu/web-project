window.addEventListener('DOMContentLoaded', function() {
  const signUpButton = document.getElementById('sign-up-button');
  const logInUserButton = document.getElementById('log-in-button');
  const logInAsAdminButton = document.getElementById('log-in-as-admin-button');
  const continueButton = document.getElementById('continue-button-user');
  const recipeButton = document.getElementById('recipe-button');
  const adminButton = document.getElementById('admin-continue-button');
  const preferenceButton = document.getElementById('icon-favorite');
  const searchButton = document.getElementById('icon-search');
  const homeButton = document.getElementById('icon-home');
  const personButton = document.getElementById('icon-person');

  if (signUpButton) {
      signUpButton.addEventListener('click', function() {
          window.location.href = "/frontend/pages/signUpPage.html";
      });
  }

  if (logInUserButton) {
      logInUserButton.addEventListener('click', function() {
          window.location.href = "/frontend/pages/loginUserPage.html";
      });
  }

  if (logInAsAdminButton) {
      logInAsAdminButton.addEventListener('click', function() {
          window.location.href = "/frontend/pages/loginAdminPage.html";
      });
  }

  if (continueButton) {
      continueButton.addEventListener('click', function(event) {
          event.preventDefault();
          window.location.href = '/frontend/pages/foryouPage.html';
      });
  }

  if (recipeButton) {
      recipeButton.addEventListener('click', function(event) {
          event.preventDefault();
          window.location.href = '/frontend/pages/foryouPage.html';
      });
  }

  if (adminButton) {
      adminButton.addEventListener('click', function(event) {
          event.preventDefault();
          window.location.href = '/frontend/pages/adminPage.html';
      });
  }

  if (preferenceButton) {
      preferenceButton.addEventListener('click', function(event) {
          event.preventDefault();
          window.location.href = '/frontend/pages/preferencePage.html';
      });
  }

  if (searchButton) {
      searchButton.addEventListener('click', function(event) {
          event.preventDefault();
          window.location.href = '/frontend/pages/searchPage.html';
      });
  }

  if (homeButton) {
      homeButton.addEventListener('click', function(event) {
          event.preventDefault();
          window.location.href = '/frontend/pages/foryouPage.html';
      });
  }

  if (personButton) {
      personButton.addEventListener('click', function(event) {
          event.preventDefault();
          window.location.href = '/frontend/pages/userPage.html';
      });
  }
});
