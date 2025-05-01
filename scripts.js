// Smooth Scrolling
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Redirect for Bookings Link
    const bookingsLink = document.querySelector('nav ul li a[href="components/bookings.html"]');
    bookingsLink.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = 'components/bookings.html';
    });
});

// Image Carousel
document.addEventListener('DOMContentLoaded', function () {
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        let currentIndex = 0;
        const images = gallery.querySelectorAll('img');
        images.forEach((img, index) => {
            img.style.display = index === 0 ? 'block' : 'none';
        });

        setInterval(() => {
            images[currentIndex].style.display = 'none';
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].style.display = 'block';
        }, 3000); // Change image every 3 seconds
    }
});

// Form Validation
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.booking-container form');
    if (form) {
        form.addEventListener('submit', function (event) {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!isValid) {
                event.preventDefault();
                alert('Please fill out all required fields.');
            }
        });
    }
});

// Lazy Loading
document.addEventListener('DOMContentLoaded', function () {
    const lazyImages = document.querySelectorAll('img');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        observer.observe(img);
    });
});

// Interactive Animations
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseover', function () {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s ease-in-out';
        });

        button.addEventListener('mouseout', function () {
            this.style.transform = 'scale(1)';
        });
    });
});