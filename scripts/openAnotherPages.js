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
  
  window.addEventListener('DOMContentLoaded', function() {

const continueButton = document.getElementById('continue-button-user');

continueButton.addEventListener('click', function(event) {
  event.preventDefault(); 
    window.location.href = '/frontend/pages/foryouPage.html'; 
});
  });


  window.addEventListener('DOMContentLoaded', function() {
const recipeButton = document.getElementById('recipe-button');
    recipeButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/frontend/pages/foryouPage.html';
});
});

window.addEventListener('DOMContentLoaded', function() {
const adminButton = document.getElementById('admin-continue-button');
    adminButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/frontend/pages/adminPage.html';
});
});

window.addEventListener('DOMContentLoaded', function() {
const preferenceButton = document.getElementById('icon-favorite');
    preferenceButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/frontend/pages/preferencePage.html';
});
});





window.addEventListener('DOMContentLoaded', function() {
const searchButton = document.getElementById('icon-search');
searchButton.addEventListener('click', function(event) {
  event.preventDefault();
  window.location.href = '/frontend/pages/searchPage.html';
});

});

window.addEventListener('DOMContentLoaded', function() {
  const homeButton = document.getElementById('icon-home');
      homeButton.addEventListener('click', function(event) {
          event.preventDefault();
          window.location.href = '/frontend/pages/foryouPage.html';
  });
  });

  window.addEventListener('DOMContentLoaded', function() {
    const personButton = document.getElementById('icon-person');
        personButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/frontend/pages/userPage.html';
    });
    });