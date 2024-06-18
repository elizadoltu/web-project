window.addEventListener('DOMContentLoaded', function() {
    const arrowBackButton1 = document.getElementById('arrow-nav-back');
    const arrowBackButton2 = document.getElementById('arrow-nav-back-preference');
    const arrowBackButton3 = document.getElementById('arrow-nav-back-options');
    const arrowBackButton4 = document.getElementById('arrow-nav-back-about');

    if (arrowBackButton1) {
        arrowBackButton1.addEventListener('click', function() {
            window.location.href = "/index.html";
        });
    }

    if (arrowBackButton2) {
        arrowBackButton2.addEventListener('click', function() {
            window.location.href = "/frontend/pages/foryouPage.html";
        });
    }

    if (arrowBackButton3) {
        arrowBackButton3.addEventListener('click', function() {
            window.location.href = "/frontend/pages/userPage.html";
        });
    }

    if (arrowBackButton4) {
        arrowBackButton4.addEventListener('click', function() {
            window.location.href = "/frontend/pages/userPage.html";
        });
    }
});
