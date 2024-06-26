document.addEventListener('DOMContentLoaded', function () {
    const carouselPanel = document.querySelector('.carousel-panel');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const carouselLeftArrow = document.getElementById('carousel-left-arrow');
    const carouselRightArrow = document.getElementById('carousel-right-arrow');

    let currentIndex = 0;

    function updateCarousel() {
        const itemWidth = carouselItems[currentIndex].offsetWidth;
        const offset = -currentIndex * itemWidth;
        carouselPanel.style.transform = `translateX(${offset}px)`;
    }

    carouselLeftArrow.addEventListener('click', function () {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    carouselRightArrow.addEventListener('click', function () {
        if (currentIndex < carouselItems.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const carouselPanel = document.querySelector('.carousel-panel-2');
    const carouselItems = document.querySelectorAll('.carousel-item-2');
    const carouselLeftArrow = document.getElementById('carousel-left-arrow-2');
    const carouselRightArrow = document.getElementById('carousel-right-arrow-2');

    let currentIndex = 0;

    function updateCarousel() {
        const itemWidth = carouselItems[currentIndex].offsetWidth;
        const offset = -currentIndex * itemWidth;
        carouselPanel.style.transform = `translateX(${offset}px)`;
    }

    carouselLeftArrow.addEventListener('click', function () {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    carouselRightArrow.addEventListener('click', function () {
        if (currentIndex < carouselItems.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });
});
