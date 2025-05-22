// This ensures our scripts run only after the entire page is loaded.
document.addEventListener('DOMContentLoaded', function () {

    // --- DOM Elements: Getting references to parts of our HTML. ---
    const navLinks = document.querySelectorAll('nav ul li a[href^="#"]'); // All links in the nav that point to sections

    // Modal elements
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeButton = document.querySelector('.close-button');
    const galleryImages = document.querySelectorAll('.gallery img'); // All images in the gallery

    // --- Smooth Scrolling: Make clicking nav links scroll smoothly to sections. ---
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Stop the default jumpy scroll
            const targetId = this.getAttribute('href').substring(1); // Get the ID from the href (e.g., "home" from "#home")
            const targetElement = document.getElementById(targetId); // Find the element with that ID
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' }); // Scroll to it smoothly
            }
        });
    });

    // --- Redirect for Bookings Link: Open the bookings page in a new tab. ---
    const bookingsLink = document.querySelector('nav ul li a[href="components/bookings.html"]');
    if (bookingsLink) {
        bookingsLink.addEventListener('click', function (event) {
            event.preventDefault();
            window.open('components/bookings.html', '_blank');
        });
    }

    // --- Image Carousel (Desktop Only): Makes the gallery images slide automatically on large screens. ---
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        if (window.innerWidth > 768) { // Only run carousel on desktop
            let currentIndex = 0;
            const images = gallery.querySelectorAll('img');

            if (images.length > 0) {
                images.forEach(img => img.style.display = 'none');

                function showImage(index) {
                    images.forEach((img, i) => {
                        img.style.display = (i === index) ? 'block' : 'none';
                        if (i === index && img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                    });
                }

                showImage(currentIndex);

                if (images.length > 1) {
                    setInterval(() => {
                        currentIndex = (currentIndex + 1) % images.length;
                        showImage(currentIndex);
                    }, 3000);
                }
            }
        }
    }

    // --- Portfolio Image Modal Logic ---
    if (imageModal && modalImage && closeButton && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', function() {
                modalImage.src = this.src;
                imageModal.classList.add('active');
                document.body.classList.add('modal-open');
            });
        });

        closeButton.addEventListener('click', function() {
            imageModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        });

        imageModal.addEventListener('click', function(event) {
            if (event.target === imageModal) {
                imageModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && imageModal.classList.contains('active')) {
                imageModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    }


    // --- Form Validation & Submission (for components/bookings.html) ---
    const form = document.querySelector('.booking-container form');
    if (form) { // Only run this if we have a booking form
        form.addEventListener('submit', async function (event) { // Added 'async' keyword here
            event.preventDefault(); // Stop the default form submission

            const requiredInputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true; // Assume the form is valid until we find an empty required field

            // Client-side validation
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('input-error');
                } else {
                    input.classList.remove('input-error');
                }
            });

            if (!isValid) {
                alert('Please fill out all required fields.');
                return; // Stop function execution if validation fails
            }

            // If client-side validation passes, proceed with submission
            const formData = new FormData(form); // Collect form data
            const formEndpoint = form.getAttribute('action'); // Get the Formspree URL from the form's action attribute

            try {
                // Send form data to Formspree using fetch API
                const response = await fetch(formEndpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Formspree recommends this header
                    }
                });

                if (response.ok) { // Check if the submission was successful (HTTP status 200 OK)
                    alert('Booking request sent successfully! Winfred will get back to you shortly.');
                    form.reset(); // Clear the form fields
                } else {
                    // Handle cases where Formspree returns an error (e.g., rate limiting)
                    const data = await response.json(); // Try to parse error message if available
                    if (data.errors) {
                        alert('Error: ' + data.errors.map(err => err.message).join(', '));
                    } else {
                        alert('There was an error sending your booking request. Please try again later.');
                    }
                }
            } catch (error) {
                // Handle network errors (e.g., user is offline)
                console.error('Network error during form submission:', error);
                alert('A network error occurred. Please check your internet connection and try again.');
            }
        });

        // Add real-time feedback: remove error class when user starts typing
        const allFormInputs = form.querySelectorAll('input, select, textarea');
        allFormInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.classList.remove('input-error');
                }
            });
        });
    }

    // --- Lazy Loading: Loads images only when they're about to be seen on screen. ---
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            observer.observe(img);
        });
    } else {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
});