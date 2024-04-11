window.addEventListener('DOMContentLoaded', function() {
    const logoContainer = document.querySelector('.app-name-logo-container');
    const welcomeContainer = document.querySelector('.welcome-container');
    const buttonsContainer = document.querySelector('.buttons-container-landing');
  
    logoContainer.style.opacity = 0;
    logoContainer.style.transform = 'translateX(-60%)';  
    logoContainer.classList.add('slideInLeft');
  

    welcomeContainer.style.opacity = 0;
    welcomeContainer.style.transform = 'translateX(-20px)';  
    setTimeout(() => {
      welcomeContainer.classList.add('slideInLeft');
    }, 700); 
  

    buttonsContainer.style.opacity = 0;
    buttonsContainer.style.transform = 'translateX(-20px)'; 
    setTimeout(() => {
      buttonsContainer.classList.add('slideInLeft');
    }, 1000); 
  
  });

  